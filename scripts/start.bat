@echo off
echo 🚀 Iniciando Blog System...

REM Verificar se Docker está rodando
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker não está rodando. Por favor, inicie o Docker Desktop primeiro.
    pause
    exit /b 1
)

REM Verificar se Docker Compose está disponível
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose não encontrado. Por favor, instale o Docker Compose.
    pause
    exit /b 1
)

echo 🔨 Fazendo build dos containers...
docker-compose build

echo 🏃 Iniciando serviços...
docker-compose up -d

REM Aguardar serviços ficarem prontos
echo ⏳ Aguardando serviços ficarem prontos...
timeout /t 10 /nobreak >nul

REM Verificar se todos os serviços estão rodando
echo ✅ Verificando status dos serviços...
docker-compose ps

echo.
echo 🎉 Sistema iniciado com sucesso!
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:8000
echo 🗄️  Database: localhost:5432
echo 💾 Redis: localhost:6379
echo.
echo Para parar o sistema, execute: scripts\stop.bat
pause