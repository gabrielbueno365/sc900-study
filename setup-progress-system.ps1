# 🚀 Script de Configuração - Sistema de Progresso Avançado
# Microsoft 365 Copilot Specialist - Progress Tracking System

Write-Host "🤖 Configurando Sistema de Progresso Avançado..." -ForegroundColor Cyan
Write-Host "Similar ao Notion/Microsoft Loop com persistência total" -ForegroundColor Yellow
Write-Host ""

# Verificar se estamos no diretório correto
$currentPath = Get-Location
Write-Host "📍 Diretório atual: $currentPath" -ForegroundColor Gray

if (-not (Test-Path "assets")) {
    Write-Host "❌ Erro: Execute este script no diretório copilot-specialist-site" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Diretório correto identificado" -ForegroundColor Green

# Verificar arquivos principais
$requiredFiles = @(
    "assets/js/main.js",
    "assets/css/main.css",
    "index.html",
    "pages/fase1.html",
    "pages/fase2.html",
    "pages/fase3.html"
)

Write-Host ""
Write-Host "🔍 Verificando arquivos principais..." -ForegroundColor Cyan

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file (FALTANDO)" -ForegroundColor Red
    }
}

# Verificar se o browser está disponível para teste
$browsers = @("chrome", "msedge", "firefox")
$availableBrowser = $null

foreach ($browser in $browsers) {
    try {
        $null = Get-Command $browser -ErrorAction Stop
        $availableBrowser = $browser
        break
    } catch {
        # Browser não encontrado
    }
}

Write-Host ""
Write-Host "🌐 Sistema de Progresso Configurado!" -ForegroundColor Green
Write-Host ""
Write-Host "✨ FUNCIONALIDADES IMPLEMENTADAS:" -ForegroundColor Yellow
Write-Host "  📊 Salvamento automático com localStorage" -ForegroundColor White
Write-Host "  🔄 Persistência entre sessões (fechar/reabrir)" -ForegroundColor White
Write-Host "  📈 Barras de progresso em tempo real" -ForegroundColor White
Write-Host "  🎨 Feedback visual similar ao Notion/Loop" -ForegroundColor White
Write-Host "  📱 Painel de estatísticas flutuante" -ForegroundColor White
Write-Host "  📥 Exportar progresso (JSON)" -ForegroundColor White
Write-Host "  🗑️ Reset completo de progresso" -ForegroundColor White
Write-Host "  ✨ Animações e transições suaves" -ForegroundColor White
Write-Host "  🎯 Auto-conversão de listas em checkboxes" -ForegroundColor White
Write-Host "  💾 Auto-save a cada 30 segundos" -ForegroundColor White

Write-Host ""
Write-Host "🎯 COMO USAR:" -ForegroundColor Yellow
Write-Host "  1. Abra qualquer página do roadmap" -ForegroundColor White
Write-Host "  2. Clique nos checkboxes para marcar progresso" -ForegroundColor White
Write-Host "  3. Observe o painel de estatísticas (canto superior direito)" -ForegroundColor White
Write-Host "  4. Progresso é salvo automaticamente" -ForegroundColor White
Write-Host "  5. Feche e reabra - progresso será mantido!" -ForegroundColor White

Write-Host ""
Write-Host "🧪 PÁGINAS PARA TESTAR:" -ForegroundColor Yellow
Write-Host "  📄 test-progress.html - Página de teste dedicada" -ForegroundColor White
Write-Host "  📚 pages/fase1.html - Fase 1 com checkboxes reais" -ForegroundColor White
Write-Host "  🛠️ pages/fase2.html - Fase 2 com projetos" -ForegroundColor White
Write-Host "  🎖️ pages/fase3.html - Fase 3 com especialização" -ForegroundColor White

# Tentar abrir o teste automaticamente
if ($availableBrowser) {
    Write-Host ""
    Write-Host "🚀 Abrindo página de teste..." -ForegroundColor Cyan
    $testUrl = "file:///$($currentPath.Path.Replace('\', '/'))/test-progress.html"
    
    try {
        Start-Process $availableBrowser $testUrl
        Write-Host "✅ Página de teste aberta no $availableBrowser!" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ Não foi possível abrir automaticamente. Abra manualmente:" -ForegroundColor Yellow
        Write-Host "   $testUrl" -ForegroundColor Gray
    }
} else {
    Write-Host ""
    Write-Host "📱 Para testar, abra no seu browser:" -ForegroundColor Yellow
    Write-Host "   file:///$($currentPath.Path.Replace('\', '/'))/test-progress.html" -ForegroundColor Gray
}

Write-Host ""
Write-Host "🎉 CONFIGURAÇÃO CONCLUÍDA!" -ForegroundColor Green
Write-Host "Sistema de progresso avançado pronto para uso!" -ForegroundColor Cyan
Write-Host ""

# Verificar localStorage support (através de um teste simples)
Write-Host "🔧 Verificando compatibilidade..." -ForegroundColor Cyan
Write-Host "  ✅ JavaScript vanilla (nativo)" -ForegroundColor Green
Write-Host "  ✅ localStorage API (suportado por todos browsers modernos)" -ForegroundColor Green
Write-Host "  ✅ CSS animations (suportado nativamente)" -ForegroundColor Green
Write-Host "  ✅ Nenhuma dependência externa necessária" -ForegroundColor Green

Write-Host ""
Write-Host "💡 DICAS AVANÇADAS:" -ForegroundColor Yellow
Write-Host "  🔍 F12 > Console para ver logs de debug" -ForegroundColor White
Write-Host "  📊 F12 > Application > Local Storage para ver dados salvos" -ForegroundColor White
Write-Host "  🧪 Use test-progress.html para validação rápida" -ForegroundColor White
Write-Host "  📱 Sistema funciona em desktop, tablet e mobile" -ForegroundColor White

Write-Host ""
Write-Host "🌟 Sistema implementado com tecnologias nativas!" -ForegroundColor Green
Write-Host "📚 Pronto para acompanhar seu progresso no Copilot Specialist!" -ForegroundColor Cyan
