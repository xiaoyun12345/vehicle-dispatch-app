@echo off
chcp 65001 >nul
cd /d "%~dp0"
npx pm2 start ecosystem.config.js
echo 服务已启动: http://localhost:3000
pause
