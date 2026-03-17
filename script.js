/* =========================================================
   QUIZ MASTER — Main Application Logic (Enhanced)
   ========================================================= */

// =========================================================
// 1. DEFAULT QUESTIONS
// =========================================================
const DEFAULT_QUESTIONS = [
    // ── Geografia (12 perguntas) ──────────────────────────────
    { text: "Qual é a capital de Portugal?", options: ["Madrid", "Lisboa", "Paris", "Roma"], correct: 1, category: "Geografia", difficulty: "fácil", active: true, explanation: "Lisboa é a capital e a maior cidade de Portugal." },
    { text: "Qual é o rio mais longo de Portugal?", options: ["Douro", "Mondego", "Tejo", "Guadiana"], correct: 2, category: "Geografia", difficulty: "médio", active: true, explanation: "O Tejo é o rio mais longo da Península Ibérica com 1007 km." },
    { text: "Quantos distritos tem Portugal continental?", options: ["15", "18", "20", "22"], correct: 1, category: "Geografia", difficulty: "difícil", active: true, explanation: "Portugal continental tem 18 distritos." },
    { text: "Em que continente se situa Portugal?", options: ["América", "Ásia", "África", "Europa"], correct: 3, category: "Geografia", difficulty: "fácil", active: true, explanation: "Portugal situa-se no sudoeste da Europa." },
    { text: "Qual é o ponto mais alto de Portugal continental?", options: ["Serra do Gerês", "Serra da Estrela", "Serra de Sintra", "Serra da Arrábida"], correct: 1, category: "Geografia", difficulty: "médio", active: true, explanation: "A Serra da Estrela, com a Torre a 1993 m, é o ponto mais alto de Portugal continental." },
    { text: "Qual é a segunda maior cidade de Portugal?", options: ["Braga", "Coimbra", "Porto", "Faro"], correct: 2, category: "Geografia", difficulty: "fácil", active: true, explanation: "O Porto é a segunda maior cidade de Portugal." },
    { text: "Qual é o arquipélago português no Oceano Atlântico mais distante do continente?", options: ["Madeira", "Açores", "Berlengas", "Selvagens"], correct: 1, category: "Geografia", difficulty: "médio", active: true, explanation: "Os Açores situam-se a cerca de 1500 km da costa continental." },
    { text: "Que país faz fronteira terrestre com Portugal?", options: ["França", "Marrocos", "Espanha", "Itália"], correct: 2, category: "Geografia", difficulty: "fácil", active: true, explanation: "Espanha é o único país com fronteira terrestre com Portugal." },
    { text: "Quantas ilhas compõem o arquipélago dos Açores?", options: ["7", "9", "11", "5"], correct: 1, category: "Geografia", difficulty: "difícil", active: true, explanation: "O arquipélago dos Açores é composto por 9 ilhas." },
    { text: "Em que rio se situa a cidade do Porto?", options: ["Tejo", "Mondego", "Douro", "Guadiana"], correct: 2, category: "Geografia", difficulty: "fácil", active: true, explanation: "A cidade do Porto situa-se na margem norte do rio Douro." },
    { text: "Qual é o cabo mais a sudoeste da Europa continental?", options: ["Cabo da Roca", "Cabo de São Vicente", "Cabo Espichel", "Cabo Carvoeiro"], correct: 1, category: "Geografia", difficulty: "difícil", active: true, explanation: "O Cabo de São Vicente, no Algarve, é o ponto mais a sudoeste da Europa continental." },
    { text: "Qual é a região vinícola famosa pelo Vinho do Porto?", options: ["Alentejo", "Douro", "Dão", "Bairrada"], correct: 1, category: "Geografia", difficulty: "médio", active: true, explanation: "O Vale do Douro é a região demarcada mais antiga do mundo para produção de vinho." },

    // ── História (12 perguntas) ───────────────────────────────
    { text: "Em que ano foi a Revolução dos Cravos?", options: ["1970", "1974", "1980", "1986"], correct: 1, category: "História", difficulty: "médio", active: true, explanation: "A Revolução de 25 de Abril de 1974 pôs fim ao regime ditatorial do Estado Novo." },
    { text: "Quem foi o primeiro rei de Portugal?", options: ["D. Sancho I", "D. Afonso Henriques", "D. Dinis", "D. João I"], correct: 1, category: "História", difficulty: "fácil", active: true, explanation: "D. Afonso Henriques tornou-se o primeiro rei de Portugal em 1139." },
    { text: "Em que ano Vasco da Gama chegou à Índia?", options: ["1492", "1498", "1500", "1510"], correct: 1, category: "História", difficulty: "médio", active: true, explanation: "Vasco da Gama chegou a Calecute, na Índia, em 1498." },
    { text: "Qual foi a última dinastia a reinar em Portugal?", options: ["Avis", "Bragança", "Borgonha", "Habsburgo"], correct: 1, category: "História", difficulty: "médio", active: true, explanation: "A dinastia de Bragança reinou de 1640 até à implantação da República em 1910." },
    { text: "Em que ano foi implantada a República em Portugal?", options: ["1900", "1905", "1910", "1920"], correct: 2, category: "História", difficulty: "fácil", active: true, explanation: "A República Portuguesa foi proclamada a 5 de outubro de 1910." },
    { text: "Quem liderou o regime do Estado Novo?", options: ["Humberto Delgado", "António de Oliveira Salazar", "Marcelo Caetano", "Sidónio Pais"], correct: 1, category: "História", difficulty: "fácil", active: true, explanation: "Salazar liderou o Estado Novo de 1933 até 1968." },
    { text: "Em que ano Portugal aderiu à CEE (atual UE)?", options: ["1974", "1982", "1986", "1992"], correct: 2, category: "História", difficulty: "médio", active: true, explanation: "Portugal aderiu à Comunidade Económica Europeia a 1 de janeiro de 1986." },
    { text: "Qual tratado estabeleceu a fronteira mais antiga da Europa?", options: ["Tratado de Tordesilhas", "Tratado de Alcanizes", "Tratado de Zamora", "Tratado de Windsor"], correct: 1, category: "História", difficulty: "difícil", active: true, explanation: "O Tratado de Alcanizes (1297) fixou a fronteira entre Portugal e Castela, a mais antiga da Europa." },
    { text: "Em que século começaram os Descobrimentos Portugueses?", options: ["Século XIII", "Século XIV", "Século XV", "Século XVI"], correct: 2, category: "História", difficulty: "médio", active: true, explanation: "Os Descobrimentos começaram no século XV com a conquista de Ceuta em 1415." },
    { text: "Qual batalha garantiu a independência de Portugal em 1385?", options: ["Batalha de Ourique", "Batalha de Aljubarrota", "Batalha de São Mamede", "Batalha de Alcácer Quibir"], correct: 1, category: "História", difficulty: "difícil", active: true, explanation: "A Batalha de Aljubarrota em 1385 assegurou a independência portuguesa face a Castela." },
    { text: "Qual navegador português descobriu o Brasil?", options: ["Vasco da Gama", "Pedro Álvares Cabral", "Bartolomeu Dias", "Fernão de Magalhães"], correct: 1, category: "História", difficulty: "fácil", active: true, explanation: "Pedro Álvares Cabral chegou ao Brasil em 22 de abril de 1500." },
    { text: "Em que ano ocorreu o terramoto de Lisboa?", options: ["1700", "1723", "1755", "1780"], correct: 2, category: "História", difficulty: "médio", active: true, explanation: "O grande terramoto de Lisboa ocorreu a 1 de novembro de 1755." },

    // ── Cultura (12 perguntas) ────────────────────────────────
    { text: "Qual destes é um prato típico português?", options: ["Paella", "Bacalhau à Brás", "Risotto", "Croissant"], correct: 1, category: "Cultura", difficulty: "fácil", active: true, explanation: "O Bacalhau à Brás é um dos pratos mais emblemáticos da cozinha portuguesa." },
    { text: "Quem escreveu 'Os Lusíadas'?", options: ["Fernando Pessoa", "Eça de Queirós", "Luís de Camões", "José Saramago"], correct: 2, category: "Cultura", difficulty: "fácil", active: true, explanation: "Luís de Camões publicou Os Lusíadas em 1572." },
    { text: "Qual género musical é considerado Património Imaterial da Humanidade em Portugal?", options: ["Flamenco", "Fado", "Samba", "Tango"], correct: 1, category: "Cultura", difficulty: "fácil", active: true, explanation: "O Fado foi inscrito na lista da UNESCO em 2011." },
    { text: "Qual escritor português ganhou o Prémio Nobel da Literatura?", options: ["Fernando Pessoa", "José Saramago", "Eça de Queirós", "Sophia de Mello Breyner"], correct: 1, category: "Cultura", difficulty: "médio", active: true, explanation: "José Saramago ganhou o Nobel da Literatura em 1998." },
    { text: "Qual é a fadista portuguesa mais internacionalmente conhecida?", options: ["Mariza", "Amália Rodrigues", "Ana Moura", "Dulce Pontes"], correct: 1, category: "Cultura", difficulty: "fácil", active: true, explanation: "Amália Rodrigues é considerada a 'Rainha do Fado'." },
    { text: "Qual destes doces é típico de Portugal?", options: ["Cannoli", "Pastel de Nata", "Croissant", "Brownie"], correct: 1, category: "Cultura", difficulty: "fácil", active: true, explanation: "O Pastel de Nata, originário de Belém, é um ícone da pastelaria portuguesa." },
    { text: "Que universidade portuguesa é a mais antiga?", options: ["Universidade de Lisboa", "Universidade de Coimbra", "Universidade do Porto", "Universidade de Évora"], correct: 1, category: "Cultura", difficulty: "médio", active: true, explanation: "A Universidade de Coimbra foi fundada em 1290 e é Património Mundial da UNESCO." },
    { text: "Qual é o estilo artístico do Mosteiro dos Jerónimos?", options: ["Gótico", "Manuelino", "Barroco", "Românico"], correct: 1, category: "Cultura", difficulty: "médio", active: true, explanation: "O Mosteiro dos Jerónimos é o expoente máximo do estilo Manuelino." },
    { text: "Que monumento de Lisboa foi construído para celebrar os Descobrimentos?", options: ["Torre de Belém", "Padrão dos Descobrimentos", "Castelo de São Jorge", "Elevador de Santa Justa"], correct: 1, category: "Cultura", difficulty: "médio", active: true, explanation: "O Padrão dos Descobrimentos foi inaugurado em 1960." },
    { text: "Qual azulejo é mais representativo da arte portuguesa?", options: ["Azulejo verde", "Azulejo azul e branco", "Azulejo vermelho", "Azulejo dourado"], correct: 1, category: "Cultura", difficulty: "fácil", active: true, explanation: "Os azulejos azuis e brancos são um símbolo da cultura portuguesa desde o século XVI." },
    { text: "Quem pintou os 'Painéis de São Vicente'?", options: ["Almada Negreiros", "Nuno Gonçalves", "Josefa de Óbidos", "Grão Vasco"], correct: 1, category: "Cultura", difficulty: "difícil", active: true, explanation: "Os Painéis de São Vicente são atribuídos a Nuno Gonçalves (séc. XV)." },
    { text: "Que cidade portuguesa é famosa pela sua universidade e tradição estudantil?", options: ["Lisboa", "Porto", "Coimbra", "Braga"], correct: 2, category: "Cultura", difficulty: "fácil", active: true, explanation: "Coimbra é conhecida pela sua vida académica, com a tradição da capa e batina." },

    // ── Economia (8 perguntas) ────────────────────────────────
    { text: "Qual é a moeda utilizada em Portugal?", options: ["Escudo", "Dólar", "Euro", "Libra"], correct: 2, category: "Economia", difficulty: "fácil", active: true, explanation: "Portugal adotou o Euro em 2002." },
    { text: "Qual é a principal indústria do Algarve?", options: ["Indústria automóvel", "Turismo", "Pesca industrial", "Tecnologia"], correct: 1, category: "Economia", difficulty: "fácil", active: true, explanation: "O turismo é a principal atividade económica do Algarve." },
    { text: "Qual é o maior parceiro comercial de Portugal?", options: ["Brasil", "Reino Unido", "Espanha", "França"], correct: 2, category: "Economia", difficulty: "médio", active: true, explanation: "Espanha é o maior parceiro comercial de Portugal." },
    { text: "Qual produto português é dos mais exportados no mundo?", options: ["Azeite", "Cortiça", "Vinho do Porto", "Cerâmica"], correct: 1, category: "Economia", difficulty: "médio", active: true, explanation: "Portugal é o maior exportador mundial de cortiça, responsável por mais de 50% da produção mundial." },
    { text: "Em que ano Portugal adotou o Euro como moeda oficial?", options: ["1999", "2000", "2002", "2004"], correct: 2, category: "Economia", difficulty: "médio", active: true, explanation: "O Euro entrou em circulação em Portugal a 1 de janeiro de 2002." },
    { text: "Qual setor económico emprega mais pessoas em Portugal?", options: ["Agricultura", "Indústria", "Serviços", "Construção"], correct: 2, category: "Economia", difficulty: "difícil", active: true, explanation: "O setor dos serviços é o que mais emprega em Portugal, representando cerca de 70% do PIB." },
    { text: "Qual é a bolsa de valores portuguesa?", options: ["BOVESPA", "Euronext Lisboa", "IBEX", "FTSE"], correct: 1, category: "Economia", difficulty: "difícil", active: true, explanation: "A Euronext Lisboa é a bolsa de valores de Portugal." },
    { text: "Como se chamava a antiga moeda portuguesa antes do Euro?", options: ["Peseta", "Escudo", "Real", "Cruzeiro"], correct: 1, category: "Economia", difficulty: "fácil", active: true, explanation: "O Escudo português foi a moeda oficial até à adoção do Euro." },

    // ── Ciência (8 perguntas) ─────────────────────────────────
    { text: "Qual é a fórmula química da água?", options: ["CO2", "H2O", "NaCl", "O2"], correct: 1, category: "Ciência", difficulty: "fácil", active: true, explanation: "A água é composta por dois átomos de hidrogénio e um de oxigénio: H₂O." },
    { text: "Qual é o planeta mais próximo do Sol?", options: ["Vénus", "Mercúrio", "Marte", "Terra"], correct: 1, category: "Ciência", difficulty: "fácil", active: true, explanation: "Mercúrio é o planeta mais próximo do Sol." },
    { text: "Quantos ossos tem o corpo humano adulto?", options: ["186", "206", "226", "256"], correct: 1, category: "Ciência", difficulty: "médio", active: true, explanation: "O corpo humano adulto tem 206 ossos." },
    { text: "Qual é o elemento químico mais abundante no universo?", options: ["Oxigénio", "Carbono", "Hidrogénio", "Hélio"], correct: 2, category: "Ciência", difficulty: "médio", active: true, explanation: "O hidrogénio é o elemento mais abundante, representando cerca de 75% da matéria do universo." },
    { text: "Qual é a velocidade da luz aproximada?", options: ["150 000 km/s", "300 000 km/s", "450 000 km/s", "600 000 km/s"], correct: 1, category: "Ciência", difficulty: "médio", active: true, explanation: "A luz viaja a aproximadamente 300 000 km/s no vácuo." },
    { text: "Qual é o maior órgão do corpo humano?", options: ["Fígado", "Cérebro", "Pele", "Pulmão"], correct: 2, category: "Ciência", difficulty: "fácil", active: true, explanation: "A pele é o maior órgão do corpo humano." },
    { text: "Qual cientista formulou a Teoria da Relatividade?", options: ["Isaac Newton", "Albert Einstein", "Niels Bohr", "Galileu Galilei"], correct: 1, category: "Ciência", difficulty: "fácil", active: true, explanation: "Albert Einstein publicou a Teoria da Relatividade Especial em 1905." },
    { text: "Quantos cromossomas tem uma célula humana normal?", options: ["23", "44", "46", "48"], correct: 2, category: "Ciência", difficulty: "difícil", active: true, explanation: "Uma célula humana normal possui 46 cromossomas (23 pares)." },

    // ── Desporto (8 perguntas) ────────────────────────────────
    { text: "Quantas vezes Portugal ganhou o Campeonato Europeu de Futebol?", options: ["0", "1", "2", "3"], correct: 1, category: "Desporto", difficulty: "fácil", active: true, explanation: "Portugal venceu o Euro 2016 em França." },
    { text: "Qual é o clube português com mais títulos de campeão nacional?", options: ["FC Porto", "Sporting CP", "SL Benfica", "SC Braga"], correct: 2, category: "Desporto", difficulty: "médio", active: true, explanation: "O SL Benfica é o clube com mais campeonatos nacionais em Portugal." },
    { text: "Qual atleta português ganhou uma medalha de ouro nos Jogos Olímpicos de 2008?", options: ["Rosa Mota", "Nélson Évora", "Carlos Lopes", "Fernanda Ribeiro"], correct: 1, category: "Desporto", difficulty: "difícil", active: true, explanation: "Nélson Évora venceu o ouro no triplo salto nos Jogos de Pequim 2008." },
    { text: "Qual foi o primeiro português a ganhar a Bola de Ouro?", options: ["Luís Figo", "Cristiano Ronaldo", "Eusébio", "Rui Costa"], correct: 2, category: "Desporto", difficulty: "médio", active: true, explanation: "Eusébio venceu a Bola de Ouro em 1965." },
    { text: "Em que desporto se destacou Rosa Mota?", options: ["Natação", "Atletismo (Maratona)", "Ciclismo", "Judo"], correct: 1, category: "Desporto", difficulty: "fácil", active: true, explanation: "Rosa Mota ganhou o ouro olímpico na maratona em Seul 1988." },
    { text: "Qual seleção portuguesa venceu o primeiro troféu da Liga das Nações da UEFA?", options: ["Sub-21", "Seleção A", "Seleção feminina", "Futsal"], correct: 1, category: "Desporto", difficulty: "médio", active: true, explanation: "A seleção A de Portugal venceu a primeira edição da Liga das Nações em 2019." },
    { text: "Qual o estádio com maior capacidade em Portugal?", options: ["Estádio da Luz", "Estádio do Dragão", "Estádio José Alvalade", "Estádio de Braga"], correct: 0, category: "Desporto", difficulty: "fácil", active: true, explanation: "O Estádio da Luz, em Lisboa, tem capacidade para cerca de 65 000 espectadores." },
    { text: "Cristiano Ronaldo nasceu em que ilha?", options: ["São Miguel", "Madeira", "Terceira", "Porto Santo"], correct: 1, category: "Desporto", difficulty: "fácil", active: true, explanation: "Cristiano Ronaldo nasceu no Funchal, na ilha da Madeira." },

    // ── Tecnologia (8 perguntas) ──────────────────────────────
    { text: "O que significa HTML?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Mail Link", "Home Tool Markup Language"], correct: 0, category: "Tecnologia", difficulty: "fácil", active: true, explanation: "HTML significa HyperText Markup Language." },
    { text: "Quem é considerado o pai da World Wide Web?", options: ["Steve Jobs", "Bill Gates", "Tim Berners-Lee", "Mark Zuckerberg"], correct: 2, category: "Tecnologia", difficulty: "médio", active: true, explanation: "Tim Berners-Lee inventou a World Wide Web em 1989." },
    { text: "Qual linguagem de programação foi criada por Guido van Rossum?", options: ["Java", "C++", "Python", "Ruby"], correct: 2, category: "Tecnologia", difficulty: "médio", active: true, explanation: "Python foi criada por Guido van Rossum e lançada em 1991." },
    { text: "Qual empresa criou o sistema operativo Android?", options: ["Apple", "Microsoft", "Google", "Samsung"], correct: 2, category: "Tecnologia", difficulty: "fácil", active: true, explanation: "O Android foi desenvolvido pela Android Inc. e adquirido pela Google em 2005." },
    { text: "O que significa CPU?", options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Core Processing Unit"], correct: 0, category: "Tecnologia", difficulty: "fácil", active: true, explanation: "CPU significa Central Processing Unit (Unidade Central de Processamento)." },
    { text: "Em que ano foi fundada a empresa Apple?", options: ["1974", "1976", "1980", "1984"], correct: 1, category: "Tecnologia", difficulty: "médio", active: true, explanation: "A Apple foi fundada em 1976 por Steve Jobs, Steve Wozniak e Ronald Wayne." },
    { text: "Qual é a linguagem de programação mais usada para desenvolvimento web front-end?", options: ["Python", "Java", "JavaScript", "C#"], correct: 2, category: "Tecnologia", difficulty: "médio", active: true, explanation: "JavaScript é a linguagem essencial para desenvolvimento web no lado do cliente." },
    { text: "Quantos bits tem um byte?", options: ["4", "6", "8", "16"], correct: 2, category: "Tecnologia", difficulty: "fácil", active: true, explanation: "Um byte é composto por 8 bits." }
];

// =========================================================
// 2. LOCAL STORAGE
// =========================================================
const STORAGE_KEY = "quizmaster_questions";
const HISTORY_KEY = "quizmaster_history";
const THEME_KEY = "quizmaster_theme";
const LEADERBOARD_KEY = "quizmaster_leaderboard";

function loadQuestionsFromLocalStorage() {
    const raw = localStorage.getItem(STORAGE_KEY);
    let stored = [];
    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
                stored = parsed.map(q => ({
                    ...q,
                    category: q.category || "Geral",
                    difficulty: q.difficulty || "médio",
                    active: q.active !== undefined ? q.active : true,
                    explanation: q.explanation || ""
                }));
            }
        } catch (e) { console.warn("Erro ao ler localStorage", e); }
    }

    // Merge any new DEFAULT_QUESTIONS that aren't in stored data
    const existingTexts = new Set(stored.map(q => q.text));
    const newDefaults = DEFAULT_QUESTIONS.filter(q => !existingTexts.has(q.text));
    if (newDefaults.length > 0 || stored.length === 0) {
        const merged = stored.length > 0 ? [...stored, ...newDefaults] : [...DEFAULT_QUESTIONS];
        saveQuestionsToLocalStorage(merged);
        return merged;
    }
    return stored;
}

function getCategories() {
    return [...new Set(questions.map(q => q.category || "Geral"))].sort();
}

function getActiveQuestions(category, difficulty) {
    return questions.filter(q => {
        if (q.active === false) return false;
        if (category && category !== "__all__" && q.category !== category) return false;
        if (difficulty && difficulty !== "__all__" && q.difficulty !== difficulty) return false;
        return true;
    });
}

function saveQuestionsToLocalStorage(qs) { localStorage.setItem(STORAGE_KEY, JSON.stringify(qs)); }

function loadHistory() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch { return []; }
}

function saveToHistory(entry) {
    const history = loadHistory();
    history.push(entry);
    if (history.length > 10) history.shift();
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function loadLeaderboard() {
    try { return JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || []; } catch { return []; }
}

function saveToLeaderboard(entry) {
    const lb = loadLeaderboard();
    lb.push(entry);
    lb.sort((a, b) => b.points - a.points);
    if (lb.length > 10) lb.length = 10;
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(lb));
}

// =========================================================
// 3. THEME
// =========================================================
function loadTheme() { applyTheme(localStorage.getItem(THEME_KEY) || "dark"); }
function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const icon = document.getElementById("theme-icon");
    if (icon) icon.className = theme === "dark" ? "bi bi-moon-stars-fill" : "bi bi-sun-fill";
}
function toggleTheme() {
    const next = (document.documentElement.getAttribute("data-theme") || "dark") === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
}

// =========================================================
// 4. APPLICATION STATE
// =========================================================
const SFX_KEY = "quizmaster_sfx";
const TTS_KEY = "quizmaster_tts";
let sfxEnabled = true;
let ttsEnabled = false;
let isReading = false;

// AudioManager for SFX (using AudioContext)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    if (!sfxEnabled || !audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    const now = audioCtx.currentTime;
    
    if (type === 'correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    } else if (type === 'wrong') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(250, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    } else if (type === 'timeout') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.4);
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
    } else if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.1, now + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
    } else if (type === 'combo') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.setValueAtTime(600, now + 0.1);
        osc.frequency.setValueAtTime(800, now + 0.2);
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.2, now + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
    }
}

// TTS Functionality
function speakText(text, onStart, onEnd) {
    if (!ttsEnabled || !window.speechSynthesis) {
        if (onEnd) onEnd();
        return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-PT";
    
    utterance.onstart = () => {
        isReading = true;
        if (onStart) onStart();
    };
    
    utterance.onend = () => {
        isReading = false;
        if (onEnd) onEnd();
    };
    
    utterance.onerror = () => {
        isReading = false;
        if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
}

function loadAudioPreferences() {
    sfxEnabled = localStorage.getItem(SFX_KEY) !== "false";
    ttsEnabled = localStorage.getItem(TTS_KEY) === "true";
    updateAudioIcons();
}

function toggleSfx() {
    sfxEnabled = !sfxEnabled;
    localStorage.setItem(SFX_KEY, sfxEnabled);
    updateAudioIcons();
    if (sfxEnabled) playSound("click");
}

function toggleTts() {
    ttsEnabled = !ttsEnabled;
    localStorage.setItem(TTS_KEY, ttsEnabled);
    updateAudioIcons();
    if (ttsEnabled) {
        speakText("Leitura de voz ativada.");
        const btnRepeat = document.getElementById("btn-repeat-audio");
        if (btnRepeat && !document.getElementById("quiz-question").classList.contains("d-none")) {
            btnRepeat.classList.remove("d-none");
            repeatAudio();
        }
    } else {
        window.speechSynthesis.cancel();
        isReading = false;
        const btnRepeat = document.getElementById("btn-repeat-audio");
        if (btnRepeat) btnRepeat.classList.add("d-none");
    }
}

function updateAudioIcons() {
    const sfxIcon = document.getElementById("sfx-icon");
    if (sfxIcon) sfxIcon.className = sfxEnabled ? "bi bi-volume-up-fill" : "bi bi-volume-mute-fill";
    const ttsIcon = document.getElementById("tts-icon");
    if (ttsIcon) ttsIcon.className = ttsEnabled ? "bi bi-megaphone-fill" : "bi bi-megaphone";
}

function repeatAudio() {
    if (!ttsEnabled) return;
    const q = quizQuestions[currentQuestionIndex];
    if (!q) return;
    let textToRead = `${q.text}. `;
    const letters = ["A", "B", "C", "D"];
    q.options.forEach((opt, i) => {
        textToRead += `Opção ${letters[i]}: ${opt}. `;
    });
    speakText(textToRead);
}

let questions = [];
let quizQuestions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let answered = false;
let selectedQuizSize = 0;
let selectedCategory = "__all__";
let selectedDifficulty = "__all__";
let userAnswers = [];
let quizStartTime = 0;
let totalPoints = 0;

// Accessible Click Tracker
let accClickCount = 0;
let accClickTimeout = null;

// Game mode: 'solo', 'duel', 'timeattack'
let gameMode = "solo";
let playerName = "Jogador";

// Timer
const TIMER_DURATION = 15;
let timerInterval = null;
let timerSeconds = TIMER_DURATION;
const TIMER_CIRCUMFERENCE = 2 * Math.PI * 17;

// Streak / Combo
let currentStreak = 0;
let maxStreak = 0;
let comboMultiplier = 1;

// Duel
let duelPlayers = { p1: { name: "Jogador 1", correct: 0, points: 0, answers: [] }, p2: { name: "Jogador 2", correct: 0, points: 0, answers: [] } };
let currentDuelPlayer = 1; // 1 or 2
let duelQuestionPhase = 0; // 0 = p1 answering, 1 = p2 answering

// Time Attack
const TIME_ATTACK_DURATION = 60;
let globalTimerInterval = null;
let globalTimerSeconds = TIME_ATTACK_DURATION;

// =========================================================
// 5. INITIALIZATION
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
    loadTheme();
    loadAudioPreferences();
    questions = loadQuestionsFromLocalStorage();
    renderBackofficeTable();
    updateStartScreen();

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

    // Accessible click listener on document for picking answers
    document.addEventListener('click', (e) => {
        if (document.getElementById("quiz-question").classList.contains("d-none")) return;
        if (isReading || answered) return;
        
        // Ignore if clicking an interactive element like a button, link, or input
        if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input')) return;

        accClickCount++;
        if (accClickTimeout) clearTimeout(accClickTimeout);
        
        playSound('click'); // Small feedback for a registered click

        accClickTimeout = setTimeout(() => {
            const index = accClickCount - 1;
            accClickCount = 0;
            if (index >= 0 && index <= 3) {
                selectAnswer(index);
            } else if (index > 3) {
                // Ignore bursts of clicks above 4 options
            }
        }, 1200);
    });
});

// =========================================================
// 6. NAVIGATION (with transitions)
// =========================================================
function showSection(section) {
    const sections = ["quiz", "history", "ranking", "backoffice"];
    const currentVisible = sections.find(s => {
        const el = document.getElementById(`${s}-section`);
        return el && !el.classList.contains("section-hidden");
    });

    sections.forEach(s => {
        const el = document.getElementById(`${s}-section`);
        const nav = document.getElementById(`nav-${s}`);
        if (s === section) {
            el.classList.remove("section-hidden");
            el.classList.add("section-fade-in");
            setTimeout(() => el.classList.remove("section-fade-in"), 400);
            if (nav) nav.classList.add("active");
        } else {
            el.classList.add("section-hidden");
            if (nav) nav.classList.remove("active");
        }
    });

    if (section === "quiz") { stopTimer(); stopGlobalTimer(); resetQuizView(); window.speechSynthesis?.cancel(); }
    else if (section === "backoffice") { questions = loadQuestionsFromLocalStorage(); renderBackofficeTable(); window.speechSynthesis?.cancel(); }
    else if (section === "history") { renderHistory(); window.speechSynthesis?.cancel(); }
    else if (section === "ranking") { renderLeaderboard(); window.speechSynthesis?.cancel(); }
}

// =========================================================
// 7. GAME MODE SELECTOR
// =========================================================
function selectGameMode(mode) {
    gameMode = mode;
    document.querySelectorAll("#game-mode-options .game-mode-btn").forEach(b => b.classList.remove("active"));
    document.querySelector(`#game-mode-options .game-mode-btn[onclick="selectGameMode('${mode}')"]`).classList.add("active");

    const namesInner = document.getElementById("player-names-inner");
    if (mode === "duel") {
        namesInner.innerHTML = `
            <input type="text" class="player-name-input" id="player1-name" placeholder="Jogador 1..." maxlength="20">
            <span class="text-muted fw-700">VS</span>
            <input type="text" class="player-name-input" id="player2-name" placeholder="Jogador 2..." maxlength="20">`;
    } else {
        namesInner.innerHTML = `<input type="text" class="player-name-input" id="player1-name" placeholder="O teu nome..." maxlength="20">`;
    }
}

// =========================================================
// 8. START SCREEN
// =========================================================
function updateStartScreen() {
    selectedCategory = "__all__";
    selectedDifficulty = "__all__";
    selectedQuizSize = 0;

    // Category filter
    const catContainer = document.getElementById("category-filter-options");
    catContainer.innerHTML = "";
    const categories = getCategories();
    const allCatBtn = document.createElement("button");
    allCatBtn.type = "button"; allCatBtn.className = "quiz-size-btn active"; allCatBtn.textContent = "Todas";
    allCatBtn.onclick = () => { selectedCategory = "__all__"; catContainer.querySelectorAll(".quiz-size-btn").forEach(b => b.classList.remove("active")); allCatBtn.classList.add("active"); refreshQuizCount(); };
    catContainer.appendChild(allCatBtn);
    categories.forEach(cat => {
        const btn = document.createElement("button");
        btn.type = "button"; btn.className = "quiz-size-btn"; btn.textContent = cat;
        btn.onclick = () => { selectedCategory = cat; catContainer.querySelectorAll(".quiz-size-btn").forEach(b => b.classList.remove("active")); btn.classList.add("active"); refreshQuizCount(); };
        catContainer.appendChild(btn);
    });

    // Difficulty filter
    const diffContainer = document.getElementById("difficulty-filter-options");
    diffContainer.innerHTML = "";
    const diffs = [{ val: "__all__", label: "Todas" }, { val: "fácil", label: "🟢 Fácil" }, { val: "médio", label: "🟡 Médio" }, { val: "difícil", label: "🔴 Difícil" }];
    diffs.forEach((d, i) => {
        const btn = document.createElement("button");
        btn.type = "button"; btn.className = "quiz-size-btn" + (i === 0 ? " active" : ""); btn.textContent = d.label;
        btn.onclick = () => { selectedDifficulty = d.val; diffContainer.querySelectorAll(".quiz-size-btn").forEach(b => b.classList.remove("active")); btn.classList.add("active"); refreshQuizCount(); };
        diffContainer.appendChild(btn);
    });

    refreshQuizCount();
}

function refreshQuizCount() {
    const available = getActiveQuestions(selectedCategory, selectedDifficulty);
    const total = available.length;
    document.getElementById("start-question-count").textContent = total;
    const container = document.getElementById("quiz-size-options");
    container.innerHTML = "";
    selectedQuizSize = 0;
    const sizes = [];
    if (total >= 5) sizes.push(5);
    if (total >= 10) sizes.push(10);
    sizes.push(0);
    sizes.forEach(size => {
        const btn = document.createElement("button");
        btn.type = "button"; btn.className = "quiz-size-btn" + (size === 0 ? " active" : "");
        btn.textContent = size === 0 ? `Todas (${total})` : `${size} perguntas`;
        btn.onclick = () => { 
            selectedQuizSize = size; 
            container.querySelectorAll(".quiz-size-btn").forEach(b => b.classList.remove("active")); 
            btn.classList.add("active"); 
            const customInput = document.getElementById("custom-quiz-size");
            if (customInput) customInput.value = "";
        };
        container.appendChild(btn);
    });

    const customWrapper = document.createElement("div");
    customWrapper.className = "d-flex align-items-center ms-2";
    customWrapper.innerHTML = `<input type="number" id="custom-quiz-size" class="form-control form-control-sm text-center" style="width: 80px; background: var(--bg-secondary); border: 1.5px solid var(--glass-border); color: var(--text-primary); border-radius: var(--radius-sm);" placeholder="Outro" min="1" max="${total}">`;
    
    customWrapper.querySelector('input').addEventListener('input', (e) => {
        let val = parseInt(e.target.value);
        if (!isNaN(val) && val > 0) {
            if (val > total) val = total;
            selectedQuizSize = val;
            container.querySelectorAll(".quiz-size-btn").forEach(b => b.classList.remove("active"));
        } else if (!e.target.value) {
            selectedQuizSize = 0;
            container.querySelectorAll(".quiz-size-btn").forEach(b => b.classList.remove("active"));
            const allBtn = container.querySelector('button:last-child');
            if(allBtn && allBtn.textContent.includes('Todas')) allBtn.classList.add('active');
        }
    });
    
    container.appendChild(customWrapper);
}

function resetQuizView() {
    document.getElementById("quiz-start").classList.remove("d-none");
    document.getElementById("quiz-question").classList.add("d-none");
    document.getElementById("quiz-results").classList.add("d-none");
    document.getElementById("duel-results").classList.add("d-none");
    document.getElementById("duel-handoff").classList.add("d-none");
    questions = loadQuestionsFromLocalStorage();
    updateStartScreen();
}

// =========================================================
// 9. QUIZ CORE
// =========================================================
function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function getDifficultyMultiplier(diff) {
    if (diff === "fácil") return 1;
    if (diff === "difícil") return 3;
    return 2; // médio
}

function getDiffBadgeClass(diff) {
    if (diff === "fácil") return "badge-diff-facil";
    if (diff === "difícil") return "badge-diff-dificil";
    return "badge-diff-medio";
}

function getDiffLabel(diff) {
    if (diff === "fácil") return "🟢 Fácil";
    if (diff === "difícil") return "🔴 Difícil";
    return "🟡 Médio";
}

function startQuiz() {
    playSound("click");
    questions = loadQuestionsFromLocalStorage();
    let pool = getActiveQuestions(selectedCategory, selectedDifficulty);
    if (pool.length === 0) { alert("Não existem perguntas ativas! Adiciona ou ativa perguntas no Backoffice."); return; }

    let shuffled = shuffleArray(pool);
    if (selectedQuizSize > 0 && selectedQuizSize < shuffled.length) shuffled = shuffled.slice(0, selectedQuizSize);

    quizQuestions = shuffled;
    currentQuestionIndex = 0;
    correctAnswers = 0;
    answered = false;
    userAnswers = [];
    totalPoints = 0;
    currentStreak = 0;
    maxStreak = 0;
    comboMultiplier = 1;
    quizStartTime = Date.now();

    // Player names
    const p1Input = document.getElementById("player1-name");
    playerName = (p1Input && p1Input.value.trim()) || "Jogador";

    // Duel setup
    if (gameMode === "duel") {
        const p2Input = document.getElementById("player2-name");
        duelPlayers = {
            p1: { name: playerName || "Jogador 1", correct: 0, points: 0, answers: [], streak: 0 },
            p2: { name: (p2Input && p2Input.value.trim()) || "Jogador 2", correct: 0, points: 0, answers: [], streak: 0 }
        };
        currentDuelPlayer = 1;
        duelQuestionPhase = 0;
        document.getElementById("duel-turn-container").classList.remove("d-none");
    } else {
        document.getElementById("duel-turn-container").classList.add("d-none");
    }

    document.getElementById("quiz-start").classList.add("d-none");
    document.getElementById("quiz-results").classList.add("d-none");
    document.getElementById("duel-results").classList.add("d-none");
    document.getElementById("quiz-question").classList.remove("d-none");

    // Points badge
    document.getElementById("points-live").classList.remove("d-none");

    // Timer setup based on mode
    if (gameMode === "timeattack") {
        document.getElementById("timer-container").classList.add("d-none");
        document.getElementById("global-timer-container").classList.remove("d-none");
        globalTimerSeconds = TIME_ATTACK_DURATION;
        startGlobalTimer();
    } else {
        document.getElementById("timer-container").classList.remove("d-none");
        document.getElementById("global-timer-container").classList.add("d-none");
    }

    renderQuestion();
}

function renderQuestion() {
    const q = quizQuestions[currentQuestionIndex];
    const total = quizQuestions.length;
    const card = document.getElementById("question-card-inner");

    // Duel turn
    if (gameMode === "duel") {
        const turnName = currentDuelPlayer === 1 ? duelPlayers.p1.name : duelPlayers.p2.name;
        document.getElementById("duel-turn-name").textContent = turnName;
        document.getElementById("duel-turn-container").classList.remove("d-none");
    }

    // Counter & progress
    const qNum = gameMode === "duel" ? Math.floor(currentQuestionIndex / 1) + 1 : currentQuestionIndex + 1;
    document.getElementById("question-counter").textContent = `Pergunta ${currentQuestionIndex + 1} / ${total}`;

    const currentPts = gameMode === "duel" ? (currentDuelPlayer === 1 ? duelPlayers.p1.points : duelPlayers.p2.points) : totalPoints;
    const currentCorrect = gameMode === "duel" ? (currentDuelPlayer === 1 ? duelPlayers.p1.correct : duelPlayers.p2.correct) : correctAnswers;

    document.getElementById("score-live").innerHTML = `<i class="bi bi-check-circle me-1"></i>${currentCorrect} correta${currentCorrect !== 1 ? 's' : ''}`;
    document.getElementById("points-live").innerHTML = `<i class="bi bi-star-fill me-1"></i>${currentPts} pts`;

    const progressPct = (currentQuestionIndex / total) * 100;
    document.getElementById("quiz-progress").style.width = progressPct + "%";

    // Difficulty badge
    const diffBadge = document.getElementById("question-diff-badge");
    diffBadge.className = `badge ${getDiffBadgeClass(q.difficulty || "médio")}`;
    diffBadge.textContent = getDiffLabel(q.difficulty || "médio");

    // Question text
    document.getElementById("question-text").textContent = q.text;

    // Options
    const container = document.getElementById("options-container");
    container.innerHTML = "";
    const letters = ["A", "B", "C", "D"];
    q.options.forEach((opt, i) => {
        const btn = document.createElement("button");
        btn.type = "button"; btn.className = "option-btn";
        btn.innerHTML = `<span class="option-letter">${letters[i]}</span><span>${escapeHtml(opt)}</span>`;
        btn.onclick = () => selectAnswer(i);
        container.appendChild(btn);
    });

    // Hide elements
    document.getElementById("btn-next").classList.add("d-none");
    document.getElementById("timeout-msg").classList.add("d-none");
    document.getElementById("explanation-box").classList.add("d-none");
    answered = false;

    // Streak badge
    updateStreakBadge();

    // Slide animation
    card.classList.remove("slide-in-right", "slide-out-left");
    void card.offsetWidth;
    card.classList.add("slide-in-right");

    // Timer
    if (gameMode !== "timeattack") startTimer();

    // TTS
    const btnRepeat = document.getElementById("btn-repeat-audio");
    if (btnRepeat) {
        if (ttsEnabled) {
            btnRepeat.classList.remove("d-none");
            repeatAudio();
        } else {
            btnRepeat.classList.add("d-none");
        }
    }
}

function selectAnswer(selectedIndex) {
    if (answered || isReading) return;
    answered = true;
    stopTimer();

    const q = quizQuestions[currentQuestionIndex];
    const buttons = document.querySelectorAll("#options-container .option-btn");
    const isCorrect = selectedIndex === q.correct;
    const diffMult = getDifficultyMultiplier(q.difficulty || "médio");

    if (gameMode === "duel") {
        const player = currentDuelPlayer === 1 ? duelPlayers.p1 : duelPlayers.p2;
        player.answers.push(selectedIndex);
        if (isCorrect) {
            player.correct++;
            player.streak = (player.streak || 0) + 1;
            let combo = 1;
            if (player.streak >= 5) combo = 3;
            else if (player.streak >= 3) combo = 2;
            const pts = 100 * diffMult * combo;
            player.points += pts;
            if (combo > 1) showCombo(combo);
        } else {
            player.streak = 0;
        }
        // Update live display
        document.getElementById("score-live").innerHTML = `<i class="bi bi-check-circle me-1"></i>${player.correct} correta${player.correct !== 1 ? 's' : ''}`;
        document.getElementById("points-live").innerHTML = `<i class="bi bi-star-fill me-1"></i>${player.points} pts`;
        
        if (isCorrect) playSound('correct');
        else playSound('wrong');
        
    } else {
        userAnswers.push(selectedIndex);
        if (isCorrect) {
            playSound('correct');
            correctAnswers++;
            currentStreak++;
            if (currentStreak > maxStreak) maxStreak = currentStreak;
            // Combo calc
            if (currentStreak >= 5) comboMultiplier = 3;
            else if (currentStreak >= 3) comboMultiplier = 2;
            else comboMultiplier = 1;
            const pts = 100 * diffMult * comboMultiplier;
            totalPoints += pts;
            if (comboMultiplier > 1) showCombo(comboMultiplier);
            document.getElementById("score-live").innerHTML = `<i class="bi bi-check-circle me-1"></i>${correctAnswers} correta${correctAnswers !== 1 ? 's' : ''}`;
        } else {
            playSound('wrong');
            currentStreak = 0;
            comboMultiplier = 1;
            userAnswers[userAnswers.length - 1] = selectedIndex;
        }
        document.getElementById("points-live").innerHTML = `<i class="bi bi-star-fill me-1"></i>${totalPoints} pts`;
    }

    updateStreakBadge();

    // Highlight buttons — in duel mode for Player 1, only show personal feedback
    if (gameMode === "duel" && currentDuelPlayer === 1) {
        buttons.forEach((btn, i) => {
            btn.disabled = true;
            if (i === selectedIndex) {
                btn.classList.add(isCorrect ? "duel-selected-correct" : "duel-selected-wrong");
            }
        });
        // Do NOT show explanation or correct answer for Player 1
        // Auto-transition to handoff after brief feedback
        setTimeout(() => showHandoff(2), 1200);
    } else {
        // Normal feedback: show correct answer + wrong answer
        buttons.forEach((btn, i) => {
            btn.disabled = true;
            if (i === q.correct) btn.classList.add("correct");
            else if (i === selectedIndex && !isCorrect) btn.classList.add("wrong");
        });

        // Show explanation
        if (q.explanation) {
            document.getElementById("explanation-text").textContent = q.explanation;
            document.getElementById("explanation-box").classList.remove("d-none");
        }

        if (gameMode === "timeattack") {
            setTimeout(() => nextQuestion(), 800);
        } else {
            showNextButton();
        }
    }
}

function handleTimeout() {
    playSound("timeout");
    if (answered) return;
    answered = true;
    stopTimer();

    if (gameMode === "duel") {
        const player = currentDuelPlayer === 1 ? duelPlayers.p1 : duelPlayers.p2;
        player.answers.push(-1);
        player.streak = 0;
    } else {
        userAnswers.push(-1);
        currentStreak = 0;
        comboMultiplier = 1;
    }

    updateStreakBadge();
    const q = quizQuestions[currentQuestionIndex];
    const buttons = document.querySelectorAll("#options-container .option-btn");

    if (gameMode === "duel" && currentDuelPlayer === 1) {
        // Player 1 timeout — don't reveal correct answer
        buttons.forEach((btn, i) => { btn.disabled = true; });
        document.getElementById("timeout-msg").classList.remove("d-none");
        setTimeout(() => showHandoff(2), 1200);
    } else {
        // Normal timeout — show correct answer
        buttons.forEach((btn, i) => { btn.disabled = true; if (i === q.correct) btn.classList.add("correct"); });

        if (q.explanation) {
            document.getElementById("explanation-text").textContent = q.explanation;
            document.getElementById("explanation-box").classList.remove("d-none");
        }

        document.getElementById("timeout-msg").classList.remove("d-none");

        if (gameMode === "timeattack") setTimeout(() => nextQuestion(), 800);
        else showNextButton();
    }
}

function showNextButton() {
    const btnNext = document.getElementById("btn-next");
    btnNext.classList.remove("d-none");
    const isLast = gameMode === "duel"
        ? (currentQuestionIndex >= quizQuestions.length - 1 && currentDuelPlayer === 2)
        : (currentQuestionIndex >= quizQuestions.length - 1);
    btnNext.innerHTML = isLast ? 'Ver Resultados <i class="bi bi-trophy ms-1"></i>' : 'Próxima <i class="bi bi-arrow-right ms-1"></i>';
}

function nextQuestion() {
    const card = document.getElementById("question-card-inner");
    card.classList.remove("slide-in-right");
    card.classList.add("slide-out-left");

    setTimeout(() => {
        if (gameMode === "duel") {
            if (currentDuelPlayer === 2) {
                // Both answered this question, move to next
                currentQuestionIndex++;
                if (currentQuestionIndex >= quizQuestions.length) showResults();
                else showHandoff(1); // Hand off to Player 1 for next question
            } else {
                // Solo player in duel somehow — shouldn't happen but fallback
                currentQuestionIndex++;
                if (currentQuestionIndex >= quizQuestions.length) showResults();
                else renderQuestion();
            }
        } else {
            currentQuestionIndex++;
            if (currentQuestionIndex >= quizQuestions.length) showResults();
            else renderQuestion();
        }
    }, 280);
}

// =========================================================
// DUEL HANDOFF
// =========================================================
let handoffTargetPlayer = 2;

function showHandoff(targetPlayer) {
    handoffTargetPlayer = targetPlayer;
    const handoffName = targetPlayer === 1 ? duelPlayers.p1.name : duelPlayers.p2.name;

    document.getElementById("duel-handoff-name").textContent = handoffName;
    document.getElementById("duel-handoff-text").textContent = `É a vez de:`;
    document.getElementById("duel-handoff").classList.remove("d-none");
    document.getElementById("quiz-question").classList.add("d-none");
}

function dismissHandoff() {
    playSound("click");
    document.getElementById("duel-handoff").classList.add("d-none");
    document.getElementById("quiz-question").classList.remove("d-none");

    currentDuelPlayer = handoffTargetPlayer;
    renderQuestion();
}

// =========================================================
// 10. STREAK / COMBO
// =========================================================
function updateStreakBadge() {
    const badge = document.getElementById("streak-badge");
    const count = document.getElementById("streak-count");
    const streak = gameMode === "duel" ? (currentDuelPlayer === 1 ? duelPlayers.p1.streak : duelPlayers.p2.streak) || 0 : currentStreak;

    if (streak >= 2) {
        badge.classList.remove("d-none");
        count.textContent = streak;
    } else {
        badge.classList.add("d-none");
    }
}

function showCombo(multiplier) {
    playSound("combo");
    const overlay = document.getElementById("combo-overlay");
    overlay.textContent = `🔥 Combo x${multiplier}!`;
    overlay.classList.remove("show");
    void overlay.offsetWidth;
    overlay.classList.add("show");
    setTimeout(() => overlay.classList.remove("show"), 1200);
}

// =========================================================
// 11. TIMERS
// =========================================================
function startTimer() {
    stopTimer();
    timerSeconds = TIMER_DURATION;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        if (isReading) return; // Pause timer during TTS
        timerSeconds--;
        updateTimerDisplay();
        if (timerSeconds <= 0) { stopTimer(); handleTimeout(); }
    }, 1000);
}

function stopTimer() { if (timerInterval) { clearInterval(timerInterval); timerInterval = null; } }

function updateTimerDisplay() {
    const circle = document.getElementById("timer-circle");
    const text = document.getElementById("timer-text");
    if (!circle || !text) return;
    text.textContent = timerSeconds;
    const fraction = timerSeconds / TIMER_DURATION;
    circle.style.strokeDashoffset = TIMER_CIRCUMFERENCE * (1 - fraction);
    circle.classList.remove("warning", "danger");
    if (timerSeconds <= 5) circle.classList.add("danger");
    else if (timerSeconds <= 10) circle.classList.add("warning");
}

function startGlobalTimer() {
    stopGlobalTimer();
    globalTimerSeconds = TIME_ATTACK_DURATION;
    updateGlobalTimerDisplay();
    globalTimerInterval = setInterval(() => {
        if (isReading) return; // Pause timer during TTS
        globalTimerSeconds--;
        updateGlobalTimerDisplay();
        if (globalTimerSeconds <= 0) { stopGlobalTimer(); showResults(); }
    }, 1000);
}

function stopGlobalTimer() { if (globalTimerInterval) { clearInterval(globalTimerInterval); globalTimerInterval = null; } }

function updateGlobalTimerDisplay() {
    const el = document.getElementById("global-timer-text");
    if (!el) return;
    el.textContent = globalTimerSeconds;
    el.classList.remove("time-warning", "time-danger");
    if (globalTimerSeconds <= 10) el.classList.add("time-danger");
    else if (globalTimerSeconds <= 20) el.classList.add("time-warning");
}
