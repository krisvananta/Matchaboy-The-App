@echo off
title Matchaboy - Stopping...
echo Stopping Matchaboy server and tunnel...
taskkill /FI "WINDOWTITLE eq matchaboy-server*" /F > nul 2>&1
taskkill /IM cloudflared.exe /F > nul 2>&1
taskkill /FI "WINDOWTITLE eq Matchaboy*" /F > nul 2>&1
echo Done. All Matchaboy processes stopped.
timeout /t 2 /nobreak > nul
