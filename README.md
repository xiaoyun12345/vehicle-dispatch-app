# 出车审批管理系统

一个简单、轻量的出车审批管理 Web 应用。

## 功能

- 新建出车申请（出车地点、出车时间、回来时间、审批人、派车人、车型号牌、司机姓名）
- 审批出车（同意 / 拒绝）
- 编辑 / 删除记录
- 按日期筛选
- 数据持久化存储（SQLite 文件数据库）

## 快速开始

### 首次使用（安装服务）

1. 确保电脑已安装 **Node.js**（v18+）
2. **双击 `install-service.bat`**，等待脚本自动完成
3. 浏览器打开 http://localhost:3000 即可使用

### 日常使用

- 双击 `service-start.bat` 启动服务
- 双击 `service-stop.bat` 停止服务
- 双击 `service-restart.bat` 重启服务

### 卸载

- 双击 `service-uninstall.bat` 移除服务

## 开机自启

`install-service.bat` 已自动在 Windows 计划任务中注册开机启动任务。
电脑启动后，服务会自动运行，无需手动启动。

## 手动运行（不安装服务）

双击 `start.bat` 即可启动，关掉窗口就停止。

## 部署到云端（关电脑也能用）

### 方案一：部署到 Render

1. 将本文件夹推送到你的 GitHub 仓库
2. 登录 https://dashboard.render.com
3. 点击 New+ → Web Service，连接你的 GitHub 仓库
4. 选择 Node 环境，Render 会自动识别 render.yaml
5. 点击 Deploy，部署完成后会得到一个 `https://xxx.onrender.com` 的地址

### 方案二：部署到 Railway

同样将代码推送到 GitHub 后，在 https://railway.app 导入仓库即可。

## 技术栈

- 后端: Node.js + Express
- 数据库: SQLite (sql.js)
- 进程管理: PM2
- 前端: 原生 HTML + CSS + JavaScript

## 目录结构

```
vehicle-dispatch-app/
├── public/
│   ├── index.html      # 前端页面
│   ├── style.css       # 样式
│   └── app.js          # 前端逻辑
├── server.js           # 后端服务
├── package.json        # 依赖配置
├── ecosystem.config.js # PM2 进程配置
├── start.bat           # 临时运行（关闭窗口即停止）
├── install-service.bat # 安装为系统服务（推荐）
├── service-start.bat   # 启动服务
├── service-stop.bat    # 停止服务
├── service-restart.bat # 重启服务
├── service-uninstall.bat # 卸载服务
├── render.yaml         # Render 部署配置
├── logs/               # 运行日志
└── README.md           # 本文件
```

## 数据备份

所有数据保存在 `dispatch.db` 文件中（首次运行后自动创建）。
备份该文件即可备份全部出车记录数据。
要迁移到新电脑，复制整个文件夹 → 安装 Node.js → 运行 `install-service.bat`。
