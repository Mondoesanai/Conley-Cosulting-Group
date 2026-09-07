@echo off
title Conley Consulting Group - Local Server
cd /d "%~dp0"
echo.
echo   Starting Conley Consulting Group website...
echo   Opening http://localhost:3130 in your browser.
echo.
echo   Leave this window open while you view the site.
echo   Close it (or press Ctrl+C) to stop the server.
echo.
start "" http://localhost:3130
node serve.mjs
pause
