# Script para testar o sistema de progresso do MS-900 Study Site
# Executa o site localmente e abre no navegador para teste

Write-Host "🚀 Testando sistema de progresso MS-900..." -ForegroundColor Green

# Verificar se Python está instalado
try {
    $pythonVersion = python --version 2>$null
    if ($pythonVersion) {
        Write-Host "✅ Python encontrado: $pythonVersion" -ForegroundColor Green
        
        # Navegar para a pasta do projeto
        $projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
        Set-Location $projectPath
        
        Write-Host "📂 Pasta do projeto: $projectPath" -ForegroundColor Yellow
        
        # Iniciar servidor HTTP local
        Write-Host "🌐 Iniciando servidor local na porta 8000..." -ForegroundColor Cyan
        Write-Host "📋 Instruções de teste:" -ForegroundColor Yellow
        Write-Host "   1. O navegador será aberto automaticamente" -ForegroundColor White
        Write-Host "   2. Navegue para uma das páginas de fase (Dias 1-2, etc.)" -ForegroundColor White
        Write-Host "   3. Marque algumas tarefas como concluídas" -ForegroundColor White
        Write-Host "   4. Observe se a barra de progresso atualiza" -ForegroundColor White
        Write-Host "   5. Recarregue a página e veja se o progresso foi salvo" -ForegroundColor White
        Write-Host "   6. Use Ctrl+C para parar o servidor" -ForegroundColor White
        Write-Host ""
        
        # Aguardar 3 segundos antes de iniciar
        Start-Sleep -Seconds 3
        
        # Abrir navegador
        Start-Process "http://localhost:8000"
        
        # Iniciar servidor Python
        python -m http.server 8000
        
    }
} catch {
    Write-Host "❌ Python não encontrado. Tentando usar Node.js..." -ForegroundColor Yellow
    
    try {
        $nodeVersion = node --version 2>$null
        if ($nodeVersion) {
            Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
            
            # Verificar se http-server está instalado
            $httpServer = npm list -g http-server 2>$null
            if (-not $httpServer -like "*http-server*") {
                Write-Host "📦 Instalando http-server..." -ForegroundColor Cyan
                npm install -g http-server
            }
            
            # Iniciar servidor
            Write-Host "🌐 Iniciando servidor local..." -ForegroundColor Cyan
            Start-Process "http://localhost:8080"
            http-server -p 8080
        }
    } catch {
        Write-Host "❌ Nem Python nem Node.js foram encontrados." -ForegroundColor Red
        Write-Host "📋 Para testar o site:" -ForegroundColor Yellow
        Write-Host "   1. Instale Python ou Node.js" -ForegroundColor White
        Write-Host "   2. Execute este script novamente" -ForegroundColor White
        Write-Host "   3. Ou abra o arquivo index.html diretamente no navegador" -ForegroundColor White
        pause
    }
}
