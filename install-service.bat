@echo off
chcp 65001 >nul
echo ============================================
echo  出车审批管理系统 - 安装为系统服务
echo ============================================
echo.

cd /d "%~dp0"

if not exist "node_modules" (
  echo [*] 正在安装依赖...
  call npm install
  echo.
)

if not exist "logs" mkdir logs

echo [1/4] 正在启动服务...
call npx pm2 start ecosystem.config.js
echo.

echo [2/4] 保存进程列表...
call npx pm2 save --force
echo.

echo [3/4] 设置开机自启...
schtasks /create /tn "VehicleDispatchApp" /tr "cmd.exe /c cd /d \"%~dp0\" ^&^& npx pm2 resurrect" /sc onstart /ru SYSTEM /rl HIGHEST /f >nul
echo.

echo [4/4] 完成!
echo.
echo ============================================
echo  服务已启动！
echo  访问地址: http://localhost:3000
echo  管理命令:
echo    service-stop.bat       停止服务
echo    service-start.bat      启动服务
echo    service-restart.bat    重启服务
echo    service-uninstall.bat  卸载开机自启
echo.
echo  提示: 如果想开机自动启动，请确保 PM2 服务已安装。
echo  如果更换了目录，请重新运行本脚本。
echo ============================================
echo.
pause
