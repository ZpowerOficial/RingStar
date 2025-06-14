// Firebase config placeholder for future integration
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// ===================================================================================
// RISING STAR FC - JAVASCRIPT CORE (WASM-Ready)
// Versão 1.0 - Adaptação do GDD para um protótipo funcional.
// ===================================================================================

const config = {
    POSITIONS: [
        { code: "GK-S", name: "Goleiro-Líbero", group: "Goleiro" }, { code: "GK-C", name: "Goleiro Clássico", group: "Goleiro" },
        { code: "CB-S", name: 'Zagueiro "Stopper"', group: "Defesa" }, { code: "CB-B", name: "Zagueiro Construtor", group: "Defesa" }, { code: "CB-L", name: "Líbero (Moderno)", group: "Defesa" },
        { code: "LB", name: "Lateral Esquerdo", group: "Lateral" }, { code: "RB", name: "Lateral Direito", group: "Lateral" }, { code: "LWB", name: "Ala Esquerdo", group: "Lateral" }, { code: "RWB", name: "Ala Direito", group: "Lateral" },
        { code: "DM-A", name: 'Primeiro Volante ("Anchor")', group: "Meio-Campo" }, { code: "CM-B2B", name: "Meio-Campo Box-to-Box", group: "Meio-Campo" }, { code: "CM-DLP", name: "Regista/Meia Recuado", group: "Meio-Campo" },
        { code: "AM-C", name: "Meia-Atacante Clássico", group: "Meio-Campo" }, { code: "AM-SS", name: '"Shadow Striker"', group: "Meio-Campo" },
        { code: "LW", name: "Ala Esquerdo", group: "Ataque" }, { code: "RW", name: "Ala Direito", group: "Ataque" }, { code: "ST-P", name: 'Finalizador ("Poacher")', group: "Ataque" }, { code: "ST-F9", name: "Falso 9", group: "Ataque" }
    ],
    ATTRIBUTE_CATEGORIES: {
        Fisico: ['aceleracao', 'velocidade', 'agilidade', 'equilibrio', 'salto', 'potencia', 'resistencia', 'forca'],
        Tecnico: ['cabeceio', 'controleBola', 'cruzamento', 'drible', 'finalizacao', 'chutesLonge', 'passeCurto', 'lancamento', 'desarmePe'],
        Mental: ['antecipacao', 'calma', 'decisoes', 'determinacao', 'inteligencia', 'semBola', 'visaoDeJogo', 'eticaTrabalho'],
        Goleiro: ['gkDefesa', 'gkJogoMaos', 'gkJogoPes', 'gkPosicionamento', 'gkReflexos']
    },
    PRIMARY_ATTRIBUTES_MAP: {
        Goleiro: ['gkReflexos', 'gkPosicionamento', 'gkJogoMaos', 'calma'],
        Defesa: ['desarmePe', 'inteligencia', 'forca', 'cabeceio', 'passeCurto'],
        Lateral: ['velocidade', 'cruzamento', 'desarmePe', 'resistencia', 'eticaTrabalho'],
        "Meio-Campo": ['passeCurto', 'visaoDeJogo', 'decisoes', 'controleBola', 'resistencia'],
        Ataque: ['finalizacao', 'aceleracao', 'semBola', 'drible', 'calma']
    },
    NATIONS: ["Brasil", "Argentina", "Alemanha", "França", "Itália", "Espanha", "Portugal", "Inglaterra", "Holanda", "Bélgica", "Uruguai", "Croácia", "Japão", "Nigéria", "EUA"],
};

let player = null;
let attributeChart = null;

const narrative = {
    apiKey: "pk_live_41A35B6D55928F6174D8C84353E42436D208",
    endpoint: "https://api.puter.com/v1/chat/completions",
    async generateHeadline(eventData) {
        let prompt;
        switch (eventData.event) {
            case 'gol_decisivo':
                prompt = `Escreva uma manchete de jornal esportivo, curta e dramática, para o seguinte evento: O jogador ${eventData.playerName} do time ${eventData.club} marcou o gol da vitória aos ${eventData.minute} minutos contra o ${eventData.opponent}, com o placar final de ${eventData.score}.`;
                break;
            case 'transferencia_recorde':
                prompt = `Escreva uma manchete de jornal esportivo sobre a transferência bombástica de ${eventData.playerName} para o clube ${eventData.newClub}, um time de grande reputação.`;
                break;
            case 'premio_individual':
                 prompt = `Escreva uma manchete de jornal celebrando a conquista do prêmio de "${eventData.awardName}" pelo jogador ${eventData.playerName}.`;
                break;
            default:
                return null;
        }
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: prompt }]
                })
            });
            if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
            const data = await response.json();
            return data.choices[0].message.content.replace(/"/g, '');
        } catch (error) {
            console.error("Narrative AI Error:", error);
            return `Notícia de última hora sobre ${eventData.playerName}!`;
        }
    }
};

const ui = {
    elements: {
        welcomeScreen: document.getElementById('welcomeScreen'),
        appState: document.getElementById('appState'),
        playerModal: document.getElementById('playerModal'),
        mainPlayerName: document.getElementById('mainPlayerName'),
        mainPlayerPosition: document.getElementById('mainPlayerPosition'),
        mainPlayerAge: document.getElementById('mainPlayerAge'),
        mainPlayerOverall: document.getElementById('mainPlayerOverall'),
        mainPlayerClub: document.getElementById('mainPlayerClub'),
        mainPlayerPotential: document.getElementById('mainPlayerPotential'),
        playerFlag: document.getElementById('player-flag'),
        eventFeed: document.getElementById('eventFeed'),
        primaryAttributes: document.getElementById('primaryAttributes'),
        careerHistoryBody: document.getElementById('careerHistoryBody'),
        resetBtn: document.getElementById('resetBtn'),
    },
    init() {
        const posSelect = document.getElementById('playerPosition');
        config.POSITIONS.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.code;
            opt.textContent = p.name;
            posSelect.appendChild(opt);
        });
        const natSelect = document.getElementById('playerNationality');
        config.NATIONS.forEach(n => {
            const opt = document.createElement('option');
            opt.value = n;
            opt.textContent = n;
            natSelect.appendChild(opt);
        });
        document.getElementById('currentYear').textContent = new Date().getFullYear();
        const savedGame = localStorage.getItem('risingStarFcSave');
        if (savedGame) {
            player = JSON.parse(savedGame);
            this.showGame();
        }
    },
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        this.updatePlayerDisplay();
    },
    showPlayerModal() { this.elements.playerModal.classList.remove('hidden'); },
    hidePlayerModal() { this.elements.playerModal.classList.add('hidden'); },
    showGame() {
        this.elements.welcomeScreen.classList.add('hidden');
        this.elements.appState.classList.remove('hidden');
        this.elements.resetBtn.classList.remove('hidden');
        this.updatePlayerDisplay();
    },
    updatePlayerDisplay() {
        if (!player) return;
        this.elements.mainPlayerName.textContent = `${player.pBio.name} "${player.pBio.surname}"`;
        this.elements.mainPlayerPosition.textContent = config.POSITIONS.find(p => p.code === player.pPosition).name;
        this.elements.mainPlayerAge.textContent = player.pBio.birthYear;
        this.elements.mainPlayerClub.textContent = player.pContract.clubName;
        this.elements.mainPlayerOverall.textContent = core.calculateOverall(player);
        this.elements.mainPlayerPotential.textContent = player.pPotentialCap;
        this.elements.playerFlag.textContent = this.getFlagEmoji(player.pBio.nation);
        this.renderAttributeRadar();
        this.renderPrimaryAttributes();
        this.renderCareerHistory();
    },
    renderAttributeRadar() {
        const ctx = document.getElementById('attributeRadar').getContext('2d');
        const isGK = config.POSITIONS.find(p => p.code === player.pPosition).group === "Goleiro";
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
        const textColor = theme === 'dark' ? '#e0e0e0' : '#212529';
        const labels = isGK ? ['Goleiro', 'Físico', 'Mental'] : ['Ataque', 'Defesa', 'Físico', 'Técnico', 'Mental'];
        const data = isGK ? [ core.getCategoryAverage(player, 'Goleiro'), core.getCategoryAverage(player, 'Fisico'), core.getCategoryAverage(player, 'Mental') ] : [ core.getCategoryAverage(player, 'Tecnico', ['finalizacao', 'cabeceio', 'chutesLonge']), core.getCategoryAverage(player, 'Tecnico', ['desarmePe', 'interceptacao', 'marcacao']), core.getCategoryAverage(player, 'Fisico'), core.getCategoryAverage(player, 'Tecnico', ['controleBola', 'drible', 'passeCurto', 'lancamento']), core.getCategoryAverage(player, 'Mental') ];
        if (attributeChart) attributeChart.destroy();
        attributeChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Overall por Categoria',
                    data: data,
                    backgroundColor: 'rgba(13, 110, 253, 0.2)',
                    borderColor: 'rgba(13, 110, 253, 1)',
                    pointBackgroundColor: 'rgba(13, 110, 253, 1)',
                    pointBorderColor: '#fff',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    r: {
                        min: 20,
                        max: 100,
                        grid: { color: gridColor },
                        pointLabels: { color: textColor, font: { size: 12 } },
                        angleLines: { color: gridColor },
                        ticks: { display: false, stepSize: 20 }
                    }
                },
                plugins: { legend: { display: false } }
            }
        });
    },
    renderPrimaryAttributes() {
        this.elements.primaryAttributes.innerHTML = '';
        const positionInfo = config.POSITIONS.find(p => p.code === player.pPosition);
        const primaryAttrs = config.PRIMARY_ATTRIBUTES_MAP[positionInfo.group];
        primaryAttrs.forEach(attrKey => {
            const value = player.pAttributes[attrKey];
            const colorClass = value > 80 ? 'bg-green-500' : value > 65 ? 'bg-blue-500' : 'bg-gray-400';
            const attrName = attrKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            const attrHTML = `\n                <div class="flex justify-between items-center">\n                    <span>${attrName}</span>\n                    <span class="font-bold">${value}</span>\n                </div>\n                <div class="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">\n                    <div class="${colorClass} h-1.5 rounded-full" style="width: ${value}%"></div>\n                </div>\n            `;
            this.elements.primaryAttributes.insertAdjacentHTML('beforeend', attrHTML);
        });
    },
    renderCareerHistory() {
        this.elements.careerHistoryBody.innerHTML = '';
        [...player.pHistory].reverse().forEach(snap => {
            const row = `\n                <tr class="border-b border-color hover:bg-opacity-5" style="background-color: var(--clr-bg);">\n                    <td class="p-2 font-semibold">${snap.snapYear} (${snap.snapAge})</td>\n                    <td class="p-2">${snap.snapClubName}</td>\n                    <td class="p-2">${snap.snapStats.gamesPlayed}</td>\n                    <td class="p-2">${snap.snapStats.goals}</td>\n                    <td class="p-2">${snap.snapStats.assists}</td>\n                    <td class="p-2 font-bold text-accent">${snap.snapAvgRating.toFixed(2)}</td>\n                </tr>`;
            this.elements.careerHistoryBody.insertAdjacentHTML('beforeend', row);
        });
    },
    addEventToFeed(message, icon = 'fa-solid fa-circle-info', isAI = false) {
        const firstEvent = this.elements.eventFeed.querySelector('.placeholder');
        if (firstEvent) firstEvent.remove();
        const eventElement = document.createElement('div');
        const aiBadge = isAI ? `<span class="text-xs font-bold text-purple-400 ml-2">[AI]</span>` : '';
        eventElement.className = 'p-2 rounded-md flex items-start gap-3 fade-in';
        eventElement.innerHTML = `<i class="${icon} mt-1 text-accent"></i><p class="flex-1">${message}${aiBadge}</p>`;
        this.elements.eventFeed.prepend(eventElement);
    },
    showNotification(message, type = 'success') {
        const area = document.getElementById('notificationArea');
        const notif = document.createElement('div');
        const color = type === 'success' ? 'var(--clr-success)' : 'var(--clr-danger)';
        notif.className = 'notification';
        notif.style.backgroundColor = color;
        notif.textContent = message;
        area.appendChild(notif);
        setTimeout(() => notif.remove(), 5000);
    },
    getFlagEmoji(nation) {
        const nationToCode = {
            "Brasil": "BR", "Argentina": "AR", "Alemanha": "DE", "França": "FR", "Itália": "IT",
            "Espanha": "ES", "Portugal": "PT", "Inglaterra": "GB", "Holanda": "NL", "Bélgica": "BE",
            "Uruguai": "UY", "Croácia": "HR", "Japão": "JP", "Nigéria": "NG", "EUA": "US"
        };
        const code = nationToCode[nation] || "UN";
        return code.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397));
    }
};

const core = {
    generatePlayer(name, surname, nation, foot, positionCode) {
        const position = config.POSITIONS.find(p => p.code === positionCode);
        const isGK = position.group === "Goleiro";
        const baseOverall = 45 + Math.floor(Math.random() * 15);
        const pAttributes = {};
        const allAttrs = Object.values(config.ATTRIBUTE_CATEGORIES).flat();
        const primaryAttrs = config.PRIMARY_ATTRIBUTES_MAP[position.group];
        allAttrs.forEach(attr => {
            const isPrimary = primaryAttrs.includes(attr);
            const isGkAttr = config.ATTRIBUTE_CATEGORIES.Goleiro.includes(attr);
            let baseValue;
            if (isGK && !isGkAttr) {
                baseValue = 5 + Math.floor(Math.random() * 10);
            } else if (!isGK && isGkAttr) {
                baseValue = 5 + Math.floor(Math.random() * 10);
            } else {
                const randomFactor = (Math.random() - 0.5) * 20;
                baseValue = baseOverall + randomFactor;
                if (isPrimary) {
                    baseValue += 10 + Math.floor(Math.random() * 10);
                }
            }
            pAttributes[attr] = this.clamp(Math.round(baseValue), 1, 99);
        });
        const finalOverall = this.calculateOverall({pAttributes, pPosition: positionCode});
        return {
            pId: `player_${Date.now()}`,
            pBio: { name, surname, nation, birthYear: 16, preferredFoot: foot },
            pPosition: positionCode,
            pAttributes: pAttributes,
            pPotentialCap: this.clamp(finalOverall + 20 + Math.floor(Math.random() * 25), 70, 99),
            pPotentialDyn: 0.1,
            pTraits: [],
            pHistory: [],
            pContract: { clubName: "Academia de Jovens" }
        };
    },
    calculateOverall(p) {
        const positionInfo = config.POSITIONS.find(pos => pos.code === p.pPosition);
        const primaryAttrs = config.PRIMARY_ATTRIBUTES_MAP[positionInfo.group];
        let total = 0;
        let count = 0;
        for (const attr in p.pAttributes) {
            const isPrimary = primaryAttrs.includes(attr);
            const value = p.pAttributes[attr];
            total += isPrimary ? value * 3 : value;
            count += isPrimary ? 3 : 1;
        }
        const isGK = positionInfo.group === "Goleiro";
        const gkAttrs = config.ATTRIBUTE_CATEGORIES.Goleiro;
        for(const attr of gkAttrs) {
            if (isGK) { total += p.pAttributes[attr] * 4; count += 4; }
            else { total -= p.pAttributes[attr]; count -= 1; }
        }
        return this.clamp(Math.round(total / count), 1, 99);
    },
    getCategoryAverage(p, category, subselection = null) {
        let attributesToAverage = subselection || config.ATTRIBUTE_CATEGORIES[category];
        if (!attributesToAverage) return 0;
        const sum = attributesToAverage.reduce((acc, attr) => acc + (p.pAttributes[attr] || 0), 0);
        return Math.round(sum / attributesToAverage.length);
    },
    evolvePlayer(p) {
        const age = p.pBio.birthYear;
        const potential = p.pPotentialCap;
        const currentOverall = this.calculateOverall(p);
        let developmentPoints;
        if (age < 19)      developmentPoints = 3 + Math.floor(Math.random() * 4);
        else if (age < 23) developmentPoints = 2 + Math.floor(Math.random() * 3);
        else if (age < 28) developmentPoints = 1 + Math.floor(Math.random() * 2);
        else if (age < 32) developmentPoints = Math.floor(Math.random() * 3) - 1;
        else               developmentPoints = Math.floor(Math.random() * 4) - 3;
        if (currentOverall >= potential && developmentPoints > 0) {
            developmentPoints = Math.floor(developmentPoints / 4);
        }
        const positionInfo = config.POSITIONS.find(pos => pos.code === p.pPosition);
        const primaryAttrs = config.PRIMARY_ATTRIBUTES_MAP[positionInfo.group];
        for (let i = 0; i < Math.abs(developmentPoints); i++) {
            const allAttrs = Object.keys(p.pAttributes);
            const attrToChange = Math.random() < 0.7 ? primaryAttrs[Math.floor(Math.random() * primaryAttrs.length)] : allAttrs[Math.floor(Math.random() * allAttrs.length)];
            if (developmentPoints > 0) {
                if(p.pAttributes[attrToChange] < 99) p.pAttributes[attrToChange]++;
            } else {
                if(p.pAttributes[attrToChange] > 20) p.pAttributes[attrToChange]--;
            }
        }
        const newOverall = this.calculateOverall(p);
        const change = newOverall - currentOverall;
        if (change > 0) ui.addEventToFeed(`Evolução: Jogador melhorou em ${change} pontos de overall.`, 'fa-solid fa-arrow-trend-up');
        else if (change < 0) ui.addEventToFeed(`Declínio: Jogador regrediu em ${-change} pontos de overall.`, 'fa-solid fa-arrow-trend-down');
        return p;
    },
    simulateSeason(p) {
        const gamesPlayed = 25 + Math.floor(Math.random() * 10);
        let goals = 0;
        let assists = 0;
        let ratingSum = 0;
        const overall = this.calculateOverall(p);
        const positionGroup = config.POSITIONS.find(pos => pos.code === p.pPosition).group;
        for (let i = 0; i < gamesPlayed; i++) {
            let baseRating = 6.5;
            let goalChance = (p.pAttributes.finalizacao + p.pAttributes.semBola) / 500;
            if (positionGroup === 'Ataque') goalChance *= 2.5;
            if (positionGroup === 'Meio-Campo') goalChance *= 1.5;
            if (Math.random() < goalChance) { goals++; baseRating += 1.5; }
            let assistChance = (p.pAttributes.visaoDeJogo + p.pAttributes.passeCurto) / 500;
             if (positionGroup === 'Meio-Campo') assistChance *= 2.5;
            if (positionGroup === 'Lateral' || positionGroup === 'Ataque') assistChance *= 1.5;
            if (Math.random() < assistChance) { assists++; baseRating += 1.0; }
            baseRating += (overall / 100) * 0.5;
            baseRating += (Math.random() - 0.5) * 1.0;
            ratingSum += this.clamp(baseRating, 4.0, 10.0);
        }
        const snap = {
            snapYear: 2024 + p.pHistory.length,
            snapAge: p.pBio.birthYear,
            snapClubName: p.pContract.clubName,
            snapStats: { gamesPlayed, goals, assists },
            snapAvgRating: ratingSum / gamesPlayed
        };
        ui.addEventToFeed(`Fim da temporada aos ${snap.snapAge} anos: ${goals} gols e ${assists} assistências.`, 'fa-solid fa-chart-simple');
        return snap;
    },
    clamp(num, min, max) { return Math.min(Math.max(num, min), max); }
};

const game = {
    async createPlayer() {
        const name = document.getElementById('playerName').value;
        const surname = document.getElementById('playerSurname').value;
        const nation = document.getElementById('playerNationality').value;
        const foot = document.getElementById('playerFoot').value;
        const pos = document.getElementById('playerPosition').value;
        if (!name || !surname) {
            ui.showNotification("Nome e apelido são obrigatórios!", 'error');
            return;
        }
        player = core.generatePlayer(name, surname, nation, foot, pos);
        ui.hidePlayerModal();
        ui.addEventToFeed(`Uma nova estrela surge! ${player.pBio.name} inicia sua carreira.`, 'fa-solid fa-star');
        ui.showGame();
        this.save();
    },
    async advanceSeason() {
        if (!player) return;
        document.getElementById('globalLoadingIndicator').classList.remove('hidden');
        player.pBio.birthYear++;
        player = core.evolvePlayer(player);
        const seasonSnap = core.simulateSeason(player);
        player.pHistory.push(seasonSnap);
        const currentOverall = core.calculateOverall(player);
        if (currentOverall > 75 && Math.random() < 0.3) {
            const newClub = "Gigantes Continentais";
            player.pContract.clubName = newClub;
            const headline = await narrative.generateHeadline({
                event: 'transferencia_recorde',
                playerName: `${player.pBio.name} "${player.pBio.surname}"`,
                newClub: newClub
            });
            ui.addEventToFeed(headline, 'fa-solid fa-money-bill-transfer', true);
        }
        if(seasonSnap.snapStats.goals > 20) {
             const awardName = `Chuteira de Ouro da Liga`;
             const headline = await narrative.generateHeadline({
                event: 'premio_individual',
                playerName: `${player.pBio.name} "${player.pBio.surname}"`,
                awardName: awardName
             });
             ui.addEventToFeed(headline, 'fa-solid fa-trophy', true);
        }
        ui.updatePlayerDisplay();
        this.save();
        document.getElementById('globalLoadingIndicator').classList.add('hidden');
    },
    save() { localStorage.setItem('risingStarFcSave', JSON.stringify(player)); },
    reset() {
        if (confirm("Tem certeza que deseja apagar sua carreira atual e começar uma nova?")) {
            localStorage.removeItem('risingStarFcSave');
            window.location.reload();
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.ui = ui;
    window.game = game;
    ui.init();
});
