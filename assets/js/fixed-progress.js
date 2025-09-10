/**
 * SC-900 Fixed Progress Tracker
 * Simplified and functional progress tracking system
 */

class SC900ProgressTracker {
  constructor() {
    this.progress = {};
    this.metadata = {
      lastUpdate: new Date().toISOString(),
      totalSessions: 0,
      completedItems: 0,
      version: "4.0",
      examDate: "2025-09-18",
    };
    this.hasUnsavedChanges = false;
    this.autoSaveInterval = null;
    this.countdownInterval = null;

    // Achievement system
    this.achievements = {
      "first-steps": {
        name: "Primeiros Passos",
        description: "Completou sua primeira tarefa",
        icon: "👶",
        unlocked: false,
      },
      "identity-master": {
        name: "Mestre da Identidade",
        description: "Completou 100% dos tópicos de Microsoft Entra",
        icon: "🔐",
        unlocked: false,
      },
      "security-expert": {
        name: "Expert em Segurança",
        description: "Dominou Soluções de Segurança Microsoft",
        icon: "🛡️",
        unlocked: false,
      },
      "compliance-guru": {
        name: "Guru do Compliance",
        description: "Completou todos os tópicos de Microsoft Purview",
        icon: "📋",
        unlocked: false,
      },
      "speed-runner": {
        name: "Velocista",
        description: "Completou uma fase em menos de 2 dias",
        icon: "⚡",
        unlocked: false,
      },
      perfectionist: {
        name: "Perfeccionista",
        description: "Completou 100% de todos os tópicos",
        icon: "🏆",
        unlocked: false,
      },
    };
  }

  /**
   * Initialize the progress tracker
   */
  init() {
    try {
      this.loadProgress();
      this.createProgressInterface();
      this.createCheckboxes();
      this.bindEvents();
      this.updateDisplay();
      this.setupAutoSave();
      this.initCountdown();

      console.log("✅ SC-900 Progress Tracker initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize progress tracker:", error);
    }
  }

  /**
   * Load progress from localStorage
   */
  loadProgress() {
    try {
      const progressData = localStorage.getItem("sc900Progress");
      const metadataData = localStorage.getItem("sc900Metadata");

      this.progress = progressData ? JSON.parse(progressData) : {};
      this.metadata = metadataData
        ? { ...this.metadata, ...JSON.parse(metadataData) }
        : this.metadata;

      this.metadata.totalSessions++;
      console.log(
        `📊 Loaded progress: ${this.getTotalCompleted()} items completed`
      );
    } catch (error) {
      console.error("❌ Error loading progress:", error);
      this.progress = {};
    }
  }

  /**
   * Save progress to localStorage
   */
  saveProgress() {
    try {
      this.metadata.lastUpdate = new Date().toISOString();
      this.metadata.completedItems = this.getTotalCompleted();

      localStorage.setItem("sc900Progress", JSON.stringify(this.progress));
      localStorage.setItem("sc900Metadata", JSON.stringify(this.metadata));

      this.showSaveIndicator();
      this.hasUnsavedChanges = false;
      console.log("💾 Progress saved successfully");
    } catch (error) {
      console.error("❌ Error saving progress:", error);
    }
  }

  /**
   * Create the progress interface panel
   */
  createProgressInterface() {
    // Remove existing panel if it exists
    const existingPanel = document.querySelector(".progress-stats");
    if (existingPanel) {
      existingPanel.remove();
    }

    const panelHTML = `
      <div class="progress-stats">
        <div class="progress-stats-title">
          <span class="progress-icon">📊</span>
          <span>Progresso SC-900</span>
        </div>
        
        <div class="stat-item">
          <span class="stat-label">✅ Completo:</span>
          <span class="stat-value total-completed">0 itens</span>
        </div>
        
        <div class="stat-item">
          <span class="stat-label">📚 Fase:</span>
          <span class="stat-value current-phase">General</span>
        </div>
        
        <div class="stat-item">
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

    document.body.insertAdjacentHTML("beforeend", panelHTML);
  }

  /**
   * Create checkboxes for progress tracking
   */
  createCheckboxes() {
    const selectors = [
      ".phase-objectives li",
      ".checklist li",
      ".objectives li",
    ];

    let checkboxCount = 0;

    selectors.forEach((selector) => {
      const items = document.querySelectorAll(selector);
      items.forEach((item, index) => {
        if (this.shouldCreateCheckbox(item)) {
          this.convertToCheckbox(item, checkboxCount, selector);
          checkboxCount++;
        }
      });
    });

    console.log(`✅ Created ${checkboxCount} checkboxes`);
  }

  /**
   * Check if an item should have a checkbox
   */
  shouldCreateCheckbox(item) {
    // Skip if already has a checkbox
    if (item.querySelector('input[type="checkbox"]')) {
      return false;
    }

    // Skip navigation items
    if (item.closest(".nav-menu")) {
      return false;
    }

    // Skip if it's just a link without content
    const text = item.textContent.trim();
    if (text.length < 10) {
      return false;
    }

    return true;
  }

  /**
   * Convert a list item to have a checkbox
   */
  convertToCheckbox(item, index, selector) {
    const text = item.textContent.trim();
    const section = this.getSectionFromSelector(selector);
    const itemId = `item_${section}_${index}`;
    const descId = `desc_${section}_${index}`;

    // Create checkbox HTML with proper accessibility
    const checkboxHTML = `
      <div class="checkbox-item">
        <input type="checkbox" id="${itemId}" data-section="${section}" data-item="${index}" aria-describedby="${descId}">
        <label for="${itemId}" id="${descId}">${text}</label>
      </div>
    `;

    item.innerHTML = checkboxHTML;
    item.classList.add("progress-item");
  }

  /**
   * Get section name from selector
   */
  getSectionFromSelector(selector) {
    if (selector.includes("phase-objectives")) {
      return "phase";
    } else if (selector.includes("checklist")) {
      return "checklist";
    } else if (selector.includes("objectives")) {
      return "objectives";
    }
    return "general";
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Checkbox change events
    document.addEventListener("change", (e) => {
      if (e.target.type === "checkbox" && e.target.dataset.section) {
        this.handleCheckboxChange(e.target);
      }
    });

    // Button click events
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("export-progress")) {
        this.exportProgress();
      } else if (e.target.classList.contains("reset-progress")) {
        this.confirmReset();
      }
    });

    // Mobile menu toggle
    const mobileToggle = document.querySelector(".mobile-menu-toggle");
    const navMenu = document.querySelector(".nav-menu");

    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener("click", () => {
        navMenu.classList.toggle("open");
      });
    }

    // Restore checkbox states after a short delay
    setTimeout(() => {
      this.restoreCheckboxStates();
    }, 100);
  }

  /**
   * Handle checkbox state changes
   */
  handleCheckboxChange(checkbox) {
    const section = checkbox.dataset.section;
    const item = checkbox.dataset.item;
    const isChecked = checkbox.checked;

    if (isChecked) {
      this.markComplete(section, item, checkbox.nextElementSibling.textContent);
      this.addCheckAnimation(checkbox);
    } else {
      this.markIncomplete(section, item);
    }

    this.updateDisplay();
    this.checkAchievements();
    this.hasUnsavedChanges = true;

    // Use debounced save for better performance
    if (this.debouncedSave) {
      this.debouncedSave();
    }
  }
  /**
   * Mark an item as complete
   */
  markComplete(section, item, text) {
    if (!this.progress[section]) {
      this.progress[section] = {};
    }

    this.progress[section][item] = {
      completed: true,
      timestamp: new Date().toISOString(),
      text: text,
    };

    console.log(`✅ Marked complete: ${section} - ${item}`);
  }

  /**
   * Mark an item as incomplete
   */
  markIncomplete(section, item) {
    if (this.progress[section] && this.progress[section][item]) {
      delete this.progress[section][item];
      console.log(`❌ Marked incomplete: ${section} - ${item}`);
    }
  }

  /**
   * Check if an item is complete
   */
  isComplete(section, item) {
    return (
      this.progress[section] &&
      this.progress[section][item] &&
      this.progress[section][item].completed === true
    );
  }

  /**
   * Get total completed items
   */
  getTotalCompleted() {
    let total = 0;
    Object.values(this.progress).forEach((section) => {
      total += Object.keys(section).length;
    });
    return total;
  }

  /**
   * Get completion percentage for a section
   */
  getCompletionPercentage(section) {
    const checkboxes = document.querySelectorAll(
      `input[type="checkbox"][data-section="${section}"]`
    );
    const total = checkboxes.length;
    const completed = Array.from(checkboxes).filter((cb) => cb.checked).length;

    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  /**
   * Update all displays
   */
  updateDisplay() {
    this.updateProgressBars();
    this.updateStatsPanel();
  }

  /**
   * Update progress bars
   */
  updateProgressBars() {
    // Update phase progress bars
    document.querySelectorAll(".phase-progress-fill").forEach((bar) => {
      const section = bar.dataset.section || "phase";
      const percentage = this.getCompletionPercentage(section);
      bar.style.width = `${percentage}%`;

      // Update percentage text
      const percentageElement = bar
        .closest(".phase-progress")
        .querySelector(".progress-percentage");
      if (percentageElement) {
        percentageElement.textContent = `${percentage}%`;
      }
    });
  }

  /**
   * Update stats panel
   */
  updateStatsPanel() {
    const totalCompleted = this.getTotalCompleted();
    const allCheckboxes = document.querySelectorAll(
      'input[type="checkbox"][data-section]'
    );
    const completedCheckboxes = Array.from(allCheckboxes).filter(
      (cb) => cb.checked
    );
    const overallPercentage =
      allCheckboxes.length > 0
        ? Math.round((completedCheckboxes.length / allCheckboxes.length) * 100)
        : 0;

    // Update elements
    const totalCompletedEl = document.querySelector(".total-completed");
    const overallProgressBar = document.querySelector(".overall-progress-bar");
    const overallProgressText = document.querySelector(
      ".overall-progress-text"
    );
    const lastUpdateEl = document.querySelector(".last-update");

    if (totalCompletedEl) {
      totalCompletedEl.textContent = `${totalCompleted} itens`;
    }

    if (overallProgressBar) {
      overallProgressBar.style.width = `${overallPercentage}%`;
    }

    if (overallProgressText) {
      overallProgressText.textContent = `${overallPercentage}% do SC-900`;
    }

    if (lastUpdateEl) {
      lastUpdateEl.textContent = "Agora";
    }
  }

  /**
   * Restore checkbox states from saved progress
   */
  restoreCheckboxStates() {
    Object.keys(this.progress).forEach((section) => {
      Object.keys(this.progress[section]).forEach((item) => {
        const checkbox = document.querySelector(
          `input[data-section="${section}"][data-item="${item}"]`
        );
        if (checkbox) {
          checkbox.checked = true;
          checkbox.closest(".progress-item")?.classList.add("completed");
        }
      });
    });

    this.updateDisplay();
  }

  /**
   * Show save indicator
   */
  showSaveIndicator() {
    const indicator = document.querySelector(".save-indicator");
    if (indicator) {
      indicator.style.opacity = "1";
      setTimeout(() => {
        indicator.style.opacity = "0.7";
      }, 2000);
    }
  }

  /**
   * Setup auto-save
   */
  setupAutoSave() {
    // Create debounced save function
    this.debouncedSave = this.debounce(() => {
      this.saveProgress();
    }, 500);

    // Auto-save every 30 seconds
    this.autoSaveInterval = setInterval(() => {
      if (this.hasUnsavedChanges) {
        this.saveProgress();
      }
    }, 30000);

    // Save on page unload
    window.addEventListener("beforeunload", () => {
      if (this.hasUnsavedChanges) {
        this.saveProgress();
      }
    });
  }

  /**
   * Export progress data
   */
  exportProgress() {
    const data = {
      progress: this.progress,
      metadata: this.metadata,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sc900-progress-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log("📥 Progress exported successfully");
  }

  /**
   * Confirm and reset progress
   */
  confirmReset() {
    if (
      confirm(
        "Tem certeza que deseja resetar todo o progresso? Esta ação não pode ser desfeita."
      )
    ) {
      this.resetProgress();
    }
  }

  /**
   * Reset all progress
   */
  resetProgress() {
    this.progress = {};
    this.metadata = {
      lastUpdate: new Date().toISOString(),
      totalSessions: 1,
      completedItems: 0,
      version: "4.0",
      examDate: "2025-09-18",
    };

    // Uncheck all checkboxes
    document
      .querySelectorAll('input[type="checkbox"][data-section]')
      .forEach((checkbox) => {
        checkbox.checked = false;
        checkbox.closest(".progress-item")?.classList.remove("completed");
      });

    this.saveProgress();
    this.updateDisplay();

    console.log("🗑️ Progress reset successfully");
  }

  /**
   * Cleanup method
   */
  destroy() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  /**
   * Initialize and start countdown timer
   */
  initCountdown() {
    const countdownElement = document.getElementById("countdown");
    if (!countdownElement) {
      console.log(
        "⏰ Countdown element not found, skipping countdown initialization"
      );
      return;
    }

    this.updateCountdown();
    this.countdownInterval = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  /**
   * Update countdown display
   */
  updateCountdown() {
    const examDate = new Date("2025-09-18T09:00:00-03:00");
    const now = new Date();
    const timeLeft = examDate - now;

    const countdownElement = document.getElementById("countdown");
    if (!countdownElement) return;

    if (timeLeft <= 0) {
      countdownElement.innerHTML = `
        <div class="countdown-expired">
          <div class="time-unit">
            <div class="time-number">🎉</div>
            <div class="time-label">DIA DA PROVA!</div>
          </div>
        </div>
      `;
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
      }
      return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    countdownElement.innerHTML = `
      <div class="countdown-display">
        <div class="time-unit">
          <div class="time-number">${days.toString().padStart(2, "0")}</div>
          <div class="time-label">Dias</div>
        </div>
        <div class="time-unit">
          <div class="time-number">${hours.toString().padStart(2, "0")}</div>
          <div class="time-label">Horas</div>
        </div>
        <div class="time-unit">
          <div class="time-number">${minutes.toString().padStart(2, "0")}</div>
          <div class="time-label">Minutos</div>
        </div>
        <div class="time-unit">
          <div class="time-number">${seconds.toString().padStart(2, "0")}</div>
          <div class="time-label">Segundos</div>
        </div>
      </div>
    `;
  }

  /**
   * Debounce function to limit frequent saves
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Add check animation to completed item
   */
  addCheckAnimation(checkbox) {
    const item = checkbox.closest(".progress-item");
    if (item) {
      item.classList.add("checking");
      setTimeout(() => {
        item.classList.remove("checking");
        item.classList.add("completed");
      }, 300);
    }
  }

  /**
   * Check and unlock achievements
   */
  checkAchievements() {
    const totalCompleted = this.getTotalCompleted();

    // First steps achievement
    if (totalCompleted >= 1 && !this.achievements["first-steps"].unlocked) {
      this.unlockAchievement("first-steps");
    }

    // Check section-specific achievements
    const phaseProgress = this.getCompletionPercentage("phase");
    if (
      phaseProgress === 100 &&
      !this.achievements["identity-master"].unlocked
    ) {
      this.unlockAchievement("identity-master");
    }

    // Perfectionist achievement
    const allCheckboxes = document.querySelectorAll(
      'input[type="checkbox"][data-section]'
    );
    const completedCheckboxes = Array.from(allCheckboxes).filter(
      (cb) => cb.checked
    );
    const overallPercentage =
      allCheckboxes.length > 0
        ? Math.round((completedCheckboxes.length / allCheckboxes.length) * 100)
        : 0;

    if (
      overallPercentage === 100 &&
      !this.achievements["perfectionist"].unlocked
    ) {
      this.unlockAchievement("perfectionist");
    }
  }

  /**
   * Unlock an achievement
   */
  unlockAchievement(achievementKey) {
    if (this.achievements[achievementKey]) {
      this.achievements[achievementKey].unlocked = true;
      this.showAchievementNotification(this.achievements[achievementKey]);
      console.log(
        `🏆 Achievement Unlocked: ${this.achievements[achievementKey].name}`
      );
    }
  }

  /**
   * Show achievement notification
   */
  showAchievementNotification(achievement) {
    const notification = document.createElement("div");
    notification.className = "achievement-notification";
    notification.innerHTML = `
      <div class="achievement-content">
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-text">
          <div class="achievement-title">🏆 Achievement Unlocked!</div>
          <div class="achievement-name">${achievement.name}</div>
          <div class="achievement-desc">${achievement.description}</div>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add("show"), 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  /**
   * Initialize and start countdown timer
   */
  initCountdown() {
    const countdownElement = document.getElementById("countdown");
    if (!countdownElement) {
      console.log(
        "⏰ Countdown element not found, skipping countdown initialization"
      );
      return;
    }

    this.updateCountdown();
    this.countdownInterval = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  /**
   * Update countdown display
   */
  updateCountdown() {
    const examDate = new Date("2025-09-18T09:00:00-03:00");
    const now = new Date();
    const timeLeft = examDate - now;

    const countdownElement = document.getElementById("countdown");
    if (!countdownElement) return;

    if (timeLeft <= 0) {
      countdownElement.innerHTML = `
        <div class="countdown-expired">
          <div class="time-unit">
            <div class="time-number">🎉</div>
            <div class="time-label">DIA DA PROVA!</div>
          </div>
        </div>
      `;
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
      }
      return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    countdownElement.innerHTML = `
      <div class="countdown-display">
        <div class="time-unit">
          <div class="time-number">${days.toString().padStart(2, "0")}</div>
          <div class="time-label">Dias</div>
        </div>
        <div class="time-unit">
          <div class="time-number">${hours.toString().padStart(2, "0")}</div>
          <div class="time-label">Horas</div>
        </div>
        <div class="time-unit">
          <div class="time-number">${minutes.toString().padStart(2, "0")}</div>
          <div class="time-label">Minutos</div>
        </div>
        <div class="time-unit">
          <div class="time-number">${seconds.toString().padStart(2, "0")}</div>
          <div class="time-label">Segundos</div>
        </div>
      </div>
    `;
  }

  /**
   * Cleanup method
   */
  destroy() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.sc900Tracker = new SC900ProgressTracker();
  window.sc900Tracker.init();
});

// Legacy support for existing code
window.ProgressTracker = {
  init: () => {
    if (window.sc900Tracker) {
      window.sc900Tracker.init();
    }
  },
  saveProgress: () => {
    if (window.sc900Tracker) {
      window.sc900Tracker.saveProgress();
    }
  },
};

// Performance monitoring
window.addEventListener("load", () => {
  const loadTime = performance.now();
  console.log(`🚀 Page loaded in ${Math.round(loadTime)}ms`);

  // Report performance if supported
  if ("getEntriesByType" in performance) {
    const navTiming = performance.getEntriesByType("navigation")[0];
    if (navTiming) {
      console.log(`📊 Performance Stats:
        - DOM Content Loaded: ${Math.round(
          navTiming.domContentLoadedEventEnd -
            navTiming.domContentLoadedEventStart
        )}ms
        - Load Complete: ${Math.round(
          navTiming.loadEventEnd - navTiming.loadEventStart
        )}ms
        - First Paint: ${Math.round(
          navTiming.responseStart - navTiming.requestStart
        )}ms`);
    }
  }
});
