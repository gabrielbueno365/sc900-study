/**
 * SC-900 Modern Study Site - TypeScript Implementation
 * Enhanced progress tracking with modern TypeScript patterns
 */

// =========================================
// TYPE DEFINITIONS
// =========================================

interface ProgressData {
  [section: string]: {
    [item: string]: {
      completed: boolean;
      timestamp: string;
      text: string;
    };
  };
}

interface Metadata {
  lastUpdate: string;
  totalSessions: number;
  completedItems: number;
  version: string;
  examDate: string;
}

interface StudySession {
  date: string;
  page: string;
  duration: number;
  completedItems: number;
}

interface CheckboxElement extends HTMLInputElement {
  dataset: {
    section: string;
    item: string;
  };
}

interface ProgressStats {
  totalCompleted: number;
  currentSection: string;
  lastUpdate: string;
  overallPercentage: number;
}

// =========================================
// MODERN PROGRESS TRACKER CLASS
// =========================================

class ModernProgressTracker {
  private progress: ProgressData = {};
  private metadata: Metadata;
  private hasUnsavedChanges = false;
  private startTime = Date.now();
  private pausedAt?: number;

  constructor() {
    this.metadata = {
      lastUpdate: new Date().toISOString(),
      totalSessions: 0,
      completedItems: 0,
      version: "3.0",
      examDate: "2025-09-18",
    };
  }

  /**
   * Initialize the progress tracker
   */
  public async init(): Promise<void> {
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
  private loadProgress(): void {
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
  private resetToDefaults(): void {
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
  private saveProgress(): void {
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
  private createModernInterface(): void {
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
  private createCheckboxes(): void {
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
        if (this.shouldCreateCheckbox(item as HTMLElement)) {
          this.convertToModernCheckbox(
            item as HTMLElement,
            totalCreated,
            selector
          );
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
  private shouldCreateCheckbox(item: HTMLElement): boolean {
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
  private convertToModernCheckbox(
    item: HTMLElement,
    index: number,
    selector: string
  ): void {
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
  private createSectionProgressBars(): void {
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
  public markComplete(section: string, item: string, text = ""): void {
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
  public markIncomplete(section: string, item: string): void {
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
  public isComplete(section: string, item: string): boolean {
    return this.progress[section]?.[item]?.completed === true;
  }

  /**
   * Get total completed items
   */
  public getTotalCompleted(): number {
    return Object.values(this.progress).reduce(
      (total, section) => total + Object.keys(section).length,
      0
    );
  }

  /**
   * Get completion percentage for a section
   */
  private getCompletionPercentage(section: string): number {
    const checkboxes = document.querySelectorAll<CheckboxElement>(
      `input[type="checkbox"][data-section="${section}"]`
    );

    const total = checkboxes.length;
    const completed = Array.from(checkboxes).filter((cb) => cb.checked).length;

    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  /**
   * Update all displays
   */
  private updateDisplay(): void {
    this.updateProgressBars();
    this.updateStatsPanel();
  }

  /**
   * Update progress bars
   */
  private updateProgressBars(): void {
    const progressBars = document.querySelectorAll<HTMLElement>(
      ".progress-bar[data-section]"
    );

    progressBars.forEach((bar) => {
      const section = bar.dataset.section;
      if (section) {
        const percentage = this.getCompletionPercentage(section);
        bar.style.width = `${percentage}%`;

        const textElement = bar
          .closest(".main-progress-container")
          ?.querySelector(".progress-text");
        if (textElement) {
          textElement.textContent = `${percentage}% Concluído`;
        }
      }
    });
  }

  /**
   * Update stats panel
   */
  private updateStatsPanel(): void {
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

    const progressBar = document.querySelector<HTMLElement>(
      ".overall-progress-bar"
    );
    const progressText = document.querySelector(".overall-progress-text");

    if (progressBar && progressText) {
      progressBar.style.width = `${stats.overallPercentage}%`;
      progressText.textContent = `${stats.overallPercentage}% do SC-900`;
    }
  }

  /**
   * Get progress statistics
   */
  private getProgressStats(): ProgressStats {
    const allCheckboxes = document.querySelectorAll<CheckboxElement>(
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
  private updateElement(selector: string, content: string): void {
    const element = document.querySelector(selector);
    if (element) {
      element.textContent = content;
    }
  }

  /**
   * Format relative time
   */
  private formatRelativeTime(timestamp: string): string {
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
  private getCurrentSection(): string {
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
  private bindEvents(): void {
    // Checkbox change events
    document.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      if (target.type === "checkbox" && target.dataset.section) {
        this.handleCheckboxChange(target as CheckboxElement);
      }
    });

    // Button click events
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;

      if (target.classList.contains("export-progress")) {
        this.exportProgress();
      } else if (target.classList.contains("reset-progress")) {
        this.confirmReset();
      }
    });

    // Page visibility for study tracking
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.pauseSession();
      } else {
        this.resumeSession();
      }
    });

    // Save on page unload
    window.addEventListener("beforeunload", () => {
      if (this.hasUnsavedChanges) {
        this.saveProgress();
      }
      this.saveStudySession();
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
  private handleCheckboxChange(checkbox: CheckboxElement): void {
    const section = checkbox.dataset.section;
    const item = checkbox.dataset.item;
    const label = checkbox.nextElementSibling as HTMLElement;
    const container = checkbox.parentElement as HTMLElement;

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
  private restoreCheckboxStates(): void {
    const checkboxes = document.querySelectorAll<CheckboxElement>(
      'input[type="checkbox"][data-section]'
    );
    let restoredCount = 0;

    checkboxes.forEach((checkbox) => {
      const section = checkbox.dataset.section;
      const item = checkbox.dataset.item;
      const container = checkbox.parentElement as HTMLElement;

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
  private showCompletionAnimation(itemId: string): void {
    const checkbox = document.getElementById(itemId) as HTMLInputElement;
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
  private createConfettiEffect(element: HTMLElement): void {
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
  private ensureConfettiAnimation(): void {
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
  private showMessage(
    message: string,
    type: "success" | "error" | "warning" | "info" = "info"
  ): void {
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
  private showSaveIndicator(): void {
    const indicator = document.querySelector(".save-indicator") as HTMLElement;
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
  private setupAutoSave(): void {
    setInterval(() => {
      if (this.hasUnsavedChanges) {
        this.saveProgress();
        this.hasUnsavedChanges = false;
      }
    }, 30000);
  }

  /**
   * Study session tracking
   */
  private pauseSession(): void {
    this.pausedAt = Date.now();
  }

  private resumeSession(): void {
    if (this.pausedAt) {
      this.startTime += Date.now() - this.pausedAt;
      this.pausedAt = undefined;
    }
  }

  private saveStudySession(): void {
    const duration = Date.now() - this.startTime;
    const sessions: StudySession[] = JSON.parse(
      localStorage.getItem("sc900StudySessions") || "[]"
    );

    sessions.push({
      date: new Date().toISOString().split("T")[0],
      page: window.location.pathname.split("/").pop() || "unknown",
      duration: Math.floor(duration / 1000),
      completedItems: this.getTotalCompleted(),
    });

    sessions.splice(0, Math.max(0, sessions.length - 30));
    localStorage.setItem("sc900StudySessions", JSON.stringify(sessions));
  }

  /**
   * Export progress data
   */
  private exportProgress(): void {
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
  private downloadJSON(data: any, filename: string): void {
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
  private confirmReset(): void {
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
  private resetProgress(): void {
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
    const checkboxes = document.querySelectorAll<CheckboxElement>(
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
// MODERN UI COMPONENTS
// =========================================

class ModernCountdownTimer {
  private examDate = new Date("2025-09-18T09:00:00");
  private timerInterval?: number;

  public init(): void {
    this.createCountdownDisplay();
    this.startCountdown();
  }

  private createCountdownDisplay(): void {
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

  private startCountdown(): void {
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
    this.timerInterval = window.setInterval(updateCountdown, 60000);
  }

  private updateTimeDisplay(unit: string, value: number): void {
    const element = document.querySelector(`.time-number.${unit}`);
    if (element) {
      element.textContent = value.toString().padStart(2, "0");
    }
  }

  private updateMessage(days: number): void {
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

  private showExamCompleted(): void {
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
  public init(): void {
    this.enhanceNavigation();
    this.addScrollEffects();
    this.setupMobileMenu();
  }

  private enhanceNavigation(): void {
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

  private addScrollEffects(): void {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    let lastScrollY = window.scrollY;

    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }

      lastScrollY = currentScrollY;
    });
  }

  private setupMobileMenu(): void {
    const toggle = document.querySelector(".mobile-menu-toggle");
    const menu = document.querySelector(".nav-menu");

    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {
      menu.classList.toggle("open");
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      const target = e.target as Element;
      if (!toggle.contains(target) && !menu.contains(target)) {
        menu.classList.remove("open");
      }
    });
  }
}

// =========================================
// ANIMATION UTILS
// =========================================

class AnimationUtils {
  public static initScrollAnimations(): void {
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

  public static initSmoothScrolling(): void {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href")!);
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
  private progressTracker = new ModernProgressTracker();
  private countdownTimer = new ModernCountdownTimer();
  private navigation = new ModernNavigation();

  public async init(): Promise<void> {
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

  public getProgressTracker(): ModernProgressTracker {
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
  (window as any).SC900App = app;
});

// Export for potential use in other modules
export {
  SC900ModernApp,
  ModernProgressTracker,
  ModernCountdownTimer,
  ModernNavigation,
  AnimationUtils,
};
