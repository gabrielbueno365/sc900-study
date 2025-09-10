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
      version: "3.0",
      examDate: "2025-09-18",
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

      console.log("✅ Modern Progress Tracker initialized");
    } catch (error) {
      console.error("❌ Failed to initialize progress tracker:", error);
    }
  }

  /**
   * Load progress from localStorage with error handling
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
      this.resetToDefaults();
    }
  }

  /**
   * Reset to default values
   */
  resetToDefaults() {
    this.progress = {};
    this.metadata = {
      lastUpdate: new Date().toISOString(),
      totalSessions: 1,
      completedItems: 0,
      version: "3.0",
      examDate: "2025-09-18",
    };
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
      console.log("💾 Progress saved successfully");
    } catch (error) {
      console.error("❌ Error saving progress:", error);
      this.showMessage("Erro ao salvar progresso", "error");
    }
  }

  /**
   * Create modern glassmorphism interface
   */
  createModernInterface() {
    const existingStats = document.querySelector(".progress-stats");
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

    document.body.insertAdjacentHTML("beforeend", statsHTML);
  }

  /**
   * Create modern checkboxes for all list items
   */
  createCheckboxes() {
    const selectors = [
      ".checklist li",
      ".objectives li",
      ".phase-objectives li",
      "ul li:not(.nav-item)",
      ".content ul li",
      ".section ul li",
    ];

    let totalCreated = 0;

    selectors.forEach((selector) => {
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
   * Check if an element should have a checkbox
   */
  shouldCreateCheckbox(item) {
    const text = item.textContent?.trim() || "";
    const hasExistingCheckbox = item.querySelector('input[type="checkbox"]');
    const hasNestedList = item.querySelector("ul, ol");
    const isNavItem = item.closest(".nav-menu");

    return (
      !hasExistingCheckbox &&
      !hasNestedList &&
      !isNavItem &&
      text.length > 10 &&
      text.length < 500
    );
  }

  /**
   * Convert an element to a modern checkbox item
   */
  convertToModernCheckbox(item, index, selector) {
    const text = item.textContent?.trim() || "";
    const section = this.getCurrentSection();
    const textHash = text.substring(0, 20).replace(/[^a-zA-Z0-9]/g, "");
    const uniqueId = `${section}-${selector.replace(
      /[^a-zA-Z0-9]/g,
      ""
    )}-${index}-${textHash}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = uniqueId;
    checkbox.className = "checkbox checklist-checkbox";
    checkbox.dataset.section = section;
    checkbox.dataset.item = uniqueId;

    const label = document.createElement("label");
    label.htmlFor = checkbox.id;
    label.className = "checklist-label";
    label.textContent = text;

    // Clear and rebuild the item
    item.innerHTML = "";
    item.className = "checklist-item";

    item.appendChild(checkbox);
    item.appendChild(label);

    // Apply saved state
    const isCompleted = this.isComplete(section, uniqueId);
    checkbox.checked = isCompleted;

    if (isCompleted) {
      item.classList.add("completed");
    }
  }

  /**
   * Create section progress bars
   */
  createSectionProgressBars() {
    const section = this.getCurrentSection();
    if (section === "general") return;

    const header = document.querySelector(".hero, .page-header");
    if (header && !header.querySelector(".main-progress-container")) {
      const progressHTML = `
        <div class="glass-card main-progress-container" style="margin: 2rem 0; text-align: center;">
          <h3 class="text-xl font-bold mb-4">
            📊 Progresso da ${
              section.charAt(0).toUpperCase() + section.slice(1)
            }
          </h3>
          <div class="progress-container mb-3">
            <div class="progress-bar" data-section="${section}" style="width: 0%"></div>
          </div>
          <div class="progress-text text-sm text-secondary">0% Concluído</div>
        </div>
      `;
      header.insertAdjacentHTML("afterend", progressHTML);
    }
  }

  /**
   * Mark an item as complete
   */
  markComplete(section, item, text = "") {
    if (!this.progress[section]) {
      this.progress[section] = {};
    }

    this.progress[section][item] = {
      completed: true,
      timestamp: new Date().toISOString(),
      text,
    };

    this.hasUnsavedChanges = true;
    this.updateDisplay();
    this.showCompletionAnimation(item);

    console.log(`✅ Marked complete: ${section} - ${item}`);
  }

  /**
   * Mark an item as incomplete
   */
  markIncomplete(section, item) {
    if (this.progress[section]?.[item]) {
      delete this.progress[section][item];
      this.hasUnsavedChanges = true;
      this.updateDisplay();
      console.log(`❌ Marked incomplete: ${section} - ${item}`);
    }
  }

  /**
   * Check if an item is complete
   */
  isComplete(section, item) {
    return this.progress[section]?.[item]?.completed === true;
  }

  /**
   * Get total completed items
   */
  getTotalCompleted() {
    return Object.values(this.progress).reduce(
      (total, section) => total + Object.keys(section).length,
      0
    );
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
    const progressBars = document.querySelectorAll(
      ".progress-bar[data-section], .phase-progress-fill[data-section]"
    );

    progressBars.forEach((bar) => {
      const section = bar.dataset.section;
      if (section) {
        const percentage = this.getCompletionPercentage(section);
        bar.style.width = `${percentage}%`;

        // Update text element
        const container = bar.closest(
          ".main-progress-container, .phase-progress"
        );
        const textElement = container?.querySelector(
          ".progress-text, .progress-percentage"
        );
        if (textElement) {
          textElement.textContent = `${percentage}%`;
        }
      }
    });
  }

  /**
   * Update stats panel
   */
  updateStatsPanel() {
    const stats = this.getProgressStats();

    this.updateElement(".total-completed", `${stats.totalCompleted} itens`);
    this.updateElement(
      ".current-phase",
      stats.currentSection.charAt(0).toUpperCase() +
        stats.currentSection.slice(1)
    );
    this.updateElement(
      ".last-update",
      this.formatRelativeTime(this.metadata.lastUpdate)
    );

    const progressBar = document.querySelector(".overall-progress-bar");
    const progressText = document.querySelector(".overall-progress-text");

    if (progressBar && progressText) {
      progressBar.style.width = `${stats.overallPercentage}%`;
      progressText.textContent = `${stats.overallPercentage}% do SC-900`;
    }
  }

  /**
   * Get progress statistics
   */
  getProgressStats() {
    const allCheckboxes = document.querySelectorAll(
      'input[type="checkbox"][data-section]'
    );
    const completedCheckboxes = Array.from(allCheckboxes).filter(
      (cb) => cb.checked
    );

    return {
      totalCompleted: this.getTotalCompleted(),
      currentSection: this.getCurrentSection(),
      lastUpdate: this.metadata.lastUpdate,
      overallPercentage:
        allCheckboxes.length > 0
          ? Math.round(
              (completedCheckboxes.length / allCheckboxes.length) * 100
            )
          : 0,
    };
  }

  /**
   * Utility method to update element content
   */
  updateElement(selector, content) {
    const element = document.querySelector(selector);
    if (element) {
      element.textContent = content;
    }
  }

  /**
   * Format relative time
   */
  formatRelativeTime(timestamp) {
    if (!timestamp) return "Nunca";

    const now = Date.now();
    const then = new Date(timestamp).getTime();
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Agora";
    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h atrás`;

    return new Date(timestamp).toLocaleDateString("pt-BR");
  }

  /**
   * Get current section based on URL
   */
  getCurrentSection() {
    const path = window.location.pathname;
    if (path.includes("fase1.html")) return "fase1";
    if (path.includes("fase2.html")) return "fase2";
    if (path.includes("fase3.html")) return "fase3";
    if (path.includes("certificacoes.html")) return "estrategias";
    if (path.includes("recursos.html")) return "recursos";
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

    // Restore checkbox states after short delay
    setTimeout(() => {
      this.restoreCheckboxStates();
      this.updateDisplay();
    }, 500);
  }

  /**
   * Handle checkbox change event
   */
  handleCheckboxChange(checkbox) {
    const section = checkbox.dataset.section;
    const item = checkbox.dataset.item;
    const label = checkbox.nextElementSibling;
    const container = checkbox.parentElement;

    if (checkbox.checked) {
      this.markComplete(section, item, label?.textContent || "");
      container.classList.add("completed");
    } else {
      this.markIncomplete(section, item);
      container.classList.remove("completed");
    }

    this.saveProgress();
  }

  /**
   * Restore checkbox states from saved progress
   */
  restoreCheckboxStates() {
    const checkboxes = document.querySelectorAll(
      'input[type="checkbox"][data-section]'
    );
    let restoredCount = 0;

    checkboxes.forEach((checkbox) => {
      const section = checkbox.dataset.section;
      const item = checkbox.dataset.item;
      const container = checkbox.parentElement;

      const wasChecked = checkbox.checked;
      const shouldBeChecked = this.isComplete(section, item);

      checkbox.checked = shouldBeChecked;

      if (shouldBeChecked) {
        container.classList.add("completed");
        if (!wasChecked) restoredCount++;
      } else {
        container.classList.remove("completed");
      }
    });

    console.log(
      `✅ Restored ${restoredCount} checkboxes from ${checkboxes.length} total`
    );
  }

  /**
   * Show completion animation with confetti
   */
  showCompletionAnimation(itemId) {
    const checkbox = document.getElementById(itemId);
    if (!checkbox) return;

    // Animate checkbox
    checkbox.style.transform = "scale(1.3) rotate(360deg)";
    checkbox.style.transition =
      "all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)";

    setTimeout(() => {
      checkbox.style.transform = "scale(1) rotate(0deg)";
    }, 300);

    // Show success message
    this.showMessage("🎉 Item concluído! Excelente progresso!", "success");

    // Create confetti effect
    this.createConfettiEffect(checkbox);
  }

  /**
   * Create confetti animation effect
   */
  createConfettiEffect(element) {
    const rect = element.getBoundingClientRect();
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

    for (let i = 0; i < 12; i++) {
      const confetti = document.createElement("div");
      const color = colors[Math.floor(Math.random() * colors.length)];

      confetti.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: ${color};
        top: ${rect.top + rect.height / 2}px;
        left: ${rect.left + rect.width / 2}px;
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        animation: confettiFall 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      `;

      const angle = (Math.PI * 2 * i) / 12;
      const velocity = 60 + Math.random() * 40;
      const dx = Math.cos(angle) * velocity;
      const dy = Math.sin(angle) * velocity - 120;

      confetti.style.setProperty("--dx", `${dx}px`);
      confetti.style.setProperty("--dy", `${dy}px`);

      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 1200);
    }

    this.ensureConfettiAnimation();
  }

  /**
   * Ensure confetti animation CSS exists
   */
  ensureConfettiAnimation() {
    if (document.querySelector("#confetti-animation")) return;

    const style = document.createElement("style");
    style.id = "confetti-animation";
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

  /**
   * Show temporary message
   */
  showMessage(message, type = "info") {
    const existingMessage = document.querySelector(".temp-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    const messageDiv = document.createElement("div");
    messageDiv.className = `temp-message ${type}`;
    messageDiv.textContent = message;

    document.body.appendChild(messageDiv);

    setTimeout(() => {
      messageDiv.style.animation = "slideOutRight 0.3s ease-in forwards";
      setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
  }

  /**
   * Show save indicator
   */
  showSaveIndicator() {
    const indicator = document.querySelector(".save-indicator");
    if (indicator) {
      indicator.style.opacity = "1";
      setTimeout(() => {
        indicator.style.opacity = "0";
      }, 2000);
    }
  }

  /**
   * Setup auto-save functionality
   */
  setupAutoSave() {
    setInterval(() => {
      if (this.hasUnsavedChanges) {
        this.saveProgress();
        this.hasUnsavedChanges = false;
      }
    }, 30000);
  }

  /**
   * Export progress data
   */
  exportProgress() {
    const exportData = {
      progress: this.progress,
      metadata: this.metadata,
      exportDate: new Date().toISOString(),
      totalItems: this.getTotalCompleted(),
      examType: "SC-900",
      version: "3.0",
    };

    this.downloadJSON(
      exportData,
      `sc900-progress-${new Date().toISOString().split("T")[0]}.json`
    );
    this.showMessage("📥 Progresso exportado com sucesso!", "success");
  }

  /**
   * Download data as JSON file
   */
  downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Confirm and reset progress
   */
  confirmReset() {
    const confirmed = confirm(
      "🗑️ Tem certeza que deseja resetar todo o progresso do SC-900? Esta ação não pode ser desfeita."
    );

    if (confirmed) {
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
      totalSessions: 0,
      completedItems: 0,
      version: "3.0",
      examDate: "2025-09-18",
    };

    localStorage.removeItem("sc900Progress");
    localStorage.removeItem("sc900Metadata");

    // Uncheck all checkboxes
    const checkboxes = document.querySelectorAll(
      'input[type="checkbox"][data-section]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
      checkbox.parentElement?.classList.remove("completed");
    });

    this.updateDisplay();
    this.showMessage("🗑️ Progresso resetado com sucesso!", "success");
  }
}

// =========================================
// MODERN COUNTDOWN TIMER
// =========================================

class ModernCountdownTimer {
  constructor() {
    this.examDate = new Date("2025-09-18T09:00:00");
    this.timerInterval = undefined;
  }

  init() {
    this.createCountdownDisplay();
    this.startCountdown();
  }

  createCountdownDisplay() {
    const heroSection = document.querySelector(".hero");
    if (!heroSection || heroSection.querySelector(".countdown-section")) return;

    const countdownHTML = `
      <div class="countdown-section">
        <div class="countdown-content">
          <h3 class="countdown-title">⏰ Countdown para o SC-900</h3>
          <div class="countdown-display">
            <div class="time-unit">
              <div class="time-number days">--</div>
              <div class="time-label">Dias</div>
            </div>
            <div class="time-unit">
              <div class="time-number hours">--</div>
              <div class="time-label">Horas</div>
            </div>
            <div class="time-unit">
              <div class="time-number minutes">--</div>
              <div class="time-label">Minutos</div>
            </div>
          </div>
          <div class="countdown-message">Preparação em andamento! 💪</div>
        </div>
      </div>
    `;

    heroSection.insertAdjacentHTML("beforeend", countdownHTML);
  }

  startCountdown() {
    const updateCountdown = () => {
      const now = new Date();
      const difference = this.examDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );

        this.updateTimeDisplay("days", days);
        this.updateTimeDisplay("hours", hours);
        this.updateTimeDisplay("minutes", minutes);

        this.updateMessage(days);
      } else {
        this.showExamCompleted();
      }
    };

    updateCountdown();
    this.timerInterval = setInterval(updateCountdown, 60000);
  }

  updateTimeDisplay(unit, value) {
    const element = document.querySelector(`.time-number.${unit}`);
    if (element) {
      element.textContent = value.toString().padStart(2, "0");
    }
  }

  updateMessage(days) {
    const messageEl = document.querySelector(".countdown-message");
    if (!messageEl) return;

    let message = "📚 Preparação em andamento! 💪";

    if (days <= 1) {
      message = "🔥 Exame amanhã! Último review!";
    } else if (days <= 3) {
      message = "⚡ Reta final! Foque na revisão!";
    } else if (days <= 7) {
      message = "💪 Semana decisiva! Vamos lá!";
    }

    messageEl.textContent = message;
  }

  showExamCompleted() {
    const messageEl = document.querySelector(".countdown-message");
    if (messageEl) {
      messageEl.textContent = "🎉 Exame realizado! Parabéns! 🎉";
    }

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}

// =========================================
// MODERN NAVIGATION
// =========================================

class ModernNavigation {
  init() {
    this.enhanceNavigation();
    this.addScrollEffects();
    this.setupMobileMenu();
  }

  enhanceNavigation() {
    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (
        href === currentPage ||
        (currentPage === "index.html" && href === "./")
      ) {
        link.classList.add("active");
      }
    });
  }

  addScrollEffects() {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });
  }

  setupMobileMenu() {
    const toggle = document.querySelector(".mobile-menu-toggle");
    const menu = document.querySelector(".nav-menu");

    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {
      menu.classList.toggle("open");
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove("open");
      }
    });
  }
}

// =========================================
// ANIMATION UTILS
// =========================================

class AnimationUtils {
  static initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-slideInUp");
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
      ".progress-card, .phase-card, .glass-card"
    );

    animateElements.forEach((el) => {
      observer.observe(el);
    });
  }

  static initSmoothScrolling() {
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
}

// =========================================
// MAIN APPLICATION
// =========================================

class SC900ModernApp {
  constructor() {
    this.progressTracker = new ModernProgressTracker();
    this.countdownTimer = new ModernCountdownTimer();
    this.navigation = new ModernNavigation();
  }

  async init() {
    try {
      console.log("🚀 Initializing SC-900 Modern App...");

      await this.progressTracker.init();
      this.countdownTimer.init();
      this.navigation.init();

      AnimationUtils.initScrollAnimations();
      AnimationUtils.initSmoothScrolling();

      console.log("✅ SC-900 Modern App initialized successfully!");
    } catch (error) {
      console.error("❌ Failed to initialize SC-900 Modern App:", error);
    }
  }

  getProgressTracker() {
    return this.progressTracker;
  }
}

// =========================================
// GLOBAL INITIALIZATION
// =========================================

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
  const app = new SC900ModernApp();
  await app.init();

  // Make app globally available for debugging
  window.SC900App = app;

  // Legacy compatibility for old code
  window.ProgressTracker = app.progressTracker;
});

// Export for potential use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    SC900ModernApp,
    ModernProgressTracker,
    ModernCountdownTimer,
    ModernNavigation,
    AnimationUtils,
  };
}
