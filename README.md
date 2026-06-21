# 出车审批管理系统

一个简单、轻量的出车审批管理 Web 应用，基于 Node.js + SQLite。

## 功能

- 新建出车申请（出车地点、出车时间、回来时间、审批人、派车人、车型号牌、司机姓名）
- 审批出车（同意 / 拒绝）
- 编辑 / 删除记录
- 按日期筛选
- 数据持久化存储（SQLite 文件数据库）

## 本地运行

1. **确保已安装 Node.js**（v18+ 均可）
2. 双击 `start.bat` 即可启动
3. 浏览器自动打开 http://localhost:3000

或者手动执行：
```bash
npm install
node server.js
```

## 部署到云端（免费，关电脑也能用）

### 方案一：Render（推荐）

1. 将本项目推送到 GitHub
2. 登录 https://dashboard.render.com
3. 点击 "New +" → "Web Service"
4. 连接你的 GitHub 仓库
5. 选择 "Node" 运行环境
6. 框架会自动识别 `render.yaml`，直接点 Deploy
7. 部署完成后会得到一个 `https://xxx.onrender.com` 的地址，随时可用

> 注意：Render 免费套餐在 15 分钟无访问后会休眠，再次访问会自动唤醒（几秒钟延迟）。

### 方案二：Railway

同样将代码推送到 GitHub 后，在 https://railway.app 导入仓库即可一键部署。

## 技术栈

- **后端**: Node.js + Express
- **数据库**: SQLite (better-sqlite3)
- **前端**: 原生 HTML + CSS + JavaScript
- **存储文件**: `dispatch.db`（自动创建在应用目录下）

## 目录结构

```
vehicle-dispatch-app/
├── public/
│   ├── index.html    # 前端页面
│   ├── style.css     # 样式
│   └── app.js        # 前端逻辑
├── server.js         # 后端服务
├── package.json      # 依赖配置
├── start.bat         # Windows 一键启动
├── render.yaml       # Render 部署配置
└── README.md         # 说明文档
```

## 数据安全

所有数据保存在 `dispatch.db` 文件中，备份该文件即可备份全部数据。
如要迁移到新电脑，只需复制整个文件夹，运行 `start.bat` 即可。
