@echo off
echo 🔄 Resetando Blog System...

REM Confirmação
set /p confirm="⚠️  Isso vai deletar TODOS os dados. Continuar? (y/N): "
if /i not "%confirm%"=="y" (
    echo ❌ Operação cancelada.
    pause
    exit /b 0
)

REM Parar e remover containers, volumes e networks
echo 🗑️  Removendo containers, volumes e networks...
docker-compose down -v --remove-orphans

REM Remover imagens do projeto
echo 🗑️  Removendo imagens...
docker-compose down --rmi all 2>nul

REM Limpar volumes órfãos
echo 🧹 Limpando volumes órfãos...
docker volume prune -f

REM Rebuild do zero
echo 🔨 Reconstruindo do zero...
docker-compose build --no-cache

echo.
echo ✅ Reset completo realizado!
echo.
echo Para iniciar o sistema: scripts\start.bat
pause