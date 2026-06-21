@echo off
chcp 65001 >nul
echo ============================================
echo    出车审批管理系统 - 启动中...
echo ============================================
echo.

cd /d "%~dp0"

if not exist "node_modules" (
  echo [*] 首次运行，正在安装依赖...
  call npm install
  echo.
)

echo [*] 启动服务...
start "" http://localhost:3000
node server.js
pause
