/* =========================================================
   QUIZ MASTER — Features Part 2
   Results, History, Leaderboard, Backoffice, API Import
   ========================================================= */

// =========================================================
// 12. RESULTS
// =========================================================
function showResults() {
    stopTimer();
    stopGlobalTimer();
    window.speechSynthesis?.cancel();

    const total = quizQuestions.length;
    const elapsed = Math.round((Date.now() - quizStartTime) / 1000);

    document.getElementById("quiz-question").classList.add("d-none");

    if (gameMode === "duel") {
        showDuelResults(elapsed);
        return;
    }

    // Fill in any unanswered questions for time attack
    while (userAnswers.length < total) userAnswers.push(-1);

    const percentage = (correctAnswers / total) * 100;

    // Time attack bonus
    if (gameMode === "timeattack" && globalTimerSeconds > 0) {
        totalPoints += globalTimerSeconds * 10;
    }

    document.getElementById("quiz-results").classList.remove("d-none");
    document.getElementById("duel-results").classList.add("d-none");

    document.getElementById("res-total").textContent = total;
    document.getElementById("res-correct").textContent = correctAnswers;
    document.getElementById("res-percentage").textContent = percentage.toFixed(1) + "%";
    document.getElementById("res-time").textContent = formatTime(elapsed);
    document.getElementById("res-points").textContent = totalPoints;
    document.getElementById("quiz-progress").style.width = "100%";

    // Personal best check
    const history = loadHistory();
    const bestPct = history.reduce((max, h) => Math.max(max, h.percentage || 0), 0);
    const pbBanner = document.getElementById("personal-best-banner");
    if (percentage > bestPct && history.length > 0) {
        pbBanner.classList.add("show");
    } else {
        pbBanner.classList.remove("show");
    }

    // Build details
    const details = quizQuestions.map((q, i) => ({
        text: q.text, options: q.options, correct: q.correct,
        userAnswer: userAnswers[i], category: q.category, difficulty: q.difficulty
    }));

    const modeLabel = gameMode === "timeattack" ? "Contra o Relógio" : "Solo";

    saveToHistory({ date: new Date().toISOString(), total, correct: correctAnswers, percentage: parseFloat(percentage.toFixed(1)), timeSpent: elapsed, points: totalPoints, mode: modeLabel, details });
    saveToLeaderboard({ name: playerName, points: totalPoints, percentage: parseFloat(percentage.toFixed(1)), mode: modeLabel, date: new Date().toISOString() });

    // Message
    const iconEl = document.getElementById("results-icon");
    const msgEl = document.getElementById("res-message");
    if (percentage >= 75) {
        playSound('combo');
        iconEl.textContent = "🎉"; msgEl.textContent = "Fantástico! Parabéns pelo excelente resultado!"; msgEl.className = "fs-5 mb-4 text-success"; launchConfetti();
    } else if (percentage >= 50) {
        playSound('correct');
        iconEl.textContent = "👍"; msgEl.textContent = "Bom trabalho! Podes melhorar ainda mais."; msgEl.className = "fs-5 mb-4";
    } else {
        playSound('wrong');
        iconEl.textContent = "💪"; msgEl.textContent = "Continua a praticar, vais conseguir!"; msgEl.className = "fs-5 mb-4 text-warning";
    }

    speakText(`Fim do quiz. Acertaste ${correctAnswers} em ${total} perguntas. A tua pontuação é de ${totalPoints} pontos. ${msgEl.textContent}`);

    document.getElementById("review-container").classList.add("d-none");
    document.getElementById("btn-toggle-review").innerHTML = '<i class="bi bi-eye me-1"></i>Ver Revisão de Respostas';
    renderReview();

    const card = document.querySelector("#quiz-results .results-card");
    card.classList.remove("fade-in"); void card.offsetWidth; card.classList.add("fade-in");
}

function showDuelResults(elapsed) {
    window.speechSynthesis?.cancel();
    document.getElementById("duel-results").classList.remove("d-none");
    document.getElementById("quiz-results").classList.add("d-none");

    const p1 = duelPlayers.p1, p2 = duelPlayers.p2;
    const total = quizQuestions.length;

    document.getElementById("duel-p1-name").textContent = p1.name;
    document.getElementById("duel-p2-name").textContent = p2.name;
    document.getElementById("duel-p1-score").textContent = p1.points;
    document.getElementById("duel-p2-score").textContent = p2.points;
    document.getElementById("duel-p1-detail").textContent = `${p1.correct}/${total} corretas • ${p1.points} pts`;
    document.getElementById("duel-p2-detail").textContent = `${p2.correct}/${total} corretas • ${p2.points} pts`;

    const p1Card = document.getElementById("duel-p1-card");
    const p2Card = document.getElementById("duel-p2-card");
    p1Card.classList.remove("winner"); p2Card.classList.remove("winner");

    const msgEl = document.getElementById("duel-result-message");
    if (p1.points > p2.points) {
        p1Card.classList.add("winner"); msgEl.textContent = `🏆 ${p1.name} venceu o duelo!`; msgEl.className = "fs-5 mb-4 text-success";
    } else if (p2.points > p1.points) {
        p2Card.classList.add("winner"); msgEl.textContent = `🏆 ${p2.name} venceu o duelo!`; msgEl.className = "fs-5 mb-4 text-success";
    } else {
        msgEl.textContent = "🤝 Empate! Que batalha renhida!"; msgEl.className = "fs-5 mb-4";
    }

    const p1ScoreTxt = `${p1.name} conseguiu ${p1.correct} certas com ${p1.points} pontos.`;
    const p2ScoreTxt = `${p2.name} conseguiu ${p2.correct} certas com ${p2.points} pontos.`;
    speakText(`Fim do duelo. ${p1ScoreTxt} ${p2ScoreTxt} ${msgEl.textContent}`);

    if (Math.max(p1.correct, p2.correct) / total >= 0.75) {
        playSound('combo');
        launchConfetti();
    } else {
        playSound('correct');
    }

    // Save to history
    const details = quizQuestions.map((q, i) => ({
        text: q.text, options: q.options, correct: q.correct,
        p1Answer: p1.answers[i] !== undefined ? p1.answers[i] : -1,
        p2Answer: p2.answers[i] !== undefined ? p2.answers[i] : -1,
        category: q.category, difficulty: q.difficulty
    }));

    saveToHistory({ date: new Date().toISOString(), total, correct: p1.correct + p2.correct, percentage: parseFloat((((p1.correct + p2.correct) / (total * 2)) * 100).toFixed(1)), timeSpent: elapsed, points: p1.points + p2.points, mode: "Duelo", details, duel: { p1: { name: p1.name, correct: p1.correct, points: p1.points }, p2: { name: p2.name, correct: p2.correct, points: p2.points } } });

    // Duel review
    renderDuelReview();

    const card = document.querySelector("#duel-results .results-card");
    card.classList.remove("fade-in"); void card.offsetWidth; card.classList.add("fade-in");
}

function formatTime(seconds) {
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

function restartQuiz() { playSound("click"); stopConfetti(); stopTimer(); stopGlobalTimer(); resetQuizView(); }

// =========================================================
// 13. REVIEW
// =========================================================
function toggleReview() {
    // Handle both solo and duel review containers
    const containers = [document.getElementById("review-container"), document.getElementById("review-container-duel")];
    const btns = [document.getElementById("btn-toggle-review"), document.getElementById("btn-toggle-review-duel")];

    containers.forEach((container, idx) => {
        if (!container) return;
        const btn = btns[idx];
        if (container.classList.contains("d-none")) {
            container.classList.remove("d-none");
            if (btn) btn.innerHTML = '<i class="bi bi-eye-slash me-1"></i>Esconder Revisão';
        } else {
            container.classList.add("d-none");
            if (btn) btn.innerHTML = '<i class="bi bi-eye me-1"></i>Ver Revisão de Respostas';
        }
    });
}

function renderReview() {
    const container = document.getElementById("review-list");
    const letters = ["A", "B", "C", "D"];
    container.innerHTML = quizQuestions.map((q, i) => {
        const userAns = userAnswers[i];
        const isTimeout = userAns === -1;
        const isCorrect = userAns === q.correct;
        let statusClass, icon;
        if (isTimeout) { statusClass = "review-timeout"; icon = '<i class="bi bi-alarm text-warning review-icon"></i>'; }
        else if (isCorrect) { statusClass = "review-correct"; icon = '<i class="bi bi-check-circle-fill text-success review-icon"></i>'; }
        else { statusClass = "review-wrong"; icon = '<i class="bi bi-x-circle-fill text-danger review-icon"></i>'; }
        const userAnswer = isTimeout ? '<span class="text-warning">Tempo esgotado</span>' : `<span class="${isCorrect ? 'text-success' : 'text-danger'}">${letters[userAns]}) ${escapeHtml(q.options[userAns])}</span>`;
        const correctAnswer = `<span class="text-success">${letters[q.correct]}) ${escapeHtml(q.options[q.correct])}</span>`;
        const explHtml = q.explanation ? `<br><small class="text-muted"><i class="bi bi-lightbulb me-1"></i>${escapeHtml(q.explanation)}</small>` : '';
        return `<div class="review-item ${statusClass}">${icon}<div class="flex-grow-1"><div class="fw-600 mb-1" style="font-size:0.9rem">${i + 1}. ${escapeHtml(q.text)} <span class="badge ${getDiffBadgeClass(q.difficulty || 'médio')} ms-1">${getDiffLabel(q.difficulty || 'médio')}</span></div><div class="small"><span class="text-muted">Tua resposta:</span> ${userAnswer}${!isCorrect ? `<br><span class="text-muted">Resposta correta:</span> ${correctAnswer}` : ''}${explHtml}</div></div></div>`;
    }).join("");
}

function renderDuelReview() {
    const container = document.getElementById("review-list-duel");
    if (!container) return;
    const letters = ["A", "B", "C", "D"];
    container.innerHTML = quizQuestions.map((q, i) => {
        const p1Ans = duelPlayers.p1.answers[i] !== undefined ? duelPlayers.p1.answers[i] : -1;
        const p2Ans = duelPlayers.p2.answers[i] !== undefined ? duelPlayers.p2.answers[i] : -1;
        const p1Correct = p1Ans === q.correct, p2Correct = p2Ans === q.correct;
        const p1Text = p1Ans === -1 ? '<span class="text-warning">Tempo</span>' : `<span class="${p1Correct ? 'text-success' : 'text-danger'}">${letters[p1Ans]}</span>`;
        const p2Text = p2Ans === -1 ? '<span class="text-warning">Tempo</span>' : `<span class="${p2Correct ? 'text-success' : 'text-danger'}">${letters[p2Ans]}</span>`;
        const correctAnswer = `${letters[q.correct]}) ${escapeHtml(q.options[q.correct])}`;
        return `<div class="review-item"><div class="flex-grow-1"><div class="fw-600 mb-1" style="font-size:0.9rem">${i + 1}. ${escapeHtml(q.text)}</div><div class="small"><span class="text-muted">${escapeHtml(duelPlayers.p1.name)}:</span> ${p1Text} · <span class="text-muted">${escapeHtml(duelPlayers.p2.name)}:</span> ${p2Text}<br><span class="text-muted">Correta:</span> <span class="text-success">${correctAnswer}</span></div></div></div>`;
    }).join("");
}

// =========================================================
// 14. HISTORY
// =========================================================
function renderHistory() {
    const history = loadHistory();
    const tbody = document.getElementById("history-tbody");
    const noMsg = document.getElementById("no-history-msg");
    const chartEl = document.getElementById("history-chart");
    const table = document.getElementById("history-table");

    if (history.length === 0) {
        noMsg.classList.remove("d-none"); table.classList.add("d-none");
        chartEl.innerHTML = '<p class="text-muted text-center py-4">Ainda não há resultados.</p>';
        renderCategoryStats([]);
        return;
    }

    noMsg.classList.add("d-none"); table.classList.remove("d-none");

    tbody.innerHTML = history.slice().reverse().map((h, idx) => {
        const realIdx = history.length - 1 - idx;
        const date = new Date(h.date);
        const dateStr = date.toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric" });
        const timeStr = date.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
        const pctClass = h.percentage >= 75 ? "text-success" : h.percentage >= 50 ? "" : "text-warning";

        let detailHtml = '';
        if (h.details && h.details.length > 0) {
            const letters = ["A", "B", "C", "D"];
            detailHtml = h.details.map((d, qi) => {
                const userAns = d.userAnswer !== undefined ? d.userAnswer : (d.p1Answer !== undefined ? d.p1Answer : -1);
                const isTimeout = userAns === -1;
                const isCorrect = userAns === d.correct;
                const statusIcon = isTimeout ? '⏰' : isCorrect ? '✅' : '❌';
                let answerLine = isTimeout ? '<span class="text-warning">Tempo esgotado</span>' : `<span class="${isCorrect ? 'text-success' : 'text-danger'}">${letters[userAns]}) ${escapeHtml(d.options[userAns])}</span>`;
                let correctLine = !isCorrect ? `<br><small class="text-success"><i class="bi bi-check-circle me-1"></i>Correta: ${letters[d.correct]}) ${escapeHtml(d.options[d.correct])}</small>` : '';
                return `<div class="history-detail-item"><span class="me-2">${statusIcon}</span><div><strong>${qi + 1}. ${escapeHtml(d.text)}</strong><br><small>${answerLine}${correctLine}</small></div></div>`;
            }).join('');
        } else {
            detailHtml = '<p class="text-muted small mb-0">Sem detalhes disponíveis.</p>';
        }

        const hasDetails = h.details && h.details.length > 0;
        const detailBtnHtml = hasDetails ? `<button type="button" class="btn btn-sm btn-outline-accent" onclick="toggleHistoryDetail('hd-${realIdx}', this)" title="Ver detalhes"><i class="bi bi-eye"></i></button>` : '<span class="text-muted small">—</span>';

        return `<tr><td class="ps-4"><span class="small">${dateStr} ${timeStr}</span></td><td class="text-center"><span class="badge bg-accent-soft">${h.mode || 'Solo'}</span></td><td class="text-center">${h.total}</td><td class="text-center">${h.correct}</td><td class="text-center ${pctClass} fw-bold">${h.percentage}%</td><td class="text-center fw-bold">${h.points || 0}</td><td class="text-center">${formatTime(h.timeSpent)}</td><td class="text-center pe-4">${detailBtnHtml}</td></tr><tr class="history-detail-row d-none" id="hd-${realIdx}"><td colspan="8" class="ps-4 pe-4 pb-3"><div class="history-detail-container">${detailHtml}</div></td></tr>`;
    }).join("");

    // Bar chart
    chartEl.innerHTML = history.map(h => {
        const barHeight = Math.max(4, (h.percentage / 100) * 130);
        const label = new Date(h.date).toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit" });
        const barColor = h.percentage >= 75 ? "var(--success)" : h.percentage >= 50 ? "var(--accent)" : "var(--danger)";
        return `<div class="chart-bar-wrapper"><span class="chart-bar-value">${h.percentage}%</span><div class="chart-bar" style="height:${barHeight}px; background:${barColor};"></div><span class="chart-bar-label">${label}</span></div>`;
    }).join("");

    renderCategoryStats(history);
}

function renderCategoryStats(history) {
    const container = document.getElementById("category-stats");
    const emptyMsg = document.getElementById("category-stats-empty");

    const catData = {};
    history.forEach(h => {
        if (!h.details) return;
        h.details.forEach(d => {
            const cat = d.category || "Geral";
            if (!catData[cat]) catData[cat] = { correct: 0, total: 0 };
            catData[cat].total++;
            const ans = d.userAnswer !== undefined ? d.userAnswer : -1;
            if (ans === d.correct) catData[cat].correct++;
        });
    });

    const cats = Object.keys(catData).sort();
    if (cats.length === 0) {
        if (emptyMsg) emptyMsg.style.display = '';
        container.innerHTML = '<p class="text-muted text-center py-3" id="category-stats-empty">Ainda não há dados suficientes.</p>';
        return;
    }

    container.innerHTML = cats.map(cat => {
        const pct = Math.round((catData[cat].correct / catData[cat].total) * 100);
        const color = pct >= 75 ? "var(--success)" : pct >= 50 ? "var(--accent)" : "var(--danger)";
        return `<div class="cat-stat-row"><span class="cat-stat-label">${escapeHtml(cat)}</span><div class="cat-stat-bar-bg"><div class="cat-stat-bar" style="width:${pct}%;background:${color}">${pct}%</div></div><span class="cat-stat-count">${catData[cat].correct}/${catData[cat].total}</span></div>`;
    }).join("");
}

function toggleHistoryDetail(rowId, btn) {
    const row = document.getElementById(rowId);
    if (!row) return;
    const icon = btn.querySelector("i");
    if (row.classList.contains("d-none")) {
        row.classList.remove("d-none");
        if (icon) icon.className = "bi bi-eye-slash";
    } else {
        row.classList.add("d-none");
        if (icon) icon.className = "bi bi-eye";
    }
}

// =========================================================
// 15. LEADERBOARD
// =========================================================
function renderLeaderboard() {
    const lb = loadLeaderboard();
    const tbody = document.getElementById("ranking-tbody");
    const noMsg = document.getElementById("no-ranking-msg");
    const table = document.getElementById("ranking-table");

    if (lb.length === 0) {
        noMsg.classList.remove("d-none"); table.classList.add("d-none"); return;
    }
    noMsg.classList.add("d-none"); table.classList.remove("d-none");

    tbody.innerHTML = lb.map((entry, i) => {
        const rankClass = i === 0 ? "gold" : i === 1 ? "silver" : i === 2 ? "bronze" : "";
        const rankIcon = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`;
        const dateStr = new Date(entry.date).toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric" });
        return `<tr><td class="ps-4 text-center"><span class="leaderboard-rank ${rankClass}">${rankIcon}</span></td><td class="leaderboard-name">${escapeHtml(entry.name)}</td><td class="text-center leaderboard-score">${entry.points}</td><td class="text-center">${entry.percentage}%</td><td class="text-center"><span class="badge bg-accent-soft">${entry.mode || 'Solo'}</span></td><td class="text-center pe-4">${dateStr}</td></tr>`;
    }).join("");
}

// =========================================================
// 16. CONFETTI
// =========================================================
let confettiAnimationId = null, confettiParticles = [], confettiResizeHandler = null;

function launchConfetti() {
    stopConfetti();
    const canvas = document.getElementById("confetti-canvas");
    const ctx = canvas.getContext("2d");
    canvas.style.display = "block";
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    confettiResizeHandler = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", confettiResizeHandler);
    const colors = ["#6c5ce7", "#a29bfe", "#00cec9", "#ff6b6b", "#fdcb6e", "#e17055", "#55efc4", "#fd79a8"];
    confettiParticles = [];
    for (let i = 0; i < 250; i++) {
        confettiParticles.push({ x: Math.random() * canvas.width, y: -(Math.random() * canvas.height * 1.5), w: Math.random() * 10 + 4, h: Math.random() * 6 + 2, color: colors[Math.floor(Math.random() * colors.length)], speedY: Math.random() * 1.5 + 1, speedX: (Math.random() - 0.5) * 3, gravity: 0.04 + Math.random() * 0.04, wobble: Math.random() * Math.PI * 2, wobbleSpeed: 0.03 + Math.random() * 0.05, wobbleAmplitude: 0.5 + Math.random() * 1.5, rotation: Math.random() * 360, rotationSpeed: (Math.random() - 0.5) * 8 });
    }
    let lastTime = performance.now();
    const duration = 6000, startTime = performance.now();
    function animate(now) {
        const dt = Math.min((now - lastTime) / 16.667, 3); lastTime = now;
        const elapsed = now - startTime;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const globalAlpha = elapsed > duration - 2000 ? Math.max(0, 1 - (elapsed - (duration - 2000)) / 2000) : 1;
        let anyVisible = false;
        confettiParticles.forEach(p => {
            p.speedY += p.gravity * dt; p.y += p.speedY * dt; p.wobble += p.wobbleSpeed * dt;
            p.x += (p.speedX + Math.sin(p.wobble) * p.wobbleAmplitude) * dt; p.rotation += p.rotationSpeed * dt;
            if (p.y > canvas.height + 50) return; anyVisible = true;
            ctx.save(); ctx.globalAlpha = globalAlpha; ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180); ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
        });
        if (elapsed < duration && anyVisible) confettiAnimationId = requestAnimationFrame(animate);
        else stopConfetti();
    }
    confettiAnimationId = requestAnimationFrame(animate);
}

function stopConfetti() {
    if (confettiAnimationId) { cancelAnimationFrame(confettiAnimationId); confettiAnimationId = null; }
    const canvas = document.getElementById("confetti-canvas");
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    confettiParticles = []; canvas.style.display = "none";
    if (confettiResizeHandler) { window.removeEventListener("resize", confettiResizeHandler); confettiResizeHandler = null; }
}

// =========================================================
// 17. BACKOFFICE
// =========================================================
function renderBackofficeTable() {
    const tbody = document.getElementById("questions-tbody");
    const noMsg = document.getElementById("no-questions-msg");
    const countEl = document.getElementById("bo-total-count");
    const activeCount = questions.filter(q => q.active !== false).length;
    countEl.textContent = `${questions.length} (${activeCount} ativas)`;

    if (questions.length === 0) {
        tbody.innerHTML = ""; noMsg.classList.remove("d-none");
        document.getElementById("questions-table").classList.add("d-none"); return;
    }
    noMsg.classList.add("d-none"); document.getElementById("questions-table").classList.remove("d-none");
    const letters = ["A", "B", "C", "D"];
    tbody.innerHTML = questions.map((q, i) => {
        const isActive = q.active !== false;
        const rowClass = isActive ? "" : "row-inactive";
        const toggleIcon = isActive ? '<i class="bi bi-toggle-on text-success"></i>' : '<i class="bi bi-toggle-off text-muted"></i>';
        const diffBadge = `<span class="badge ${getDiffBadgeClass(q.difficulty || 'médio')}">${getDiffLabel(q.difficulty || 'médio')}</span>`;
        return `<tr class="${rowClass}"><td class="ps-4 text-muted">${i + 1}</td><td><strong>${escapeHtml(q.text)}</strong><div class="small text-muted mt-1">${q.options.map((o, j) => `<span class="${j === q.correct ? 'text-success fw-bold' : ''}">${letters[j]}) ${escapeHtml(o)}</span>`).join(" &nbsp;·&nbsp; ")}${q.explanation ? `<br><i class="bi bi-lightbulb text-warning me-1"></i><em>${escapeHtml(q.explanation.substring(0, 60))}${q.explanation.length > 60 ? '...' : ''}</em>` : ''}</div></td><td class="text-center"><span class="badge badge-category">${escapeHtml(q.category || 'Geral')}</span></td><td class="text-center">${diffBadge}</td><td class="text-center"><span class="badge bg-accent-soft">${letters[q.correct]}</span></td><td class="text-end pe-4"><button type="button" class="btn-toggle-active me-1" onclick="toggleQuestionActive(${i})" title="${isActive ? 'Desativar' : 'Ativar'}">${toggleIcon}</button><button type="button" class="btn btn-sm btn-outline-accent me-1" onclick="editQuestion(${i})" title="Editar"><i class="bi bi-pencil"></i></button><button type="button" class="btn btn-sm btn-outline-danger" onclick="deleteQuestion(${i})" title="Apagar"><i class="bi bi-trash"></i></button></td></tr>`;
    }).join("");

    const datalist = document.getElementById("category-list");
    if (datalist) datalist.innerHTML = getCategories().map(c => `<option value="${escapeHtml(c)}">`).join("");
}

function escapeHtml(str) {
    const div = document.createElement("div"); div.textContent = str; return div.innerHTML;
}

// =========================================================
// 18. BACKOFFICE CRUD
// =========================================================
function openCreateForm() {
    document.getElementById("form-title").innerHTML = '<i class="bi bi-plus-circle me-2"></i>Nova Pergunta';
    document.getElementById("edit-index").value = -1;
    document.getElementById("question-form").reset();
    document.getElementById("q-category").value = "";
    document.getElementById("q-difficulty").value = "médio";
    document.getElementById("q-explanation").value = "";
    document.getElementById("q-active").checked = true;
    document.getElementById("question-form-container").classList.remove("d-none");
    document.getElementById("question-form-container").scrollIntoView({ behavior: "smooth" });
}

function editQuestion(index) {
    const q = questions[index];
    document.getElementById("form-title").innerHTML = '<i class="bi bi-pencil me-2"></i>Editar Pergunta';
    document.getElementById("edit-index").value = index;
    document.getElementById("q-text").value = q.text;
    document.getElementById("q-category").value = q.category || "Geral";
    document.getElementById("q-difficulty").value = q.difficulty || "médio";
    document.getElementById("q-explanation").value = q.explanation || "";
    document.getElementById("q-active").checked = q.active !== false;
    for (let i = 0; i < 4; i++) document.getElementById(`q-opt-${i}`).value = q.options[i];
    document.querySelectorAll('input[name="correct"]').forEach((r, i) => { r.checked = i === q.correct; });
    document.getElementById("question-form-container").classList.remove("d-none");
    document.getElementById("question-form-container").scrollIntoView({ behavior: "smooth" });
}

function saveQuestion(event) {
    event.preventDefault();
    const text = document.getElementById("q-text").value.trim();
    const options = [];
    for (let i = 0; i < 4; i++) { const val = document.getElementById(`q-opt-${i}`).value.trim(); if (!val) { alert("Todas as opções devem ser preenchidas!"); return; } options.push(val); }
    if (!text) { alert("O enunciado não pode estar vazio!"); return; }
    const selectedRadio = document.querySelector('input[name="correct"]:checked');
    if (!selectedRadio) { alert("Seleciona a opção correta!"); return; }
    const correct = parseInt(selectedRadio.value);
    const category = (document.getElementById("q-category").value || "").trim() || "Geral";
    const difficulty = document.getElementById("q-difficulty").value || "médio";
    const explanation = (document.getElementById("q-explanation").value || "").trim();
    const active = document.getElementById("q-active").checked;
    const editIndex = parseInt(document.getElementById("edit-index").value);
    if (editIndex >= 0) {
        questions[editIndex] = { text, options, correct, category, difficulty, explanation, active };
    } else {
        questions.push({ text, options, correct, category, difficulty, explanation, active });
    }
    saveQuestionsToLocalStorage(questions); renderBackofficeTable(); cancelForm();
}

let pendingDeleteIndex = -1;
function deleteQuestion(index) {
    pendingDeleteIndex = index;
    document.getElementById("delete-question-text").textContent = `"${questions[index].text}"`;
    new bootstrap.Modal(document.getElementById("deleteModal")).show();
}
function toggleQuestionActive(index) { questions[index].active = !questions[index].active; saveQuestionsToLocalStorage(questions); renderBackofficeTable(); }
function cancelForm() { document.getElementById("question-form-container").classList.add("d-none"); document.getElementById("question-form").reset(); document.getElementById("edit-index").value = -1; }

// =========================================================
// 19. IMPORT / EXPORT
// =========================================================
function showImportExport() { document.getElementById("import-export-panel").classList.remove("d-none"); document.getElementById("import-export-panel").scrollIntoView({ behavior: "smooth" }); }
function hideImportExport() { document.getElementById("import-export-panel").classList.add("d-none"); document.getElementById("json-textarea").value = ""; }
function exportQuestions() { document.getElementById("json-textarea").value = JSON.stringify(questions, null, 2); }

function importQuestions() {
    const raw = document.getElementById("json-textarea").value.trim();
    if (!raw) { alert("Cola o JSON antes de importar."); return; }
    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) throw new Error("O JSON deve ser um array.");
        for (let i = 0; i < parsed.length; i++) {
            const q = parsed[i];
            if (!q.text || !Array.isArray(q.options) || q.options.length !== 4 || typeof q.correct !== "number") throw new Error(`Pergunta ${i + 1} tem formato inválido.`);
            if (q.correct < 0 || q.correct > 3) throw new Error(`Pergunta ${i + 1}: índice da resposta correta deve ser entre 0 e 3.`);
        }
        questions = parsed.map(q => ({ ...q, category: q.category || "Geral", difficulty: q.difficulty || "médio", active: q.active !== undefined ? q.active : true, explanation: q.explanation || "" }));
        saveQuestionsToLocalStorage(questions); renderBackofficeTable(); hideImportExport();
        alert(`${parsed.length} perguntas importadas com sucesso!`);
    } catch (e) { alert("Erro ao importar JSON:\n" + e.message); }
}

// =========================================================
// 20. OPEN TRIVIA DB API IMPORT + FREE TRANSLATION
// =========================================================
function showApiImport() {
    document.getElementById("api-import-panel").classList.remove("d-none");
    document.getElementById("api-import-panel").scrollIntoView({ behavior: "smooth" });
}
function hideApiImport() { document.getElementById("api-import-panel").classList.add("d-none"); document.getElementById("api-status").classList.add("d-none"); }

function decodeHtmlEntities(text) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
}

/**
 * Translate a single text string from English to Portuguese using MyMemory API.
 * Free, no API key required.
 */
async function translateText(text) {
    if (!text || text.trim() === "" || text === "—") return text;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|pt`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`MyMemory API erro ${response.status}`);
    const data = await response.json();
    if (data.responseStatus === 200 && data.responseData && data.responseData.translatedText) {
        return data.responseData.translatedText;
    }
    return text; // fallback to original
}

/**
 * Translate a question (text + 4 options) by joining with separator for efficiency.
 * Uses a single API call per question.
 */
async function translateQuestion(q) {
    const separator = " ||| ";
    const combined = [q.text, ...q.options].join(separator);

    try {
        const translated = await translateText(combined);
        const parts = translated.split(/\s*\|\|\|\s*/);
        if (parts.length >= 5) {
            q.text = parts[0];
            q.options = [parts[1], parts[2], parts[3], parts[4]];
        } else {
            // Separator got lost — translate individually as fallback
            q.text = await translateText(q.text);
            for (let i = 0; i < q.options.length; i++) {
                q.options[i] = await translateText(q.options[i]);
            }
        }
    } catch (e) {
        // If combined fails, try individually
        try {
            q.text = await translateText(q.text);
            for (let i = 0; i < q.options.length; i++) {
                q.options[i] = await translateText(q.options[i]);
            }
        } catch (innerErr) {
            console.warn("Tradução falhou para:", q.text, innerErr);
        }
    }
    return q;
}

async function fetchApiQuestions() {
    const amount = document.getElementById("api-amount").value;
    const category = document.getElementById("api-category").value;
    const difficulty = document.getElementById("api-difficulty").value;
    const statusEl = document.getElementById("api-status");
    const statusText = document.getElementById("api-status-text");
    const btn = document.getElementById("btn-api-fetch");

    // Translation toggle
    const translateEnabled = document.getElementById("translate-toggle").checked;

    let url = `https://opentdb.com/api.php?amount=${amount}&type=multiple`;
    if (category) url += `&category=${category}`;
    if (difficulty) url += `&difficulty=${difficulty}`;

    btn.disabled = true;
    statusEl.classList.remove("d-none");
    statusText.textContent = "A carregar perguntas...";
    statusText.className = "text-muted";

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.response_code !== 0 || !data.results || data.results.length === 0) {
            statusText.textContent = "Não foram encontradas perguntas. Tenta outros filtros.";
            statusText.className = "text-warning";
            btn.disabled = false;
            return;
        }

        const diffMap = { easy: "fácil", medium: "médio", hard: "difícil" };
        const catMap = { "General Knowledge": "Conhecimento Geral", "Science & Nature": "Ciência", "Science: Computers": "Computadores", "Sports": "Desporto", "Geography": "Geografia", "History": "História", "Art": "Arte", "Celebrities": "Celebridades", "Animals": "Animais", "Entertainment: Film": "Cinema", "Entertainment: Music": "Música", "Entertainment: Television": "Televisão", "Entertainment: Video Games": "Videojogos", "Entertainment: Books": "Livros", "Entertainment: Board Games": "Jogos de Tabuleiro", "Mythology": "Mitologia", "Politics": "Política", "Vehicles": "Veículos", "Science: Mathematics": "Matemática", "Science: Gadgets": "Tecnologia" };

        // Build raw questions
        const newQuestions = data.results.map(r => {
            const allOptions = [...r.incorrect_answers.map(a => decodeHtmlEntities(a))];
            const correctAnswer = decodeHtmlEntities(r.correct_answer);
            const correctIdx = Math.floor(Math.random() * 4);
            allOptions.splice(correctIdx, 0, correctAnswer);
            while (allOptions.length < 4) allOptions.push("—");
            if (allOptions.length > 4) allOptions.length = 4;
            const apiCat = decodeHtmlEntities(r.category);
            return {
                text: decodeHtmlEntities(r.question),
                options: allOptions,
                correct: correctIdx,
                category: catMap[apiCat] || apiCat,
                difficulty: diffMap[r.difficulty] || "médio",
                active: true,
                explanation: ""
            };
        });

        // Translate with MyMemory if enabled
        if (translateEnabled) {
            statusText.textContent = "A traduzir perguntas para português...";
            statusText.className = "text-info";

            let translatedCount = 0;
            let translationFailed = false;

            for (const q of newQuestions) {
                try {
                    await translateQuestion(q);
                    translatedCount++;
                    statusText.textContent = `A traduzir... (${translatedCount}/${newQuestions.length})`;
                } catch (err) {
                    console.warn("Erro ao traduzir pergunta:", err);
                    translationFailed = true;
                }
            }

            if (translationFailed) {
                statusText.textContent = `Algumas perguntas não foram traduzidas. ${translatedCount}/${newQuestions.length} traduzidas.`;
                statusText.className = "text-warning";
            }
        }

        questions = [...questions, ...newQuestions];
        saveQuestionsToLocalStorage(questions);
        renderBackofficeTable();

        if (statusText.className !== "text-warning") {
            const langNote = translateEnabled ? " (traduzidas para PT)" : " (em inglês)";
            statusText.textContent = `${newQuestions.length} perguntas importadas com sucesso!${langNote}`;
            statusText.className = "text-success";
        }
        btn.disabled = false;
    } catch (e) {
        statusText.textContent = "Erro ao contactar a API. Verifica a tua ligação.";
        statusText.className = "text-danger";
        btn.disabled = false;
    }
}


