/* =========================================================
   QUIZ MASTER — Main Application Logic (Enhanced)
   ---------------------------------------------------------
   Features:
     • localStorage persistence for questions, history & theme
     • Quiz flow with 15s countdown timer per question
     • Slide animations between questions
     • Custom quiz size (5, 10, or all questions)
     • Answer review at the end (what you answered vs correct)
     • Results history with bar chart (last 10 results)
     • Light / Dark theme toggle
     • Backoffice CRUD + Import/Export JSON
     • Confetti animation when score >= 75%
   
   Convention:
     • Variable & function names in English
     • UI text in Portuguese (pt-PT)
     • Questions are shuffled each time the quiz starts
   ========================================================= */

// =========================================================
// 1. DEFAULT QUESTIONS (used when localStorage is empty)
// =========================================================

const DEFAULT_QUESTIONS = [
    {
        text: "Qual é a capital de Portugal?",
        options: ["Madrid", "Lisboa", "Paris", "Roma"],
        correct: 1, category: "Geografia", active: true
    },
    {
        text: "Em que ano foi a Revolução dos Cravos?",
        options: ["1970", "1974", "1980", "1986"],
        correct: 1, category: "História", active: true
    },
    {
        text: "Qual é o rio mais longo de Portugal?",
        options: ["Douro", "Mondego", "Tejo", "Guadiana"],
        correct: 2, category: "Geografia", active: true
    },
    {
        text: "Quantos distritos tem Portugal continental?",
        options: ["15", "18", "20", "22"],
        correct: 1, category: "Geografia", active: true
    },
    {
        text: "Qual destes é um prato típico português?",
        options: ["Paella", "Bacalhau à Brás", "Risotto", "Croissant"],
        correct: 1, category: "Cultura", active: true
    },
    {
        text: "Quem escreveu 'Os Lusíadas'?",
        options: ["Fernando Pessoa", "Eça de Queirós", "Luís de Camões", "José Saramago"],
        correct: 2, category: "Cultura", active: true
    },
    {
        text: "Qual é a moeda utilizada em Portugal?",
        options: ["Escudo", "Dólar", "Euro", "Libra"],
        correct: 2, category: "Economia", active: true
    },
    {
        text: "Em que continente se situa Portugal?",
        options: ["América", "Ásia", "África", "Europa"],
        correct: 3, category: "Geografia", active: true
    }
];

// =========================================================
// 2. LOCAL STORAGE KEYS & FUNCTIONS
// =========================================================

const STORAGE_KEY = "quizmaster_questions";
const HISTORY_KEY = "quizmaster_history";
const THEME_KEY = "quizmaster_theme";

/**
 * Carrega as perguntas do localStorage.
 * Se não existirem dados, inicializa com as perguntas de exemplo.
 */
function loadQuestionsFromLocalStorage() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
                // Migrate old questions that lack category/active fields
                const migrated = parsed.map(q => ({
                    ...q,
                    category: q.category || "Geral",
                    active: q.active !== undefined ? q.active : true
                }));
                return migrated;
            }
        } catch (e) {
            console.warn("Erro ao ler localStorage, a usar perguntas de exemplo.", e);
        }
    }
    saveQuestionsToLocalStorage(DEFAULT_QUESTIONS);
    return [...DEFAULT_QUESTIONS];
}

/** Get unique categories from all questions */
function getCategories() {
    const cats = new Set(questions.map(q => q.category || "Geral"));
    return [...cats].sort();
}

/** Get active questions, optionally filtered by category */
function getActiveQuestions(category) {
    return questions.filter(q => {
        if (q.active === false) return false;
        if (category && category !== "__all__") return q.category === category;
        return true;
    });
}

/** Guarda o array de perguntas no localStorage. */
function saveQuestionsToLocalStorage(questions) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
}

/** Carrega o histórico de resultados (últimos 10). */
function loadHistory() {
    try {
        const raw = localStorage.getItem(HISTORY_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

/** Guarda um novo resultado no histórico (máximo 10). */
function saveToHistory(entry) {
    const history = loadHistory();
    history.push(entry);
    // Keep only the last 10
    if (history.length > 10) history.shift();
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

// =========================================================
// 3. THEME MANAGEMENT (Light / Dark)
// =========================================================

/** Load theme from localStorage and apply it */
function loadTheme() {
    const saved = localStorage.getItem(THEME_KEY) || "dark";
    applyTheme(saved);
}

/** Apply a theme */
function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const icon = document.getElementById("theme-icon");
    if (icon) {
        icon.className = theme === "dark"
            ? "bi bi-moon-stars-fill"
            : "bi bi-sun-fill";
    }
}

/** Toggle between light and dark */
function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
}

// =========================================================
// 4. APPLICATION STATE
// =========================================================

let questions = [];
let quizQuestions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let answered = false;
let selectedQuizSize = 0;       // 0 = all
let selectedCategory = "__all__"; // "__all__" = todas
let userAnswers = [];           // Track user's answers: index per question, -1 = timeout
let quizStartTime = 0;          // Timestamp when quiz started

// Timer state
const TIMER_DURATION = 15;   // seconds per question
let timerInterval = null;
let timerSeconds = TIMER_DURATION;
const TIMER_CIRCUMFERENCE = 2 * Math.PI * 17; // r=17 from SVG

// =========================================================
// 5. INITIALIZATION
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
    loadTheme();
    questions = loadQuestionsFromLocalStorage();
    renderBackofficeTable();
    updateStartScreen();

    // Wire up delete confirmation button
    document.getElementById("btn-confirm-delete").addEventListener("click", () => {
        if (pendingDeleteIndex >= 0 && pendingDeleteIndex < questions.length) {
            questions.splice(pendingDeleteIndex, 1);
            saveQuestionsToLocalStorage(questions);
            renderBackofficeTable();
        }
        pendingDeleteIndex = -1;
        const modalEl = document.getElementById("deleteModal");
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
    });
});

// =========================================================
// 6. NAVIGATION (Quiz / History / Backoffice)
// =========================================================

function showSection(section) {
    const sections = ["quiz", "history", "backoffice"];
    sections.forEach(s => {
        const el = document.getElementById(`${s}-section`);
        const nav = document.getElementById(`nav-${s}`);
        if (s === section) {
            el.classList.remove("d-none");
            nav.classList.add("active");
        } else {
            el.classList.add("d-none");
            nav.classList.remove("active");
        }
    });

    if (section === "quiz") {
        stopTimer();
        resetQuizView();
    } else if (section === "backoffice") {
        questions = loadQuestionsFromLocalStorage();
        renderBackofficeTable();
    } else if (section === "history") {
        renderHistory();
    }
}

// =========================================================
// 7. QUIZ — START SCREEN & SIZE SELECTOR
// =========================================================

function updateStartScreen() {
    // Reset filters
    selectedCategory = "__all__";
    selectedQuizSize = 0;

    // Render category filter
    const catContainer = document.getElementById("category-filter-options");
    catContainer.innerHTML = "";
    const categories = getCategories();

    // "Todas" button
    const allBtn = document.createElement("button");
    allBtn.type = "button";
    allBtn.className = "quiz-size-btn active";
    allBtn.textContent = "Todas";
    allBtn.onclick = () => {
        selectedCategory = "__all__";
        catContainer.querySelectorAll(".quiz-size-btn").forEach(b => b.classList.remove("active"));
        allBtn.classList.add("active");
        refreshQuizCount();
    };
    catContainer.appendChild(allBtn);

    categories.forEach(cat => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "quiz-size-btn";
        btn.textContent = cat;
        btn.onclick = () => {
            selectedCategory = cat;
            catContainer.querySelectorAll(".quiz-size-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            refreshQuizCount();
        };
        catContainer.appendChild(btn);
    });

    refreshQuizCount();
}

/** Refresh the available question count and size selector based on category filter */
function refreshQuizCount() {
    const available = getActiveQuestions(selectedCategory);
    const total = available.length;
    document.getElementById("start-question-count").textContent = total;

    // Render quiz size options
    const container = document.getElementById("quiz-size-options");
    container.innerHTML = "";
    selectedQuizSize = 0;

    const sizes = [];
    if (total >= 5) sizes.push(5);
    if (total >= 10) sizes.push(10);
    sizes.push(0);

    sizes.forEach(size => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "quiz-size-btn" + (size === 0 ? " active" : "");
        btn.textContent = size === 0 ? `Todas (${total})` : `${size} perguntas`;
        btn.onclick = () => {
            selectedQuizSize = size;
            container.querySelectorAll(".quiz-size-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
        };
        container.appendChild(btn);
    });
}

function resetQuizView() {
    document.getElementById("quiz-start").classList.remove("d-none");
    document.getElementById("quiz-question").classList.add("d-none");
    document.getElementById("quiz-results").classList.add("d-none");
    questions = loadQuestionsFromLocalStorage();
    updateStartScreen();
}

// =========================================================
// 8. QUIZ — CORE LOGIC
// =========================================================

/** Shuffle array using Fisher-Yates algorithm */
function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

/** Start a new quiz session */
function startQuiz() {
    questions = loadQuestionsFromLocalStorage();

    if (questions.length === 0) {
        alert("Não existem perguntas! Adiciona perguntas no Backoffice.");
        return;
    }

    // Get only active questions for selected category
    let pool = getActiveQuestions(selectedCategory);

    if (pool.length === 0) {
        alert("Não existem perguntas ativas para esta categoria! Ativa perguntas no Backoffice.");
        return;
    }

    // Shuffle and slice to selected size
    let shuffled = shuffleArray(pool);
    if (selectedQuizSize > 0 && selectedQuizSize < shuffled.length) {
        shuffled = shuffled.slice(0, selectedQuizSize);
    }

    quizQuestions = shuffled;
    currentQuestionIndex = 0;
    correctAnswers = 0;
    answered = false;
    userAnswers = [];
    quizStartTime = Date.now();

    document.getElementById("quiz-start").classList.add("d-none");
    document.getElementById("quiz-results").classList.add("d-none");
    document.getElementById("quiz-question").classList.remove("d-none");

    renderQuestion();
}

/** Render the current question with slide-in animation */
function renderQuestion() {
    const q = quizQuestions[currentQuestionIndex];
    const total = quizQuestions.length;
    const card = document.getElementById("question-card-inner");

    // Counter & progress
    document.getElementById("question-counter").textContent =
        `Pergunta ${currentQuestionIndex + 1} / ${total}`;
    document.getElementById("score-live").innerHTML =
        `<i class="bi bi-check-circle me-1"></i>${correctAnswers} correta${correctAnswers !== 1 ? 's' : ''}`;

    const progressPct = (currentQuestionIndex / total) * 100;
    document.getElementById("quiz-progress").style.width = progressPct + "%";

    // Question text
    document.getElementById("question-text").textContent = q.text;

    // Render options
    const container = document.getElementById("options-container");
    container.innerHTML = "";
    const letters = ["A", "B", "C", "D"];

    q.options.forEach((opt, i) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "option-btn";
        btn.innerHTML = `<span class="option-letter">${letters[i]}</span><span>${opt}</span>`;
        btn.onclick = () => selectAnswer(i);
        container.appendChild(btn);
    });

    // Hide next button & timeout message
    document.getElementById("btn-next").classList.add("d-none");
    document.getElementById("timeout-msg").classList.add("d-none");
    answered = false;

    // Slide-in animation
    card.classList.remove("slide-in-right", "slide-out-left");
    void card.offsetWidth;
    card.classList.add("slide-in-right");

    // Start the timer
    startTimer();
}

/** Register user's answer */
function selectAnswer(selectedIndex) {
    if (answered) return;
    answered = true;
    stopTimer();

    const q = quizQuestions[currentQuestionIndex];
    const buttons = document.querySelectorAll("#options-container .option-btn");
    const isCorrect = selectedIndex === q.correct;

    // Track answer
    userAnswers.push(selectedIndex);

    if (isCorrect) {
        correctAnswers++;
        document.getElementById("score-live").innerHTML =
            `<i class="bi bi-check-circle me-1"></i>${correctAnswers} correta${correctAnswers !== 1 ? 's' : ''}`;
    }

    // Highlight buttons
    buttons.forEach((btn, i) => {
        btn.disabled = true;
        if (i === q.correct) {
            btn.classList.add("correct");
        } else if (i === selectedIndex && !isCorrect) {
            btn.classList.add("wrong");
        }
    });

    showNextButton();
}

/** Handle timeout — no answer given */
function handleTimeout() {
    if (answered) return;
    answered = true;
    stopTimer();

    userAnswers.push(-1); // -1 = timeout

    const q = quizQuestions[currentQuestionIndex];
    const buttons = document.querySelectorAll("#options-container .option-btn");

    buttons.forEach((btn, i) => {
        btn.disabled = true;
        if (i === q.correct) {
            btn.classList.add("correct");
        }
    });

    // Show timeout message
    document.getElementById("timeout-msg").classList.remove("d-none");

    showNextButton();
}

/** Show the next / results button */
function showNextButton() {
    const btnNext = document.getElementById("btn-next");
    btnNext.classList.remove("d-none");

    if (currentQuestionIndex >= quizQuestions.length - 1) {
        btnNext.innerHTML = 'Ver Resultados <i class="bi bi-trophy ms-1"></i>';
    } else {
        btnNext.innerHTML = 'Próxima <i class="bi bi-arrow-right ms-1"></i>';
    }
}

/** Advance to next question with slide animation */
function nextQuestion() {
    const card = document.getElementById("question-card-inner");

    // Slide out
    card.classList.remove("slide-in-right");
    card.classList.add("slide-out-left");

    // After animation, render next
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex >= quizQuestions.length) {
            showResults();
        } else {
            renderQuestion();
        }
    }, 280);
}

// =========================================================
// 9. TIMER (15s countdown per question)
// =========================================================

function startTimer() {
    stopTimer();
    timerSeconds = TIMER_DURATION;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        timerSeconds--;
        updateTimerDisplay();

        if (timerSeconds <= 0) {
            stopTimer();
            handleTimeout();
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimerDisplay() {
    const circle = document.getElementById("timer-circle");
    const text = document.getElementById("timer-text");

    if (!circle || !text) return;

    text.textContent = timerSeconds;

    // Calculate stroke offset (full circle = TIMER_CIRCUMFERENCE)
    const fraction = timerSeconds / TIMER_DURATION;
    const offset = TIMER_CIRCUMFERENCE * (1 - fraction);
    circle.style.strokeDashoffset = offset;

    // Color change based on remaining time
    circle.classList.remove("warning", "danger");
    if (timerSeconds <= 5) {
        circle.classList.add("danger");
    } else if (timerSeconds <= 10) {
        circle.classList.add("warning");
    }
}

// =========================================================
// 10. RESULTS SCREEN
// =========================================================

function showResults() {
    stopTimer();

    const total = quizQuestions.length;
    const percentage = (correctAnswers / total) * 100;
    const elapsed = Math.round((Date.now() - quizStartTime) / 1000);

    document.getElementById("quiz-question").classList.add("d-none");
    document.getElementById("quiz-results").classList.remove("d-none");

    // Fill stats
    document.getElementById("res-total").textContent = total;
    document.getElementById("res-correct").textContent = correctAnswers;
    document.getElementById("res-percentage").textContent = percentage.toFixed(1) + "%";
    document.getElementById("res-time").textContent = formatTime(elapsed);
    document.getElementById("quiz-progress").style.width = "100%";

    // Build per-question details for history
    const details = quizQuestions.map((q, i) => ({
        text: q.text,
        options: q.options,
        correct: q.correct,
        userAnswer: userAnswers[i]  // -1 = timeout, 0-3 = chosen option
    }));

    // Save to history
    saveToHistory({
        date: new Date().toISOString(),
        total,
        correct: correctAnswers,
        percentage: parseFloat(percentage.toFixed(1)),
        timeSpent: elapsed,
        details
    });

    // Message and icon
    const iconEl = document.getElementById("results-icon");
    const msgEl = document.getElementById("res-message");

    if (percentage >= 75) {
        iconEl.textContent = "🎉";
        msgEl.textContent = "Fantástico! Parabéns pelo excelente resultado!";
        msgEl.className = "fs-5 mb-4 text-success";
        launchConfetti();
    } else if (percentage >= 50) {
        iconEl.textContent = "👍";
        msgEl.textContent = "Bom trabalho! Podes melhorar ainda mais.";
        msgEl.className = "fs-5 mb-4";
    } else {
        iconEl.textContent = "💪";
        msgEl.textContent = "Continua a praticar, vais conseguir!";
        msgEl.className = "fs-5 mb-4 text-warning";
    }

    // Reset review
    document.getElementById("review-container").classList.add("d-none");
    document.getElementById("btn-toggle-review").innerHTML =
        '<i class="bi bi-eye me-1"></i>Ver Revisão de Respostas';

    // Render review
    renderReview();

    // Trigger fade-in
    const card = document.querySelector(".results-card");
    card.classList.remove("fade-in");
    void card.offsetWidth;
    card.classList.add("fade-in");
}

function formatTime(seconds) {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
}

function restartQuiz() {
    stopConfetti();
    stopTimer();
    resetQuizView();
}

// =========================================================
// 11. ANSWER REVIEW
// =========================================================

function toggleReview() {
    const container = document.getElementById("review-container");
    const btn = document.getElementById("btn-toggle-review");

    if (container.classList.contains("d-none")) {
        container.classList.remove("d-none");
        btn.innerHTML = '<i class="bi bi-eye-slash me-1"></i>Esconder Revisão';
    } else {
        container.classList.add("d-none");
        btn.innerHTML = '<i class="bi bi-eye me-1"></i>Ver Revisão de Respostas';
    }
}

function renderReview() {
    const container = document.getElementById("review-list");
    const letters = ["A", "B", "C", "D"];

    container.innerHTML = quizQuestions.map((q, i) => {
        const userAns = userAnswers[i];
        const isTimeout = userAns === -1;
        const isCorrect = userAns === q.correct;

        let statusClass, icon;
        if (isTimeout) {
            statusClass = "review-timeout";
            icon = '<i class="bi bi-alarm text-warning review-icon"></i>';
        } else if (isCorrect) {
            statusClass = "review-correct";
            icon = '<i class="bi bi-check-circle-fill text-success review-icon"></i>';
        } else {
            statusClass = "review-wrong";
            icon = '<i class="bi bi-x-circle-fill text-danger review-icon"></i>';
        }

        const userAnswer = isTimeout
            ? '<span class="text-warning">Tempo esgotado</span>'
            : `<span class="${isCorrect ? 'text-success' : 'text-danger'}">${letters[userAns]}) ${escapeHtml(q.options[userAns])}</span>`;

        const correctAnswer = `<span class="text-success">${letters[q.correct]}) ${escapeHtml(q.options[q.correct])}</span>`;

        return `
            <div class="review-item ${statusClass}">
                ${icon}
                <div class="flex-grow-1">
                    <div class="fw-600 mb-1" style="font-size:0.9rem">${i + 1}. ${escapeHtml(q.text)}</div>
                    <div class="small">
                        <span class="text-muted">Tua resposta:</span> ${userAnswer}
                        ${!isCorrect ? `<br><span class="text-muted">Resposta correta:</span> ${correctAnswer}` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

// =========================================================
// 12. HISTORY (last 10 results + bar chart)
// =========================================================

function renderHistory() {
    const history = loadHistory();
    const tbody = document.getElementById("history-tbody");
    const noMsg = document.getElementById("no-history-msg");
    const chartEl = document.getElementById("history-chart");
    const chartEmpty = document.getElementById("chart-empty");
    const table = document.getElementById("history-table");

    if (history.length === 0) {
        noMsg.classList.remove("d-none");
        table.classList.add("d-none");
        chartEl.innerHTML = '<p class="text-muted text-center py-4">Ainda não há resultados.</p>';
        return;
    }

    noMsg.classList.add("d-none");
    table.classList.remove("d-none");

    // Render table (most recent first)
    tbody.innerHTML = history.slice().reverse().map((h, idx) => {
        const realIdx = history.length - 1 - idx;
        const date = new Date(h.date);
        const dateStr = date.toLocaleDateString("pt-PT", {
            day: "2-digit", month: "2-digit", year: "numeric"
        });
        const timeStr = date.toLocaleTimeString("pt-PT", {
            hour: "2-digit", minute: "2-digit"
        });

        const pctClass = h.percentage >= 75 ? "text-success" :
            h.percentage >= 50 ? "" : "text-warning";

        // Build detail row content
        let detailHtml = '';
        if (h.details && h.details.length > 0) {
            const letters = ["A", "B", "C", "D"];
            detailHtml = h.details.map((d, qi) => {
                const isTimeout = d.userAnswer === -1;
                const isCorrect = d.userAnswer === d.correct;
                let statusIcon, statusClass;
                if (isTimeout) {
                    statusIcon = '⏰';
                    statusClass = 'text-warning';
                } else if (isCorrect) {
                    statusIcon = '✅';
                    statusClass = 'text-success';
                } else {
                    statusIcon = '❌';
                    statusClass = 'text-danger';
                }

                let answerLine = '';
                if (isTimeout) {
                    answerLine = `<span class="text-warning">Tempo esgotado</span>`;
                } else {
                    answerLine = `<span class="${isCorrect ? 'text-success' : 'text-danger'}">${letters[d.userAnswer]}) ${escapeHtml(d.options[d.userAnswer])}</span>`;
                }

                let correctLine = '';
                if (!isCorrect) {
                    correctLine = `<br><small class="text-success"><i class="bi bi-check-circle me-1"></i>Correta: ${letters[d.correct]}) ${escapeHtml(d.options[d.correct])}</small>`;
                }

                return `
                    <div class="history-detail-item">
                        <span class="me-2">${statusIcon}</span>
                        <div>
                            <strong>${qi + 1}. ${escapeHtml(d.text)}</strong><br>
                            <small>${answerLine}${correctLine}</small>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            detailHtml = '<p class="text-muted small mb-0">Sem detalhes disponíveis para este quiz.</p>';
        }

        const hasDetails = h.details && h.details.length > 0;
        const detailBtnHtml = hasDetails
            ? `<button type="button" class="btn btn-sm btn-outline-accent" onclick="toggleHistoryDetail('hd-${realIdx}', this)" title="Ver detalhes"><i class="bi bi-eye"></i></button>`
            : '<span class="text-muted small">—</span>';

        return `
            <tr>
                <td class="ps-4"><span class="small">${dateStr} ${timeStr}</span></td>
                <td class="text-center">${h.total}</td>
                <td class="text-center">${h.correct}</td>
                <td class="text-center ${pctClass} fw-bold">${h.percentage}%</td>
                <td class="text-center">${formatTime(h.timeSpent)}</td>
                <td class="text-center pe-4">${detailBtnHtml}</td>
            </tr>
            <tr class="history-detail-row d-none" id="hd-${realIdx}">
                <td colspan="6" class="ps-4 pe-4 pb-3">
                    <div class="history-detail-container">
                        ${detailHtml}
                    </div>
                </td>
            </tr>
        `;
    }).join("");

    // Render bar chart
    const maxPct = 100;
    chartEl.innerHTML = history.map((h, i) => {
        const barHeight = Math.max(4, (h.percentage / maxPct) * 130);
        const date = new Date(h.date);
        const label = date.toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit" });
        const barColor = h.percentage >= 75 ? "var(--success)" :
            h.percentage >= 50 ? "var(--accent)" : "var(--danger)";

        return `
            <div class="chart-bar-wrapper">
                <span class="chart-bar-value">${h.percentage}%</span>
                <div class="chart-bar" style="height:${barHeight}px; background:${barColor};"></div>
                <span class="chart-bar-label">${label}</span>
            </div>
        `;
    }).join("");
}


/** Toggle expand/collapse of history detail row */
function toggleHistoryDetail(rowId, btn) {
    const row = document.getElementById(rowId);
    if (!row) return;
    const icon = btn.querySelector("i");
    if (row.classList.contains("d-none")) {
        row.classList.remove("d-none");
        if (icon) { icon.className = "bi bi-eye-slash"; }
    } else {
        row.classList.add("d-none");
        if (icon) { icon.className = "bi bi-eye"; }
    }
}

// =========================================================
// 13. CONFETTI ANIMATION (Canvas-based)
// =========================================================

let confettiAnimationId = null;
let confettiParticles = [];
let confettiResizeHandler = null;

function launchConfetti() {
    stopConfetti();

    const canvas = document.getElementById("confetti-canvas");
    const ctx = canvas.getContext("2d");

    canvas.style.display = "block";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    confettiResizeHandler = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", confettiResizeHandler);

    const colors = ["#6c5ce7", "#a29bfe", "#00cec9", "#ff6b6b", "#fdcb6e", "#e17055", "#55efc4", "#fd79a8"];
    confettiParticles = [];

    for (let i = 0; i < 250; i++) {
        confettiParticles.push({
            x: Math.random() * canvas.width,
            y: -(Math.random() * canvas.height * 1.5),
            w: Math.random() * 10 + 4,
            h: Math.random() * 6 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: Math.random() * 1.5 + 1,
            speedX: (Math.random() - 0.5) * 3,
            gravity: 0.04 + Math.random() * 0.04,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.03 + Math.random() * 0.05,
            wobbleAmplitude: 0.5 + Math.random() * 1.5,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 8
        });
    }

    let lastTime = performance.now();
    const duration = 6000;
    const startTime = performance.now();

    function animate(now) {
        const dt = Math.min((now - lastTime) / 16.667, 3);
        lastTime = now;
        const elapsed = now - startTime;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const fadeStart = duration - 2000;
        const globalAlpha = elapsed > fadeStart
            ? Math.max(0, 1 - (elapsed - fadeStart) / 2000)
            : 1;

        let anyVisible = false;

        confettiParticles.forEach(p => {
            p.speedY += p.gravity * dt;
            p.y += p.speedY * dt;
            p.wobble += p.wobbleSpeed * dt;
            p.x += (p.speedX + Math.sin(p.wobble) * p.wobbleAmplitude) * dt;
            p.rotation += p.rotationSpeed * dt;

            if (p.y > canvas.height + 50) return;
            anyVisible = true;

            ctx.save();
            ctx.globalAlpha = globalAlpha;
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        });

        if (elapsed < duration && anyVisible) {
            confettiAnimationId = requestAnimationFrame(animate);
        } else {
            stopConfetti();
        }
    }

    confettiAnimationId = requestAnimationFrame(animate);
}

function stopConfetti() {
    if (confettiAnimationId) {
        cancelAnimationFrame(confettiAnimationId);
        confettiAnimationId = null;
    }
    const canvas = document.getElementById("confetti-canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiParticles = [];
    canvas.style.display = "none";

    if (confettiResizeHandler) {
        window.removeEventListener("resize", confettiResizeHandler);
        confettiResizeHandler = null;
    }
}

// =========================================================
// 14. BACKOFFICE — TABLE RENDERING
// =========================================================

function renderBackofficeTable() {
    const tbody = document.getElementById("questions-tbody");
    const noMsg = document.getElementById("no-questions-msg");
    const countEl = document.getElementById("bo-total-count");

    const activeCount = questions.filter(q => q.active !== false).length;
    countEl.textContent = `${questions.length} (${activeCount} ativas)`;

    if (questions.length === 0) {
        tbody.innerHTML = "";
        noMsg.classList.remove("d-none");
        document.getElementById("questions-table").classList.add("d-none");
        return;
    }

    noMsg.classList.add("d-none");
    document.getElementById("questions-table").classList.remove("d-none");

    const letters = ["A", "B", "C", "D"];

    tbody.innerHTML = questions.map((q, i) => {
        const isActive = q.active !== false;
        const rowClass = isActive ? "" : "row-inactive";
        const toggleIcon = isActive
            ? '<i class="bi bi-toggle-on text-success"></i>'
            : '<i class="bi bi-toggle-off text-muted"></i>';
        const toggleTitle = isActive ? "Desativar" : "Ativar";

        return `
        <tr class="${rowClass}">
            <td class="ps-4 text-muted">${i + 1}</td>
            <td>
                <strong>${escapeHtml(q.text)}</strong>
                <div class="small text-muted mt-1">
                    ${q.options.map((o, j) =>
            `<span class="${j === q.correct ? 'text-success fw-bold' : ''}">${letters[j]}) ${escapeHtml(o)}</span>`
        ).join(" &nbsp;·&nbsp; ")}
                </div>
            </td>
            <td class="text-center">
                <span class="badge badge-category">${escapeHtml(q.category || 'Geral')}</span>
            </td>
            <td class="text-center">
                <span class="badge bg-accent-soft">${letters[q.correct]}</span>
            </td>
            <td class="text-end pe-4">
                <button type="button" class="btn-toggle-active me-1" onclick="toggleQuestionActive(${i})" title="${toggleTitle}">
                    ${toggleIcon}
                </button>
                <button type="button" class="btn btn-sm btn-outline-accent me-1" onclick="editQuestion(${i})" title="Editar">
                    <i class="bi bi-pencil"></i>
                </button>
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="deleteQuestion(${i})" title="Apagar">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
        `;
    }).join("");

    // Populate category datalist for form autocomplete
    const datalist = document.getElementById("category-list");
    if (datalist) {
        datalist.innerHTML = getCategories().map(c => `<option value="${escapeHtml(c)}">`).join("");
    }
}

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

// =========================================================
// 15. BACKOFFICE — CREATE / EDIT / DELETE
// =========================================================

function openCreateForm() {
    document.getElementById("form-title").innerHTML =
        '<i class="bi bi-plus-circle me-2"></i>Nova Pergunta';
    document.getElementById("edit-index").value = -1;
    document.getElementById("question-form").reset();
    document.getElementById("q-category").value = "";
    document.getElementById("question-form-container").classList.remove("d-none");
    document.getElementById("question-form-container").scrollIntoView({ behavior: "smooth" });
}

function editQuestion(index) {
    const q = questions[index];
    document.getElementById("form-title").innerHTML =
        '<i class="bi bi-pencil me-2"></i>Editar Pergunta';
    document.getElementById("edit-index").value = index;
    document.getElementById("q-text").value = q.text;
    document.getElementById("q-category").value = q.category || "Geral";

    for (let i = 0; i < 4; i++) {
        document.getElementById(`q-opt-${i}`).value = q.options[i];
    }

    const radios = document.querySelectorAll('input[name="correct"]');
    radios.forEach((r, i) => {
        r.checked = i === q.correct;
    });

    document.getElementById("question-form-container").classList.remove("d-none");
    document.getElementById("question-form-container").scrollIntoView({ behavior: "smooth" });
}

function saveQuestion(event) {
    event.preventDefault();

    const text = document.getElementById("q-text").value.trim();
    const options = [];
    for (let i = 0; i < 4; i++) {
        const val = document.getElementById(`q-opt-${i}`).value.trim();
        if (!val) {
            alert("Todas as opções devem ser preenchidas!");
            return;
        }
        options.push(val);
    }

    if (!text) {
        alert("O enunciado da pergunta não pode estar vazio!");
        return;
    }

    const selectedRadio = document.querySelector('input[name="correct"]:checked');
    if (!selectedRadio) {
        alert("Seleciona qual é a opção correta!");
        return;
    }
    const correct = parseInt(selectedRadio.value);
    const category = (document.getElementById("q-category").value || "").trim() || "Geral";

    const editIndex = parseInt(document.getElementById("edit-index").value);

    if (editIndex >= 0) {
        // Preserve existing active state when editing
        const existingActive = questions[editIndex].active !== false;
        questions[editIndex] = { text, options, correct, category, active: existingActive };
    } else {
        questions.push({ text, options, correct, category, active: true });
    }

    saveQuestionsToLocalStorage(questions);
    renderBackofficeTable();
    cancelForm();
}

let pendingDeleteIndex = -1;

function deleteQuestion(index) {
    pendingDeleteIndex = index;
    const q = questions[index];
    document.getElementById("delete-question-text").textContent = `"${q.text}"`;
    const modal = new bootstrap.Modal(document.getElementById("deleteModal"));
    modal.show();
}

/** Toggle question active/inactive state */
function toggleQuestionActive(index) {
    questions[index].active = !questions[index].active;
    saveQuestionsToLocalStorage(questions);
    renderBackofficeTable();
}

function cancelForm() {
    document.getElementById("question-form-container").classList.add("d-none");
    document.getElementById("question-form").reset();
    document.getElementById("edit-index").value = -1;
}

// =========================================================
// 16. IMPORT / EXPORT JSON
// =========================================================

function showImportExport() {
    document.getElementById("import-export-panel").classList.remove("d-none");
    document.getElementById("import-export-panel").scrollIntoView({ behavior: "smooth" });
}

function hideImportExport() {
    document.getElementById("import-export-panel").classList.add("d-none");
    document.getElementById("json-textarea").value = "";
}

function exportQuestions() {
    const json = JSON.stringify(questions, null, 2);
    document.getElementById("json-textarea").value = json;
}

function importQuestions() {
    const raw = document.getElementById("json-textarea").value.trim();

    if (!raw) {
        alert("Cola o JSON das perguntas na área de texto antes de importar.");
        return;
    }

    try {
        const parsed = JSON.parse(raw);

        if (!Array.isArray(parsed)) {
            throw new Error("O JSON deve ser um array de perguntas.");
        }

        for (let i = 0; i < parsed.length; i++) {
            const q = parsed[i];
            if (!q.text || !Array.isArray(q.options) || q.options.length !== 4 || typeof q.correct !== "number") {
                throw new Error(`Pergunta ${i + 1} tem formato inválido.`);
            }
            if (q.correct < 0 || q.correct > 3) {
                throw new Error(`Pergunta ${i + 1}: índice da resposta correta deve ser entre 0 e 3.`);
            }
        }

        questions = parsed;
        saveQuestionsToLocalStorage(questions);
        renderBackofficeTable();
        hideImportExport();
        alert(`${parsed.length} perguntas importadas com sucesso!`);

    } catch (e) {
        alert("Erro ao importar JSON:\n" + e.message);
    }
}
