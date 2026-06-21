const API = '/api/dispatches';

document.addEventListener('DOMContentLoaded', loadDispatches);

async function loadDispatches() {
  const date = document.getElementById('filterDate').value;
  const url = date ? `${API}?date=${date}` : API;
  try {
    const res = await fetch(url);
    const data = await res.json();
    renderTable(data);
  } catch (err) {
    console.error('加载数据失败:', err);
  }
}

function renderTable(records) {
  const tbody = document.getElementById('dispatchBody');
  const empty = document.getElementById('emptyMsg');
  if (!records || records.length === 0) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  const statusMap = { pending: '待审批', approved: '已同意', rejected: '已拒绝' };
  const statusClass = { pending: 'status-pending', approved: 'status-approved', rejected: 'status-rejected' };

  tbody.innerHTML = records.map((r, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${esc(r.departure_location)}</td>
      <td>${formatDT(r.departure_time)}</td>
      <td>${formatDT(r.return_time)}</td>
      <td>${esc(r.approver)}</td>
      <td>${esc(r.dispatcher)}</td>
      <td>${esc(r.vehicle_model)} · ${esc(r.vehicle_plate)}</td>
      <td>${esc(r.driver_name)}</td>
      <td><span class="status-badge ${statusClass[r.status]}">${statusMap[r.status]}</span></td>
      <td>
        <div class="action-group">
          ${r.status === 'pending' ? `
            <button class="btn btn-success btn-sm" onclick="approve(${r.id},'approved')">同意</button>
            <button class="btn btn-danger btn-sm" onclick="approve(${r.id},'rejected')">拒绝</button>
          ` : ''}
          <button class="btn btn-warning btn-sm" onclick="openEditModal(${r.id})">编辑</button>
          <button class="btn btn-danger btn-sm" onclick="deleteDispatch(${r.id})">删除</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function formatDT(dt) {
  if (!dt) return '';
  return dt.replace('T', ' ');
}

function esc(s) {
  const div = document.createElement('div');
  div.textContent = s ?? '';
  return div.innerHTML;
}

function openCreateModal() {
  document.getElementById('modalTitle').textContent = '新建出车申请';
  document.getElementById('dispatchForm').reset();
  document.getElementById('editId').value = '';
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const local = now.toISOString().slice(0, 16);
  document.getElementById('departure_time').value = local;
  document.getElementById('return_time').value = local;
  document.getElementById('modal').style.display = 'flex';
}

async function openEditModal(id) {
  try {
    const res = await fetch(`${API}/${id}`);
    const r = await res.json();
    document.getElementById('modalTitle').textContent = '编辑出车申请';
    document.getElementById('editId').value = r.id;
    document.getElementById('departure_location').value = r.departure_location;
    document.getElementById('departure_time').value = r.departure_time.replace(' ', 'T');
    document.getElementById('return_time').value = r.return_time.replace(' ', 'T');
    document.getElementById('approver').value = r.approver;
    document.getElementById('dispatcher').value = r.dispatcher;
    document.getElementById('vehicle_model').value = r.vehicle_model;
    document.getElementById('vehicle_plate').value = r.vehicle_plate;
    document.getElementById('driver_name').value = r.driver_name;
    document.getElementById('modal').style.display = 'flex';
  } catch (err) {
    console.error('获取记录失败:', err);
    alert('获取记录失败');
  }
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

async function saveDispatch(e) {
  e.preventDefault();
  const id = document.getElementById('editId').value;
  const body = {
    departure_location: document.getElementById('departure_location').value,
    departure_time: document.getElementById('departure_time').value,
    return_time: document.getElementById('return_time').value,
    approver: document.getElementById('approver').value,
    dispatcher: document.getElementById('dispatcher').value,
    vehicle_model: document.getElementById('vehicle_model').value,
    vehicle_plate: document.getElementById('vehicle_plate').value,
    driver_name: document.getElementById('driver_name').value,
  };
  try {
    const url = id ? `${API}/${id}` : API;
    const method = id ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || '保存失败');
    }
    closeModal();
    loadDispatches();
  } catch (err) {
    alert('保存失败: ' + err.message);
  }
}

async function approve(id, status) {
  const label = status === 'approved' ? '同意' : '拒绝';
  if (!confirm(`确定${label}该出车申请吗？`)) return;
  try {
    const res = await fetch(`${API}/${id}/approve`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('操作失败');
    loadDispatches();
  } catch (err) {
    alert(err.message);
  }
}

async function deleteDispatch(id) {
  if (!confirm('确定删除该出车记录吗？此操作不可撤销。')) return;
  try {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('删除失败');
    loadDispatches();
  } catch (err) {
    alert(err.message);
  }
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
