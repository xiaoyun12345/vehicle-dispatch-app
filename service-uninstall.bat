@echo off
chcp 65001 >nul
echo ============================================
echo  卸载出车审批系统服务
echo ============================================
echo.

cd /d "%~dp0"

echo [1/3] 停止服务...
call npx pm2 delete vehicle-dispatch
echo.

echo [2/3] 移除开机自启...
schtasks /delete /tn "VehicleDispatchApp" /f >nul 2>&1
echo.

echo [3/3] 完成!
echo 服务已卸载。
echo.
pause
