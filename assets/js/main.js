/**
 * SC-900 Modern Study Site - JavaScript Implementation
 * Enhanced progress tracking with modern ES6+ patterns
 */

// =========================================
// MODERN PROGRESS TRACKER CLASS
// =========================================

class ModernProgressTracker {
  constructor() {
    this.progress = {};
    this.metadata = {
      lastUpdate: new Date().toISOString(),
      totalSessions: 0,
      completedItems: 0,
      version: '3.0',
      examDate: '2025-09-18'
    };
    this.hasUnsavedChanges = false;
    this.startTime = Date.now();
    this.pausedAt = undefined;
  }

  /**
   * Initialize the progress tracker
   */
  async init() {
    try {
      this.loadProgress();
      this.createModernInterface();
      this.bindEvents();
      this.createCheckboxes();
      this.updateDisplay();
      this.setupAutoSave();
      
      console.log('✅ Modern Progress Tracker initialized');
    } catch (error) {
      console.error('❌ Failed to initialize progress tracker:', error);
    }
  }

  /**
   * Load progress from localStorage with error handling
   */
  loadProgress() {
    try {
      const progressData = localStorage.getItem('sc900Progress');
      const metadataData = localStorage.getItem('sc900Metadata');

      this.progress = progressData ? JSON.parse(progressData) : {};
      this.metadata = metadataData ? 
        { ...this.metadata, ...JSON.parse(metadataData) } : 
        this.metadata;

      this.metadata.totalSessions++;
      console.log(`📊 Loaded progress: ${this.getTotalCompleted()} items completed`);
    } catch (error) {
      console.error('❌ Error loading progress:', error);
      this.resetToDefaults();
    }
  }

  /**
   * Create modern glassmorphism interface
   */
  createModernInterface() {
    const existingStats = document.querySelector('.progress-stats');
    if (existingStats) {
      existingStats.remove();
    }

    const statsHTML = `
      <div class="progress-stats">
        <div class="progress-stats-title">
          <span class="progress-icon">📊</span>
          <span>Progresso SC-900</span>
        </div>
        
        <div class="stat-item" data-stat="completed">
          <span class="stat-label">✅ Completo:</span>
          <span class="stat-value total-completed">0 itens</span>
        </div>
        
        <div class="stat-item" data-stat="phase">
          <span class="stat-label">📚 Fase:</span>
          <span class="stat-value current-phase">Fase 1</span>
        </div>
        
        <div class="stat-item" data-stat="updated">
          <span class="stat-label">🕒 Atualizado:</span>
          <span class="stat-value last-update">Agora</span>
        </div>
        
        <div class="overall-progress">
          <div class="overall-progress-label">📈 Progresso Geral</div>
          <div class="overall-progress-container">
            <div class="overall-progress-bar" style="width: 0%"></div>
          </div>
          <div class="overall-progress-text">0% do SC-900</div>
        </div>
        
        <div class="save-indicator">
          ✅ Salvo automaticamente
        </div>
        
        <div class="progress-actions">
          <button class="btn btn-primary btn-sm export-progress">
            📥 Exportar
          </button>
          <button class="btn btn-secondary btn-sm reset-progress">
            🗑️ Reset
          </button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', statsHTML);
  }

  /**
   * Create modern checkboxes for all list items
   */
  createCheckboxes() {
    const selectors = [
      '.checklist li',
      '.objectives li',
      '.phase-objectives li',
      'ul li:not(.nav-item)',
      '.content ul li',
      '.section ul li'
    ];

    let totalCreated = 0;

    selectors.forEach(selector => {
      const items = document.querySelectorAll(selector);
      items.forEach((item, index) => {
        if (this.shouldCreateCheckbox(item)) {
          this.convertToModernCheckbox(item, totalCreated, selector);
          totalCreated++;
        }
      });
    });

    console.log(`✅ Created ${totalCreated} modern checkboxes`);
    this.createSectionProgressBars();
  }

  /**
   * Update all displays
   */
  updateDisplay() {
    this.updateProgressBars();
    this.updateStatsPanel();
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Checkbox change events
    document.addEventListener('change', (e) => {
      if (e.target.type === 'checkbox' && e.target.dataset.section) {
        this.handleCheckboxChange(e.target);
      }
    });

    // Button click events
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('export-progress')) {
        this.exportProgress();
      } else if (e.target.classList.contains('reset-progress')) {
        this.confirmReset();
      }
    });

    // Restore checkbox states after short delay
    setTimeout(() => {
      this.restoreCheckboxStates();
      this.updateDisplay();
    }, 500);
  }

  // Additional methods would continue here...
}

// Legacy compatibility - keep existing ProgressTracker for old calls
        this.metadata = {
          lastUpdate: new Date().toISOString(),
          totalSessions: 0,
          completedItems: 0,
          version: "2.0",
          examDate: "2025-09-18",
        };
      }

      this.metadata.totalSessions++;
      console.log(
        `📊 Loaded SC-900 progress: ${this.getTotalCompletedItems()} items completed`
      );
    } catch (error) {
      console.error("Error loading progress:", error);
      this.progress = {};
      this.metadata = {
        lastUpdate: new Date().toISOString(),
        totalSessions: 1,
        completedItems: 0,
        version: "2.0",
        examDate: "2025-09-18",
      };
    }
  },

  saveProgress() {
    try {
      this.metadata.lastUpdate = new Date().toISOString();
      this.metadata.completedItems = this.getTotalCompletedItems();

      localStorage.setItem("sc900Progress", JSON.stringify(this.progress));
      localStorage.setItem("sc900Metadata", JSON.stringify(this.metadata));

      // Show save indicator
      this.showSaveIndicator();
      console.log("💾 SC-900 Progress saved successfully");
    } catch (error) {
      console.error("Error saving progress:", error);
      this.showErrorIndicator();
    }
  },

  setupAutoSave() {
    // Auto-save every 30 seconds
    setInterval(() => {
      if (this.hasUnsavedChanges) {
        this.saveProgress();
        this.hasUnsavedChanges = false;
      }
    }, 30000);

    // Save on page unload
    window.addEventListener("beforeunload", () => {
      if (this.hasUnsavedChanges) {
        this.saveProgress();
      }
    });
  },

  createProgressInterface() {
    // Add progress stats to header if doesn't exist
    if (!document.querySelector(".progress-stats")) {
      const header =
        document.querySelector(".main-content") ||
        document.querySelector("body");
      const statsHTML = `
        <div class="progress-stats" style="position: fixed; top: 80px; right: 20px; background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%); border-radius: 15px; padding: 20px; box-shadow: 0 8px 30px rgba(0,0,0,0.15); z-index: 1000; min-width: 250px; border: 2px solid rgba(103, 126, 234, 0.2); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);">
          <div style="font-weight: bold; color: #2c3e50; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; font-size: 1.1em;">
            <span style="font-size: 1.2em;">📊</span> 
            <span style="background: linear-gradient(135deg, #2c3e50, #3498db); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Progresso SC-900</span>
          </div>
          <div class="stat-item" style="display: flex; justify-content: space-between; margin-bottom: 12px; padding: 8px 12px; background: rgba(39, 174, 96, 0.1); border-radius: 8px; border-left: 4px solid #27ae60;">
            <span style="color: #2c3e50; font-weight: 500;">✅ Completo:</span>
            <span class="total-completed" style="font-weight: bold; color: #27ae60; font-size: 1.1em;">0 itens</span>
          </div>
          <div class="stat-item" style="display: flex; justify-content: space-between; margin-bottom: 12px; padding: 8px 12px; background: rgba(52, 152, 219, 0.1); border-radius: 8px; border-left: 4px solid #3498db;">
            <span style="color: #2c3e50; font-weight: 500;">📚 Fase:</span>
            <span class="current-phase" style="font-weight: bold; color: #3498db; font-size: 1.1em;">Fase 1</span>
          </div>
          <div class="stat-item" style="display: flex; justify-content: space-between; margin-bottom: 15px; padding: 8px 12px; background: rgba(142, 68, 173, 0.1); border-radius: 8px; border-left: 4px solid #8e44ad;">
            <span style="color: #2c3e50; font-weight: 500;">🕒 Atualizado:</span>
            <span class="last-update" style="font-size: 0.9em; color: #8e44ad; font-weight: 500;">Agora</span>
          </div>
          <div class="overall-progress" style="margin-bottom: 15px;">
            <div style="font-size: 0.9em; color: #2c3e50; margin-bottom: 8px; font-weight: 600;">📈 Progresso Geral:</div>
            <div style="background: #ecf0f1; border-radius: 10px; height: 8px; overflow: hidden; position: relative;">
              <div class="overall-progress-bar" style="height: 100%; background: linear-gradient(90deg, #27ae60, #2ecc71); border-radius: 10px; width: 0%; transition: width 0.8s ease;"></div>
            </div>
            <div class="overall-progress-text" style="font-size: 0.8em; color: #7f8c8d; margin-top: 4px; text-align: center;">0% do SC-900</div>
          </div>
          <div class="save-indicator" style="text-align: center; font-size: 0.9em; color: #27ae60; opacity: 0; transition: opacity 0.3s; padding: 8px; background: rgba(39, 174, 96, 0.1); border-radius: 8px; margin-bottom: 10px;">
            ✅ Salvo automaticamente
          </div>
          <div class="progress-actions" style="margin-top: 15px; display: flex; gap: 10px;">
            <button class="export-progress" style="flex: 1; padding: 10px 15px; background: linear-gradient(135deg, #3498db, #2980b9); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 0.85em; font-weight: 600; transition: all 0.3s ease;">
              📥 Exportar
            </button>
            <button class="reset-progress" style="flex: 1; padding: 10px 15px; background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 0.85em; font-weight: 600; transition: all 0.3s ease;">
              🗑️ Reset
            </button>
          </div>
        </div>
      `;
      header.insertAdjacentHTML("afterbegin", statsHTML);

      // Add hover effects to buttons
      const exportBtn = document.querySelector(".export-progress");
      const resetBtn = document.querySelector(".reset-progress");

      if (exportBtn) {
        exportBtn.addEventListener("mouseenter", () => {
          exportBtn.style.transform = "translateY(-2px)";
          exportBtn.style.boxShadow = "0 4px 15px rgba(52, 152, 219, 0.4)";
        });
        exportBtn.addEventListener("mouseleave", () => {
          exportBtn.style.transform = "translateY(0)";
          exportBtn.style.boxShadow = "none";
        });
      }

      if (resetBtn) {
        resetBtn.addEventListener("mouseenter", () => {
          resetBtn.style.transform = "translateY(-2px)";
          resetBtn.style.boxShadow = "0 4px 15px rgba(231, 76, 60, 0.4)";
        });
        resetBtn.addEventListener("mouseleave", () => {
          resetBtn.style.transform = "translateY(0)";
          resetBtn.style.boxShadow = "none";
        });
      }
    }
  },

  markComplete(section, item, itemText = "") {
    if (!this.progress[section]) {
      this.progress[section] = {};
    }

    this.progress[section][item] = {
      completed: true,
      timestamp: new Date().toISOString(),
      text: itemText,
    };

    this.hasUnsavedChanges = true;
    this.updateProgressDisplay();
    this.showCompletionAnimation(item);

    console.log(`✅ Marked complete: ${section} - ${item}`);
  },

  markIncomplete(section, item) {
    if (this.progress[section] && this.progress[section][item]) {
      delete this.progress[section][item];
      this.hasUnsavedChanges = true;
      this.updateProgressDisplay();
      console.log(`❌ Marked incomplete: ${section} - ${item}`);
    }
  },

  isComplete(section, item) {
    return (
      this.progress[section] &&
      this.progress[section][item] &&
      this.progress[section][item].completed === true
    );
  },

  getTotalCompletedItems() {
    let total = 0;
    Object.values(this.progress).forEach((section) => {
      total += Object.keys(section).length;
    });
    return total;
  },

  getCompletionPercentage(section) {
    // Buscar TODOS os checkboxes da seção atual de forma robusta
    const allCheckboxes = document.querySelectorAll(
      'input[type="checkbox"][data-section]'
    );
    const sectionCheckboxes = Array.from(allCheckboxes).filter(
      (cb) => cb.dataset.section === section
    );

    const total = sectionCheckboxes.length;
    const completed = sectionCheckboxes.filter((cb) => cb.checked).length;

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    console.log(
      `📊 Progresso ${section}: ${completed}/${total} = ${percentage}%`
    );
    return percentage;
  },

  updateProgressDisplay() {
    console.log("🔄 Atualizando barras de progresso...");

    // Update progress bars - buscar por todas as barras existentes
    document.querySelectorAll(".progress-bar").forEach((bar) => {
      const section = bar.dataset.section;
      if (section) {
        const percentage = this.getCompletionPercentage(section);

        // Animar a mudança da barra
        bar.style.transition = "width 0.5s ease";
        bar.style.width = `${percentage}%`;

        // Update text - buscar o elemento de texto de forma mais robusta
        const progressContainer = bar.closest(
          ".phase-progress, .main-progress-container"
        );
        const textElement = progressContainer?.querySelector(".progress-text");

        if (textElement) {
          textElement.textContent = `${percentage}% Concluído`;
        }

        console.log(`📊 Barra ${section} atualizada para ${percentage}%`);
      }
    });

    // Update stats panel
    this.updateStatsPanel();
  },

  updateStatsPanel() {
    const totalCompleted = this.getTotalCompletedItems();
    const currentSection = this.getCurrentSection();
    const lastUpdate = this.metadata.lastUpdate
      ? new Date(this.metadata.lastUpdate).toLocaleString("pt-BR")
      : "Nunca";

    const totalCompletedEl = document.querySelector(".total-completed");
    const currentPhaseEl = document.querySelector(".current-phase");
    const lastUpdateEl = document.querySelector(".last-update");

    if (totalCompletedEl)
      totalCompletedEl.textContent = `${totalCompleted} itens`;
    if (currentPhaseEl)
      currentPhaseEl.textContent =
        currentSection.charAt(0).toUpperCase() + currentSection.slice(1);
    if (lastUpdateEl)
      lastUpdateEl.textContent = this.formatRelativeTime(
        this.metadata.lastUpdate
      );

    // Update overall progress bar
    const overallProgressBar = document.querySelector(".overall-progress-bar");
    const overallProgressText = document.querySelector(
      ".overall-progress-text"
    );

    if (overallProgressBar && overallProgressText) {
      // Calculate overall progress based on total checkboxes across all pages
      const allCheckboxes = document.querySelectorAll(
        'input[type="checkbox"][data-section]'
      );
      const completedCheckboxes = Array.from(allCheckboxes).filter(
        (cb) => cb.checked
      );
      const overallPercentage =
        allCheckboxes.length > 0
          ? Math.round(
              (completedCheckboxes.length / allCheckboxes.length) * 100
            )
          : 0;

      overallProgressBar.style.width = `${overallPercentage}%`;
      overallProgressText.textContent = `${overallPercentage}% do SC-900`;

      // Add color coding
      if (overallPercentage >= 80) {
        overallProgressBar.style.background =
          "linear-gradient(90deg, #27ae60, #2ecc71)";
      } else if (overallPercentage >= 50) {
        overallProgressBar.style.background =
          "linear-gradient(90deg, #f39c12, #e67e22)";
      } else {
        overallProgressBar.style.background =
          "linear-gradient(90deg, #3498db, #2980b9)";
      }
    }
  },

  formatRelativeTime(timestamp) {
    if (!timestamp) return "Nunca";
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Agora";
    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h atrás`;
    return then.toLocaleDateString("pt-BR");
  },

  autoCreateProgressTracking() {
    // Enhanced checkbox creation for all list items
    const selectors = [
      ".checklist li",
      ".project-details li",
      ".validation-grid li",
      ".timeline-item ul li",
      ".objectives li",
      ".phase-objectives li",
      "ul li", // Fallback genérico para listas
      ".content ul li", // Listas em conteúdo
      ".section ul li", // Listas em seções
    ];

    let totalCreated = 0;

    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((item, index) => {
        // Verificar se não é uma lista aninhada muito profunda
        const text = item.textContent.trim();
        const hasNestedList =
          item.querySelector("ul") || item.querySelector("ol");
        const parentList = item.closest("ul, ol");
        const isTopLevel = parentList && !parentList.closest("li ul, li ol");

        if (
          !item.querySelector('input[type="checkbox"]') &&
          text &&
          text.length > 10 && // Evitar textos muito curtos
          text.length < 500 && // Evitar textos muito longos
          !hasNestedList && // Não criar checkbox se tem lista aninhada
          (isTopLevel || selector === "ul li")
        ) {
          // Apenas listas de primeiro nível

          this.convertToCheckbox(item, totalCreated, selector);
          totalCreated++;
        }
      });
    });

    console.log(`✅ Criados ${totalCreated} checkboxes de progresso`);

    // Create progress bars for each section
    this.createSectionProgressBars();
  },

  convertToCheckbox(item, index, selector) {
    const text = item.textContent.trim();
    const section = this.getCurrentSection();
    // Criar ID único mais estável baseado no texto e posição
    const textHash = text.substring(0, 20).replace(/[^a-zA-Z0-9]/g, "");
    const uniqueId = `${section}-${selector.replace(
      /[^a-zA-Z0-9]/g,
      ""
    )}-${index}-${textHash}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = uniqueId;
    checkbox.dataset.section = section;
    checkbox.dataset.item = uniqueId;

    const label = document.createElement("label");
    label.htmlFor = checkbox.id;
    label.textContent = text;

    // Style the container
    item.innerHTML = "";
    item.style.cssText = `
      display: flex; 
      align-items: flex-start; 
      gap: 12px; 
      padding: 8px 0; 
      border-bottom: 1px solid #f0f0f0;
      transition: background-color 0.2s ease;
    `;

    // Style the checkbox
    checkbox.style.cssText = `
      width: 20px; 
      height: 20px; 
      accent-color: #4834d4; 
      cursor: pointer;
      margin-top: 2px;
      flex-shrink: 0;
    `;

    // Style the label
    label.style.cssText = `
      cursor: pointer; 
      flex: 1; 
      line-height: 1.5;
      font-size: 0.95em;
      transition: all 0.3s ease;
    `;

    item.appendChild(checkbox);
    item.appendChild(label);

    // Apply saved state
    checkbox.checked = this.isComplete(section, uniqueId);
    if (checkbox.checked) {
      this.applyCompletedStyle(label, item);
    }

    // Add hover effect
    item.addEventListener("mouseenter", () => {
      if (!checkbox.checked) {
        item.style.backgroundColor = "#f8f9fa";
      }
    });

    item.addEventListener("mouseleave", () => {
      item.style.backgroundColor = "transparent";
    });
  },

  applyCompletedStyle(label, item) {
    label.style.cssText += `
      text-decoration: line-through;
      opacity: 0.7;
      color: #27ae60;
      font-weight: 500;
    `;
    item.style.backgroundColor = "#f0fff4";
  },

  removeCompletedStyle(label, item) {
    label.style.textDecoration = "none";
    label.style.opacity = "1";
    label.style.color = "inherit";
    label.style.fontWeight = "normal";
    item.style.backgroundColor = "transparent";
  },

  showCompletionAnimation(itemId) {
    const checkbox = document.querySelector(`#${itemId}`);
    if (checkbox) {
      // Enhanced completion animation
      checkbox.style.transition = "all 0.3s ease";
      checkbox.style.transform = "scale(1.3) rotate(360deg)";
      checkbox.style.boxShadow = "0 0 20px rgba(39, 174, 96, 0.6)";

      setTimeout(() => {
        checkbox.style.transform = "scale(1) rotate(0deg)";
        checkbox.style.boxShadow = "0 2px 8px rgba(39, 174, 96, 0.3)";
      }, 300);

      // Show temporary success message with enhanced styling
      this.showTemporaryMessage(
        "🎉 Item concluído! Excelente progresso!",
        "success"
      );

      // Add confetti effect
      this.createConfettiEffect(checkbox);
    }
  },

  createConfettiEffect(element) {
    const rect = element.getBoundingClientRect();
    const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57"];

    for (let i = 0; i < 10; i++) {
      const confetti = document.createElement("div");
      confetti.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        top: ${rect.top + rect.height / 2}px;
        left: ${rect.left + rect.width / 2}px;
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        animation: confettiFall 1s ease-out forwards;
      `;

      const angle = (Math.PI * 2 * i) / 10;
      const velocity = 50 + Math.random() * 50;
      const dx = Math.cos(angle) * velocity;
      const dy = Math.sin(angle) * velocity - 100;

      confetti.style.setProperty("--dx", dx + "px");
      confetti.style.setProperty("--dy", dy + "px");

      document.body.appendChild(confetti);

      setTimeout(() => confetti.remove(), 1000);
    }

    // Add CSS animation if not exists
    if (!document.querySelector("#confetti-style")) {
      const style = document.createElement("style");
      style.id = "confetti-style";
      style.textContent = `
        @keyframes confettiFall {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(var(--dx), var(--dy)) rotate(720deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  },

  showTemporaryMessage(message, type = "info") {
    const existingMessage = document.querySelector(".temp-message");
    if (existingMessage) existingMessage.remove();

    const messageDiv = document.createElement("div");
    messageDiv.className = "temp-message";

    const bgColors = {
      success: "linear-gradient(135deg, #27ae60, #2ecc71)",
      error: "linear-gradient(135deg, #e74c3c, #c0392b)",
      info: "linear-gradient(135deg, #3498db, #2980b9)",
      warning: "linear-gradient(135deg, #f39c12, #e67e22)",
    };

    messageDiv.style.cssText = `
      position: fixed;
      top: 120px;
      right: 20px;
      background: ${bgColors[type] || bgColors.info};
      color: white;
      padding: 15px 25px;
      border-radius: 12px;
      z-index: 1001;
      font-weight: 600;
      font-size: 0.95em;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1), fadeOut 0.4s ease 2.6s;
      max-width: 300px;
      text-align: center;
    `;
    messageDiv.textContent = message;

    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
  },

  showSaveIndicator() {
    const indicator = document.querySelector(".save-indicator");
    if (indicator) {
      indicator.style.opacity = "1";
      setTimeout(() => {
        indicator.style.opacity = "0";
      }, 2000);
    }
  },

  showErrorIndicator() {
    this.showTemporaryMessage("❌ Erro ao salvar progresso", "error");
  },

  getCurrentSection() {
    const path = window.location.pathname;
    if (path.includes("fase1.html")) return "fase1";
    if (path.includes("fase2.html")) return "fase2";
    if (path.includes("fase3.html")) return "fase3";
    if (path.includes("certificacoes.html")) return "estrategias";
    if (path.includes("recursos.html")) return "recursos";
    return "general";
  },

  createSectionProgressBars() {
    const section = this.getCurrentSection();
    if (section === "general") return;

    // Create main progress bar for the page
    const header = document.querySelector(
      ".page-header, .hero, h1"
    )?.parentElement;
    if (header && !header.querySelector(".main-progress-container")) {
      const progressHTML = `
        <div class="main-progress-container" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px; padding: 25px; margin: 25px 0; text-align: center; color: white; position: relative; overflow: hidden;">
          <div class="progress-bg" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="white" opacity="0.1"/></svg>') repeat; opacity: 0.1;"></div>
          <div style="position: relative; z-index: 1;">
            <div class="progress-label" style="font-weight: bold; font-size: 1.2em; margin-bottom: 15px;">
              📊 Progresso da ${
                section.charAt(0).toUpperCase() + section.slice(1)
              }
            </div>
            <div class="progress-bar-container" style="background: rgba(255,255,255,0.2); border-radius: 12px; height: 24px; overflow: hidden; position: relative; margin-bottom: 10px;">
              <div class="progress-bar" data-section="${section}" style="height: 100%; background: linear-gradient(90deg, #27ae60, #2ecc71); border-radius: 12px; width: 0%; transition: width 0.8s ease; position: relative;">
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent); animation: shimmer 2s infinite;"></div>
              </div>
            </div>
            <div class="progress-text" style="font-size: 0.95em; opacity: 0.9;">0% Concluído</div>
          </div>
        </div>
      `;
      header.insertAdjacentHTML("beforeend", progressHTML);
    }
  },

  // Enhanced event binding with better UX
  bindEvents() {
    // Checkbox change events with improved feedback
    document.addEventListener("change", (e) => {
      if (e.target.type === "checkbox" && e.target.dataset.section) {
        const section = e.target.dataset.section;
        const item = e.target.dataset.item || e.target.id;
        const label = e.target.nextElementSibling;
        const container = e.target.parentElement;

        console.log(
          `📝 Checkbox alterado: ${section} - ${item} - ${
            e.target.checked ? "checked" : "unchecked"
          }`
        );

        if (e.target.checked) {
          this.markComplete(section, item, label?.textContent || "");
          if (label && container) {
            this.applyCompletedStyle(label, container);
          }
        } else {
          this.markIncomplete(section, item);
          if (label && container) {
            this.removeCompletedStyle(label, container);
          }
        }

        // Forçar atualização IMEDIATA da barra de progresso
        this.updateProgressDisplay();

        // Salvar automaticamente
        this.saveProgress();
      }
    }); // Enhanced stats panel interactions
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("export-progress")) {
        this.exportProgress();
      } else if (e.target.classList.contains("reset-progress")) {
        this.confirmReset();
      }
    });

    // Load saved checkbox states on page load
    setTimeout(() => {
      // Aguardar checkboxes serem criados
      this.restoreCheckboxStates();
      this.updateProgressDisplay();
    }, 500);
  },

  restoreCheckboxStates() {
    console.log("🔄 Restaurando estados dos checkboxes...");

    const checkboxes = document.querySelectorAll(
      'input[type="checkbox"][data-section]'
    );
    let restoredCount = 0;

    checkboxes.forEach((checkbox) => {
      const section = checkbox.dataset.section;
      const item = checkbox.dataset.item || checkbox.id;
      const label = checkbox.nextElementSibling;
      const container = checkbox.parentElement;

      // Aplicar estado salvo
      const wasChecked = checkbox.checked;
      checkbox.checked = this.isComplete(section, item);

      if (checkbox.checked && label && container) {
        this.applyCompletedStyle(label, container);
        if (!wasChecked) restoredCount++;
      } else if (!checkbox.checked && label && container) {
        this.removeCompletedStyle(label, container);
      }
    });

    console.log(
      `✅ ${restoredCount} checkboxes restaurados de ${checkboxes.length} total`
    );

    // Forçar atualização das barras após restauração
    this.updateProgressDisplay();
  },

  exportProgress() {
    const exportData = {
      progress: this.progress,
      metadata: this.metadata,
      exportDate: new Date().toISOString(),
      totalItems: this.getTotalCompletedItems(),
      examDate: "2025-09-18",
      examType: "SC-900",
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sc900-progress-${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
    URL.revokeObjectURL(url);

    this.showTemporaryMessage(
      "📥 Progresso SC-900 exportado com sucesso!",
      "success"
    );
  },

  confirmReset() {
    if (
      confirm(
        "🗑️ Tem certeza que deseja resetar todo o progresso do SC-900? Esta ação não pode ser desfeita."
      )
    ) {
      this.resetProgress();
    }
  },

  resetProgress() {
    this.progress = {};
    this.metadata = {
      lastUpdate: new Date().toISOString(),
      totalSessions: 0,
      completedItems: 0,
      version: "2.0",
      examDate: "2025-09-18",
    };

    localStorage.removeItem("sc900Progress");
    localStorage.removeItem("sc900Metadata");

    // Uncheck all checkboxes and remove styles
    document
      .querySelectorAll('input[type="checkbox"][data-section]')
      .forEach((checkbox) => {
        checkbox.checked = false;
        const label = checkbox.nextElementSibling;
        const container = checkbox.parentElement;
        if (label && container) {
          this.removeCompletedStyle(label, container);
        }
      });

    this.updateProgressDisplay();
    this.showTemporaryMessage(
      "🗑️ Progresso SC-900 resetado com sucesso!",
      "success"
    );
  },
};

// Resource filtering and search
const ResourceFilter = {
  init() {
    this.resources = [];
    this.filteredResources = [];
    this.currentFilters = {
      category: "all",
      difficulty: "all",
      type: "all",
    };

    this.bindEvents();
    this.loadResources();
  },

  bindEvents() {
    // Search input
    const searchInput = document.querySelector("#search-resources");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchResources(e.target.value);
      });
    }

    // Filter buttons
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const filterType = e.target.dataset.filter;
        const filterValue = e.target.dataset.value;
        this.setFilter(filterType, filterValue);
        this.updateFilterUI(e.target);
      });
    });
  },

  loadResources() {
    // This would normally load from an API or database
    // For now, it reads from the existing DOM structure
    this.resources = Array.from(
      document.querySelectorAll(".resource-item")
    ).map((item) => ({
      element: item,
      title: item.querySelector("h4")?.textContent || "",
      description: item.querySelector("p")?.textContent || "",
      category: item.dataset.category || "other",
      difficulty: item.dataset.difficulty || "beginner",
      type: item.dataset.type || "article",
    }));

    this.filteredResources = [...this.resources];
  },

  setFilter(filterType, value) {
    this.currentFilters[filterType] = value;
    this.applyFilters();
  },

  applyFilters() {
    this.filteredResources = this.resources.filter((resource) => {
      return (
        (this.currentFilters.category === "all" ||
          resource.category === this.currentFilters.category) &&
        (this.currentFilters.difficulty === "all" ||
          resource.difficulty === this.currentFilters.difficulty) &&
        (this.currentFilters.type === "all" ||
          resource.type === this.currentFilters.type)
      );
    });

    this.displayResources();
  },

  searchResources(query) {
    const searchTerm = query.toLowerCase();
    this.filteredResources = this.resources
      .filter((resource) => {
        return (
          resource.title.toLowerCase().includes(searchTerm) ||
          resource.description.toLowerCase().includes(searchTerm)
        );
      })
      .filter((resource) => {
        return (
          (this.currentFilters.category === "all" ||
            resource.category === this.currentFilters.category) &&
          (this.currentFilters.difficulty === "all" ||
            resource.difficulty === this.currentFilters.difficulty) &&
          (this.currentFilters.type === "all" ||
            resource.type === this.currentFilters.type)
        );
      });

    this.displayResources();
  },

  displayResources() {
    // Hide all resources first
    this.resources.forEach((resource) => {
      resource.element.style.display = "none";
    });

    // Show filtered resources
    this.filteredResources.forEach((resource) => {
      resource.element.style.display = "block";
    });

    // Update result count
    const resultCount = document.querySelector("#result-count");
    if (resultCount) {
      resultCount.textContent = `${this.filteredResources.length} recursos encontrados`;
    }
  },

  updateFilterUI(activeBtn) {
    // Remove active class from siblings
    activeBtn.parentElement.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.remove("active");
    });

    // Add active class to clicked button
    activeBtn.classList.add("active");
  },
};

// Smooth scrolling for anchor links
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// Active navigation highlighting
function initActiveNavigation() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-item a");

  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("href");
    if (
      linkPage === currentPage ||
      (currentPage === "" && linkPage === "index.html")
    ) {
      link.classList.add("active");
    }
  });
}

// Timeline animation
function initTimelineAnimation() {
  const timelineItems = document.querySelectorAll(".timeline-item");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateX(0)";
        }
      });
    },
    { threshold: 0.1 }
  );

  timelineItems.forEach((item) => {
    item.style.opacity = "0";
    item.style.transform = "translateX(-20px)";
    item.style.transition = "all 0.6s ease";
    observer.observe(item);
  });
}

// Card animation on scroll
function initCardAnimation() {
  const cards = document.querySelectorAll(".card, .phase-card, .cert-card");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.1 }
  );

  cards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "all 0.6s ease";
    observer.observe(card);
  });
}

// Flashcard functionality
const FlashCards = {
  init() {
    this.createFlashCards();
    this.bindFlashCardEvents();
  },

  createFlashCards() {
    // Auto-detect content that can be converted to flashcards
    const flashcardContainers = document.querySelectorAll(
      ".flashcard-content, .concept-card"
    );

    flashcardContainers.forEach((container, index) => {
      if (!container.querySelector(".flashcard")) {
        this.convertToFlashCard(container, index);
      }
    });
  },

  convertToFlashCard(container, index) {
    const title =
      container.querySelector("h3, h4, .concept-title")?.textContent ||
      `Conceito ${index + 1}`;
    const content =
      container.querySelector("p, .concept-description")?.textContent ||
      container.textContent;

    if (content && content.length > 20) {
      const flashcardHTML = `
        <div class="flashcard" data-id="flashcard-${index}">
          <div class="flashcard-inner">
            <div class="front">
              <h4>💡 ${title}</h4>
              <p><em>Clique para ver a explicação</em></p>
            </div>
            <div class="back">
              <h4>✅ ${title}</h4>
              <p>${content}</p>
            </div>
          </div>
        </div>
      `;

      container.innerHTML = flashcardHTML;
    }
  },

  bindFlashCardEvents() {
    document.addEventListener("click", (e) => {
      const flashcard = e.target.closest(".flashcard");
      if (flashcard) {
        flashcard.classList.toggle("flipped");

        // Haptic feedback simulation
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }

        // Track flashcard usage
        this.trackFlashcardUsage(flashcard.dataset.id);
      }
    });
  },

  trackFlashcardUsage(cardId) {
    const usage = JSON.parse(
      localStorage.getItem("sc900FlashcardUsage") || "{}"
    );
    usage[cardId] = (usage[cardId] || 0) + 1;
    localStorage.setItem("sc900FlashcardUsage", JSON.stringify(usage));
  },
};

// Enhanced Resource Filter with better UX
const EnhancedResourceFilter = {
  init() {
    if (!document.querySelector("#search-resources")) return;

    this.createFilterInterface();
    this.bindAdvancedEvents();
    this.loadUserPreferences();
  },

  createFilterInterface() {
    const searchContainer =
      document.querySelector("#search-resources")?.parentElement;
    if (!searchContainer) return;

    const filterHTML = `
      <div class="filter-controls">
        <div class="filter-group">
          <label>📚 Categoria:</label>
          <div class="filter-buttons">
            <button class="filter-btn active" data-filter="category" data-value="all">Todos</button>
            <button class="filter-btn" data-filter="category" data-value="official">Oficial</button>
            <button class="filter-btn" data-filter="category" data-value="practice">Prática</button>
            <button class="filter-btn" data-filter="category" data-value="community">Comunidade</button>
          </div>
        </div>
        
        <div class="filter-group">
          <label>⭐ Dificuldade:</label>
          <div class="filter-buttons">
            <button class="filter-btn active" data-filter="difficulty" data-value="all">Todos</button>
            <button class="filter-btn" data-filter="difficulty" data-value="beginner">Iniciante</button>
            <button class="filter-btn" data-filter="difficulty" data-value="intermediate">Intermediário</button>
            <button class="filter-btn" data-filter="difficulty" data-value="advanced">Avançado</button>
          </div>
        </div>
        
        <div class="filter-group">
          <label>📝 Tipo:</label>
          <div class="filter-buttons">
            <button class="filter-btn active" data-filter="type" data-value="all">Todos</button>
            <button class="filter-btn" data-filter="type" data-value="article">Artigo</button>
            <button class="filter-btn" data-filter="type" data-value="video">Vídeo</button>
            <button class="filter-btn" data-filter="type" data-value="simulator">Simulador</button>
            <button class="filter-btn" data-filter="type" data-value="book">Livro</button>
          </div>
        </div>
        
        <div id="result-count" style="text-align: center; margin-top: 15px; font-weight: 500; color: #666;">
          Carregando recursos...
        </div>
      </div>
    `;

    searchContainer.insertAdjacentHTML("afterend", filterHTML);
  },

  bindAdvancedEvents() {
    // Enhanced search with debouncing
    const searchInput = document.querySelector("#search-resources");
    if (searchInput) {
      let searchTimeout;
      searchInput.addEventListener("input", (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.performSearch(e.target.value);
        }, 300);
      });
    }
  },

  performSearch(query) {
    const results = this.searchResources(query);
    this.displaySearchResults(results);
    this.saveSearchPreference(query);
  },

  searchResources(query) {
    // This would integrate with the existing ResourceFilter
    if (window.SC900Site && window.SC900Site.ResourceFilter) {
      window.SC900Site.ResourceFilter.searchResources(query);
    }
  },

  saveSearchPreference(query) {
    if (query.length > 2) {
      const searches = JSON.parse(
        localStorage.getItem("sc900Searches") || "[]"
      );
      if (!searches.includes(query)) {
        searches.unshift(query);
        searches.splice(5); // Keep only last 5 searches
        localStorage.setItem("sc900Searches", JSON.stringify(searches));
      }
    }
  },

  loadUserPreferences() {
    const savedFilters = JSON.parse(
      localStorage.getItem("sc900FilterPrefs") || "{}"
    );
    Object.entries(savedFilters).forEach(([filterType, value]) => {
      const btn = document.querySelector(
        `[data-filter="${filterType}"][data-value="${value}"]`
      );
      if (btn) {
        btn.click();
      }
    });
  },
};

// Countdown timer enhancement
const CountdownTimer = {
  init() {
    this.examDate = new Date("2025-09-18T09:00:00");
    this.createCountdownDisplay();
    this.startCountdown();
  },

  createCountdownDisplay() {
    const heroSection = document.querySelector(".hero");
    if (heroSection && !heroSection.querySelector(".countdown-timer")) {
      const countdownHTML = `
        <div class="countdown-timer" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 20px; margin: 30px 0; text-align: center; position: relative; overflow: hidden; box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);">
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"50\" r=\"2\" fill=\"white\" opacity=\"0.1\"/></svg>') repeat; opacity: 0.3;"></div>
          <h3 style="position: relative; z-index: 1; margin-bottom: 25px; font-size: 1.8em; font-weight: 600;">⏰ Countdown para o SC-900</h3>
          <div class="countdown-display" style="position: relative; z-index: 1; display: flex; justify-content: center; gap: 25px; flex-wrap: wrap; margin-bottom: 20px;">
            <div class="time-unit" style="background: rgba(255, 255, 255, 0.15); border-radius: 15px; padding: 20px; min-width: 100px; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); transition: transform 0.3s ease;">
              <div class="time-number days" style="font-size: 3em; font-weight: bold; margin-bottom: 8px; background: linear-gradient(45deg, #fff, #e3f2fd); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">--</div>
              <div class="time-label" style="font-size: 0.9em; opacity: 0.9; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Dias</div>
            </div>
            <div class="time-unit" style="background: rgba(255, 255, 255, 0.15); border-radius: 15px; padding: 20px; min-width: 100px; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); transition: transform 0.3s ease;">
              <div class="time-number hours" style="font-size: 3em; font-weight: bold; margin-bottom: 8px; background: linear-gradient(45deg, #fff, #e3f2fd); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">--</div>
              <div class="time-label" style="font-size: 0.9em; opacity: 0.9; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Horas</div>
            </div>
            <div class="time-unit" style="background: rgba(255, 255, 255, 0.15); border-radius: 15px; padding: 20px; min-width: 100px; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); transition: transform 0.3s ease;">
              <div class="time-number minutes" style="font-size: 3em; font-weight: bold; margin-bottom: 8px; background: linear-gradient(45deg, #fff, #e3f2fd); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">--</div>
              <div class="time-label" style="font-size: 0.9em; opacity: 0.9; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Minutos</div>
            </div>
          </div>
          <div class="countdown-message" style="position: relative; z-index: 1; margin-top: 15px; font-style: italic; font-size: 1.2em; font-weight: 500; opacity: 0.9;">
            Preparação em andamento! 💪
          </div>
        </div>
      `;
      heroSection.insertAdjacentHTML("beforeend", countdownHTML);

      // Add hover effects to time units
      const timeUnits = document.querySelectorAll(".time-unit");
      timeUnits.forEach((unit) => {
        unit.addEventListener("mouseenter", () => {
          unit.style.transform = "translateY(-5px) scale(1.05)";
        });
        unit.addEventListener("mouseleave", () => {
          unit.style.transform = "translateY(0) scale(1)";
        });
      });
    }
  },

  startCountdown() {
    const updateCountdown = () => {
      const now = new Date();
      const difference = this.examDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );

        const daysEl = document.querySelector(".countdown-display .days");
        const hoursEl = document.querySelector(".countdown-display .hours");
        const minutesEl = document.querySelector(".countdown-display .minutes");
        const messageEl = document.querySelector(".countdown-message");

        if (daysEl) daysEl.textContent = days.toString().padStart(2, "0");
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, "0");
        if (minutesEl)
          minutesEl.textContent = minutes.toString().padStart(2, "0");

        // Update message based on time remaining
        if (messageEl) {
          if (days <= 1) {
            messageEl.textContent = "🔥 Exame amanhã! Último review!";
            messageEl.style.color = "#ff6b6b";
          } else if (days <= 3) {
            messageEl.textContent = "⚡ Reta final! Foque na revisão!";
            messageEl.style.color = "#ffa500";
          } else if (days <= 7) {
            messageEl.textContent = "💪 Semana decisiva! Vamos lá!";
            messageEl.style.color = "#4ecdc4";
          } else {
            messageEl.textContent = "📚 Preparação em andamento! 💪";
          }
        }
      } else {
        // Exam has passed
        const messageEl = document.querySelector(".countdown-message");
        if (messageEl) {
          messageEl.textContent = "🎉 Exame realizado! Parabéns! 🎉";
          messageEl.style.color = "#27ae60";
        }
      }
    };

    updateCountdown();
    setInterval(updateCountdown, 60000); // Update every minute
  },
};

// Study session tracker
const StudyTracker = {
  init() {
    this.startTime = Date.now();
    this.bindEvents();
    this.loadStudyStats();
  },

  bindEvents() {
    // Track study time
    window.addEventListener("beforeunload", () => {
      this.saveStudySession();
    });

    // Track page visibility for accurate time tracking
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.pauseSession();
      } else {
        this.resumeSession();
      }
    });
  },

  saveStudySession() {
    const duration = Date.now() - this.startTime;
    const sessions = JSON.parse(
      localStorage.getItem("sc900StudySessions") || "[]"
    );

    sessions.push({
      date: new Date().toISOString().split("T")[0],
      page: window.location.pathname.split("/").pop(),
      duration: Math.floor(duration / 1000), // in seconds
      completedItems: ProgressTracker.getTotalCompletedItems(),
    });

    // Keep only last 30 sessions
    sessions.splice(0, sessions.length - 30);
    localStorage.setItem("sc900StudySessions", JSON.stringify(sessions));
  },

  pauseSession() {
    this.pausedAt = Date.now();
  },

  resumeSession() {
    if (this.pausedAt) {
      this.startTime += Date.now() - this.pausedAt;
      this.pausedAt = null;
    }
  },

  loadStudyStats() {
    const sessions = JSON.parse(
      localStorage.getItem("sc900StudySessions") || "[]"
    );
    const totalTime = sessions.reduce(
      (sum, session) => sum + session.duration,
      0
    );
    const totalHours = Math.floor(totalTime / 3600);

    console.log(
      `📊 Total study time: ${totalHours} hours from ${sessions.length} sessions`
    );
  },
};

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 Inicializando SC-900 Study Site...");

  // Inicializar rastreamento de progresso primeiro
  ProgressTracker.init();

  // Initialize new features
  FlashCards.init();
  EnhancedResourceFilter.init();
  CountdownTimer.init();
  StudyTracker.init();

  // Only init ResourceFilter on recursos.html
  if (
    window.location.pathname.includes("recursos.html") ||
    document.querySelector("#search-resources")
  ) {
    ResourceFilter.init();
  }

  initSmoothScrolling();
  initActiveNavigation();
  initTimelineAnimation();
  initCardAnimation();

  // Verificação adicional e correção após um breve delay
  setTimeout(() => {
    // Re-verificar se os checkboxes foram criados
    const checkboxCount = document.querySelectorAll(
      'input[type="checkbox"][data-section]'
    ).length;
    console.log(`📊 Checkboxes detectados: ${checkboxCount}`);

    if (checkboxCount === 0) {
      console.log("⚠️ Nenhum checkbox detectado, tentando criar novamente...");
      ProgressTracker.autoCreateProgressTracking();
    }

    // Forçar restauração de estados
    ProgressTracker.restoreCheckboxStates();
    ProgressTracker.updateProgressDisplay();

    console.log("✅ SC-900 Study Site inicializado com sucesso!");
  }, 1500);
});

// Debug and utility functions
function debugProgressSystem() {
  console.log("=== DEBUG DO SISTEMA DE PROGRESSO SC-900 ===");

  const currentSection = window.location.pathname.includes("fase1")
    ? "fase1"
    : window.location.pathname.includes("fase2")
    ? "fase2"
    : window.location.pathname.includes("fase3")
    ? "fase3"
    : window.location.pathname.includes("certificacoes")
    ? "estrategias"
    : window.location.pathname.includes("recursos")
    ? "recursos"
    : "general";

  console.log("Seção atual:", currentSection);

  const checkboxes = document.querySelectorAll(
    'input[type="checkbox"][data-section]'
  );
  console.log("Total de checkboxes encontrados:", checkboxes.length);

  const progress = JSON.parse(localStorage.getItem("sc900Progress") || "{}");
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

// Function to reset everything and start fresh
function resetProgressSystem() {
  if (
    confirm(
      "🗑️ Tem certeza que deseja resetar todo o progresso do SC-900? Esta ação não pode ser desfeita."
    )
  ) {
    localStorage.removeItem("sc900Progress");
    localStorage.removeItem("sc900Metadata");
    localStorage.removeItem("sc900FlashcardUsage");
    localStorage.removeItem("sc900StudySessions");
    localStorage.removeItem("sc900Searches");
    localStorage.removeItem("sc900FilterPrefs");
    location.reload();
  }
}

// Function to export all data
function exportAllData() {
  const allData = {
    progress: JSON.parse(localStorage.getItem("sc900Progress") || "{}"),
    metadata: JSON.parse(localStorage.getItem("sc900Metadata") || "{}"),
    flashcardUsage: JSON.parse(
      localStorage.getItem("sc900FlashcardUsage") || "{}"
    ),
    studySessions: JSON.parse(
      localStorage.getItem("sc900StudySessions") || "[]"
    ),
    searches: JSON.parse(localStorage.getItem("sc900Searches") || "[]"),
    filterPrefs: JSON.parse(localStorage.getItem("sc900FilterPrefs") || "{}"),
    exportDate: new Date().toISOString(),
    examType: "SC-900",
    version: "2.0",
  };

  const blob = new Blob([JSON.stringify(allData, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `sc900-complete-backup-${
    new Date().toISOString().split("T")[0]
  }.json`;
  a.click();
  URL.revokeObjectURL(url);

  console.log("📥 Backup completo SC-900 exportado!");
}

// Export for potential use in other scripts
window.SC900Site = {
  ProgressTracker,
  ResourceFilter,
  FlashCards,
  EnhancedResourceFilter,
  CountdownTimer,
  StudyTracker,
};

// Make debug functions available globally
window.debugProgressSystem = debugProgressSystem;
window.resetProgressSystem = resetProgressSystem;
window.exportAllData = exportAllData;
