@echo off
title Matchaboy - Sales Tracker
cd /d "D:\Matchaboy\Matchaboy The App"

echo.
echo ============================================
echo   Matchaboy Sales Tracker
echo ============================================
echo.
echo [1/2] Starting Next.js server on port 3001...

:: Start Next.js server in background, logging output to server.log
START /B node "node_modules/next/dist/bin/next" start -H 0.0.0.0 -p 3001 > server.log 2>&1

:: Wait for server to be ready (poll port 3001)
echo Waiting for server to be ready...
:WAIT_LOOP
timeout /t 1 /nobreak > nul
netstat -ano | findstr ":3001" | findstr "LISTENING" > nul 2>&1
if errorlevel 1 goto WAIT_LOOP

echo Server is ready on http://localhost:3001
echo.
echo [2/2] Starting Cloudflare Tunnel...
echo.
echo ============================================
echo   Your public URL will appear below.
echo   Look for the trycloudflare.com URL
echo   (may take 10-15 seconds to appear)
echo.
echo   Keep this window open while using the app.
echo   Close this window to stop everything.
echo ============================================
echo.

:: Start tunnel in foreground (URL appears here)
node_modules\cloudflared\bin\cloudflared.exe tunnel --url http://localhost:3001

echo.
echo Tunnel stopped. Stopping server...
taskkill /FI "IMAGENAME eq node.exe" /FI "WINDOWTITLE eq Matchaboy*" /F > nul 2>&1
echo Done. Press any key to close.
pause > nul
