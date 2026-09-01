@echo off
REM Start Expo web server from the project-local binary in mobile-app
REM Uses a temporary process-scoped PowerShell bypass to avoid system execution policy issues.
PowerShell -NoProfile -ExecutionPolicy Bypass -Command "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass | Out-Null"
cd /d "%~dp0"
if exist "node_modules\.bin\expo.cmd" (
  echo Starting Expo (web) on port 19006...
  call "node_modules\.bin\expo.cmd" start --web --port 19006
) else (
  echo ERROR: local Expo CLI not found. Run npm install first.
  exit /b 1
)
pause