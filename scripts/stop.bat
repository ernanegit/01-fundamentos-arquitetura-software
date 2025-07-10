@echo off
echo 🛑 Parando Blog System...

REM Parar todos os containers
echo ⏹️  Parando containers...
docker-compose down

REM Verificar se todos pararam
echo ✅ Verificando status...
docker-compose ps

echo.
echo ✅ Sistema parado com sucesso!
echo.
echo Para iniciar novamente: scripts\start.bat
echo Para reset completo: scripts\reset.bat
pause