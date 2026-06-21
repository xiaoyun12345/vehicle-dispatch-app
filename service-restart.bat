@echo off
chcp 65001 >nul
cd /d "%~dp0"
npx pm2 restart ecosystem.config.js
echo 服务已重启: http://localhost:3000
pause
