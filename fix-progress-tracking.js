// Script para corrigir e melhorar o sistema de rastreamento de progresso
// Adicionar ao final de main.js ou executar separadamente

// Melhorar função de inicialização
document.addEventListener("DOMContentLoaded", function () {
  // Aguardar um pouco mais para garantir que tudo foi carregado
  setTimeout(() => {
    // Forçar inicialização do sistema de progresso
    if (window.MS900Site && window.MS900Site.ProgressTracker) {
      const tracker = window.MS900Site.ProgressTracker;

      // Recarregar progresso
      tracker.loadProgress();

      // Criar checkboxes se ainda não existirem
      tracker.autoCreateProgressTracking();

      // Restaurar estados
      tracker.restoreCheckboxStates();

      // Atualizar displays
      tracker.updateProgressDisplay();

      console.log("🔧 Sistema de progresso corrigido e reinicializado");
    }
  }, 1000);
});

// Função para debug - verificar estado atual
function debugProgressSystem() {
  console.log("=== DEBUG DO SISTEMA DE PROGRESSO ===");

  const currentSection = window.location.pathname.includes("fase1")
    ? "fase1"
    : window.location.pathname.includes("fase2")
    ? "fase2"
    : window.location.pathname.includes("fase3")
    ? "fase3"
    : "general";

  console.log("Seção atual:", currentSection);

  const checkboxes = document.querySelectorAll(
    'input[type="checkbox"][data-section]'
  );
  console.log("Total de checkboxes encontrados:", checkboxes.length);

  const progress = JSON.parse(localStorage.getItem("ms900Progress") || "{}");
  console.log("Progresso salvo:", progress);

  checkboxes.forEach((cb, index) => {
    console.log(`Checkbox ${index + 1}:`, {
      id: cb.id,
      section: cb.dataset.section,
      checked: cb.checked,
      saved:
        progress[cb.dataset.section] && progress[cb.dataset.section][cb.id],
    });
  });

  console.log("=== FIM DO DEBUG ===");
}

// Função para limpar localStorage e reiniciar
function resetProgressSystem() {
  localStorage.removeItem("ms900Progress");
  localStorage.removeItem("ms900Metadata");
  location.reload();
}

// Tornar funções disponíveis globalmente para debug
window.debugProgressSystem = debugProgressSystem;
window.resetProgressSystem = resetProgressSystem;
