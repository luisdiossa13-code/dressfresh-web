@echo off
title DressFresh
echo Iniciando DressFresh en http://localhost:3000 ...
start "" http://localhost:3000
node --no-warnings src\server.js
pause
