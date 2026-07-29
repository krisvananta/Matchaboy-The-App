@echo off
title Matchaboy - Pinggy Tunnel Backup
cd /d "D:\Matchaboy\Matchaboy The App"

echo.
echo ============================================
echo   Matchaboy Sales Tracker (Pinggy Tunnel)
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
echo [2/2] Starting Pinggy Tunnel...
echo.
echo ============================================
echo   Your public URL will appear below.
echo   Look for the https://*.pinggy.link URL
echo.
echo   Keep this window open while using the app.
echo   Close this window to stop everything.
echo ============================================
echo.

:TUNNEL_LOOP
ssh -p 443 -R0:localhost:3001 -o StrictHostKeyChecking=no -o ServerAliveInterval=30 a.pinggy.io

echo.
echo [WARNING] Pinggy Tunnel disconnected. Retrying in 5 seconds...
timeout /t 5 /nobreak > nul
goto TUNNEL_LOOP
