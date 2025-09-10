# PowerShell script para atualizar o sistema de progresso em todas as páginas
# Atualiza checklists para incluir data-section apropriado

Write-Host "🔄 Atualizando sistema de progresso..." -ForegroundColor Cyan

# Definir caminhos
$siteRoot = $PSScriptRoot
$pagesDir = Join-Path $siteRoot "pages"

# Mapping de arquivos para seções
$fileMapping = @{
    "fase1.html" = "fase1"
    "fase2.html" = "fase2" 
    "fase3.html" = "fase3"
    "certificacoes.html" = "certificacoes"
    "recursos.html" = "recursos"
}

foreach ($file in $fileMapping.Keys) {
    $filePath = Join-Path $pagesDir $file
    $section = $fileMapping[$file]
    
    if (Test-Path $filePath) {
        Write-Host "📝 Atualizando $file..." -ForegroundColor Yellow
        
        # Ler conteúdo do arquivo
        $content = Get-Content $filePath -Raw -Encoding UTF8
        
        # Atualizar checklists sem data-section
        $updatedContent = $content -replace 'class="checklist"(?!\s+data-section)', "class=`"checklist`" data-section=`"$section`""
        
        # Atualizar outras listas trackáveis
        $updatedContent = $updatedContent -replace 'class="project-details"(?!\s+data-section)', "class=`"project-details`" data-section=`"$section`""
        $updatedContent = $updatedContent -replace 'class="validation-grid"(?!\s+data-section)', "class=`"validation-grid`" data-section=`"$section`""
        $updatedContent = $updatedContent -replace 'class="phase-objectives"(?!\s+data-section)', "class=`"phase-objectives`" data-section=`"$section`""
        $updatedContent = $updatedContent -replace 'class="objectives"(?!\s+data-section)', "class=`"objectives`" data-section=`"$section`""
        
        # Salvar arquivo atualizado
        $updatedContent | Set-Content $filePath -Encoding UTF8 -NoNewline
        
        Write-Host "✅ $file atualizado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "❌ Arquivo não encontrado: $file" -ForegroundColor Red
    }
}

# Verificar se o sistema está funcionando
Write-Host "`n🧪 Verificando arquivos atualizados..." -ForegroundColor Cyan

foreach ($file in $fileMapping.Keys) {
    $filePath = Join-Path $pagesDir $file
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        $dataSectionCount = ([regex]::Matches($content, 'data-section="')).Count
        Write-Host "📊 $file - $dataSectionCount elementos com data-section" -ForegroundColor Magenta
    }
}

Write-Host "`n✅ Sistema de progresso atualizado com sucesso!" -ForegroundColor Green
Write-Host "🌐 Agora todas as listas serão automaticamente trackáveis" -ForegroundColor Cyan
Write-Host "💾 Progresso será salvo automaticamente no navegador" -ForegroundColor Cyan

# Abrir página de teste para validação
if (Test-Path "test-progress.html") {
    Write-Host "`n🧪 Abrindo página de teste..." -ForegroundColor Yellow
    Start-Process "test-progress.html"
}
