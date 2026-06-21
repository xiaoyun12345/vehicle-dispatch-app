const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

const DB_PATH = path.join(__dirname, 'dispatch.db');

let db = null;

// 数据库操作工具
function query(sql, params = []) {
  const stmt = db.prepare(sql);
  if (sql.trim().toUpperCase().startsWith('SELECT')) {
    const rows = [];
    while (stmt.step()) {
      rows.push(stmt.getAsObject(params));
    }
    stmt.free();
    return rows;
  }
  const result = stmt.run(params);
  stmt.free();
  return result;
}

function getOne(sql, params = []) {
  const rows = query(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

function saveToDisk() {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

// 初始化数据库
async function initDB() {
  const initSqlJs = require('sql.js');
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const buf = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buf);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS dispatches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      departure_location TEXT NOT NULL,
      departure_time TEXT NOT NULL,
      return_time TEXT NOT NULL,
      approver TEXT NOT NULL,
      dispatcher TEXT NOT NULL,
      vehicle_model TEXT NOT NULL,
      vehicle_plate TEXT NOT NULL,
      driver_name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    )
  `);
  saveToDisk();
  console.log('数据库初始化完成');
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 获取所有出车记录
app.get('/api/dispatches', (req, res) => {
  const { date } = req.query;
  let rows;
  if (date) {
    rows = query(
      "SELECT * FROM dispatches WHERE date(departure_time) = ? ORDER BY departure_time DESC",
      [date]
    );
  } else {
    rows = query("SELECT * FROM dispatches ORDER BY departure_time DESC");
  }
  res.json(rows);
});

// 获取单条记录
app.get('/api/dispatches/:id', (req, res) => {
  const record = getOne("SELECT * FROM dispatches WHERE id = ?", [Number(req.params.id)]);
  if (!record) return res.status(404).json({ error: '记录不存在' });
  res.json(record);
});

// 创建出车记录
app.post('/api/dispatches', (req, res) => {
  const { departure_location, departure_time, return_time, approver, dispatcher, vehicle_model, vehicle_plate, driver_name } = req.body;
  if (!departure_location || !departure_time || !return_time || !approver || !dispatcher || !vehicle_model || !vehicle_plate || !driver_name) {
    return res.status(400).json({ error: '所有字段均为必填' });
  }
  db.run(`
    INSERT INTO dispatches (departure_location, departure_time, return_time, approver, dispatcher, vehicle_model, vehicle_plate, driver_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [departure_location, departure_time, return_time, approver, dispatcher, vehicle_model, vehicle_plate, driver_name]);
  saveToDisk();
  const record = getOne("SELECT * FROM dispatches ORDER BY id DESC LIMIT 1");
  res.status(201).json(record);
});

// 更新出车记录
app.put('/api/dispatches/:id', (req, res) => {
  const id = Number(req.params.id);
  const { departure_location, departure_time, return_time, approver, dispatcher, vehicle_model, vehicle_plate, driver_name } = req.body;
  const existing = getOne("SELECT * FROM dispatches WHERE id = ?", [id]);
  if (!existing) return res.status(404).json({ error: '记录不存在' });

  db.run(`
    UPDATE dispatches SET
      departure_location = ?, departure_time = ?, return_time = ?,
      approver = ?, dispatcher = ?, vehicle_model = ?, vehicle_plate = ?, driver_name = ?,
      updated_at = datetime('now', 'localtime')
    WHERE id = ?
  `, [
    departure_location ?? existing.departure_location,
    departure_time ?? existing.departure_time,
    return_time ?? existing.return_time,
    approver ?? existing.approver,
    dispatcher ?? existing.dispatcher,
    vehicle_model ?? existing.vehicle_model,
    vehicle_plate ?? existing.vehicle_plate,
    driver_name ?? existing.driver_name,
    id
  ]);
  saveToDisk();
  const updated = getOne("SELECT * FROM dispatches WHERE id = ?", [id]);
  res.json(updated);
});

// 审批：同意 / 拒绝
app.patch('/api/dispatches/:id/approve', (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: '状态值无效，必须是 approved 或 rejected' });
  }
  const existing = getOne("SELECT * FROM dispatches WHERE id = ?", [id]);
  if (!existing) return res.status(404).json({ error: '记录不存在' });

  db.run("UPDATE dispatches SET status = ?, updated_at = datetime('now', 'localtime') WHERE id = ?", [status, id]);
  saveToDisk();
  const updated = getOne("SELECT * FROM dispatches WHERE id = ?", [id]);
  res.json(updated);
});

// 删除出车记录
app.delete('/api/dispatches/:id', (req, res) => {
  const id = Number(req.params.id);
  const existing = getOne("SELECT * FROM dispatches WHERE id = ?", [id]);
  if (!existing) return res.status(404).json({ error: '记录不存在' });
  db.run("DELETE FROM dispatches WHERE id = ?", [id]);
  saveToDisk();
  res.json({ message: '删除成功' });
});

// 启动服务
initDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log('=== 出车审批管理系统已启动 ===');
    console.log('访问地址: http://localhost:' + PORT);
    console.log('数据库文件: ' + DB_PATH);
  });
}).catch(err => {
  console.error('数据库初始化失败:', err);
  process.exit(1);
});
