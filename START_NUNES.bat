@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Node.js 20+ is required. Install from https://nodejs.org/en/download
 pause
 exit /b 1
)
start "" "http://127.0.0.1:5078"
node server.js
pause
