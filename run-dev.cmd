@echo off
cd /d "%~dp0"
start "ViVuGo Backend" cmd /k call "%~dp0run-backend-dev.cmd"
start "ViVuGo Client" cmd /k call "%~dp0run-client-dev.cmd"
echo Backend: http://localhost:8081/api/health
echo Client:  http://localhost:5173/
