@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required. Install Node.js 22 or newer, then try again.
  pause
  exit /b 1
)
set "PORT=4173"
set "SITE_BASE=/"
echo Starting site preview at http://127.0.0.1:%PORT%/
echo Keep this window open. Press Ctrl+C to stop the server.
node scripts/serve.mjs --open
if errorlevel 1 (
  echo Preview failed. Check the error above; port %PORT% may already be in use.
  pause
  exit /b 1
)
