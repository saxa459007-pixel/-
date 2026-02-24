// ========== КОНСТАНТЫ ==========
const PASSIVE_ORDER = [
    "Барьер", "Быстрое восстановление", "Мародер", "Внимательность",
    "Инициативность", "Исследователь", "Ведьмак", "Собиратель",
    "Запасливость", "Охотник за головами", "Подвижность", "Упорность",
    "Регенерация", "Расчетливость", "Презрение к боли", "Ошеломление",
    "Рыбак", "Неуязвимый", "Колющий удар", "Бесстрашие", "Режущий удар",
    "Феникс", "Непоколебимый", "Суеверность", "Гладиатор", "Воздаяние",
    "Ученик", "Прочность", "Расторопность", "Устрашение", "Контратака",
    "Дробящий удар", "Защитная стойка", "Стойка сосредоточения", "Водохлеб",
    "Картограф", "Браконьер", "Парирование", "Ловкость рук", "Незаметность",
    "Атлетика", "Устойчивость", "Угроза", "Знания древних", "Еретик"
];

// ========== СОСТОЯНИЕ ==========
let passiveSortByAlphabet = false;
let activeSortByAlphabet = false;

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
function measureTextWidth(text, font, padding = 0) {
    const span = document.createElement('span');
    span.style.font = font;
    span.style.visibility = 'hidden';
    span.style.position = 'absolute';
    span.style.whiteSpace = 'nowrap';
    span.style.fontSize = '14px';
    span.style.fontWeight = '700';
    span.textContent = text || '1';
    document.body.appendChild(span);
    const width = span.offsetWidth;
    document.body.removeChild(span);
    return width + padding;
}

function getStatsFromProfile() {
    const stats = {};
    document.querySelectorAll('.stat-value').forEach(el => {
        let value = el.textContent;
        if (el.dataset.key === 'resist') {
            value = value.replace('%', '');
        }
        stats[el.dataset.key] = value;
    });
    return {
        lvl: parseInt(stats.lvl) || 0,
        atk: parseInt(stats.atk) || 0,
        armor: parseInt(stats.armor) || 0,
        str: parseInt(stats.str) || 0,
        agi: parseInt(stats.agi) || 0,
        vit: parseInt(stats.vit) || 0,
        luck: parseInt(stats.luck) || 0,
        acc: parseInt(stats.acc) || 0,
        conc: parseInt(stats.conc) || 0,
        class_lvl: parseInt(stats.class_lvl) || 0,
        resist: parseInt(stats.resist) || 0,
        karma: parseInt(stats.karma) || 0
    };
}

// ========== ФУНКЦИИ ДЛЯ АКТИВНЫХ КНИГ ==========
function calculateActiveDamage(skillName, level, stats) {
    const skill = ACTIVE_SKILLS[skillName];
    if (!skill) return '?';
    
    try {
        if (!skill.calc_damage) {
            return skill.calc ? skill.calc(level) : '?';
        }
        
        const params = skill.params || [];
        if (params.length === 1) {
            const value = stats[params[0]] || 0;
            return skill.calc_damage(level, value);
        } else if (params.length === 2) {
            const value1 = stats[params[0]] || 0;
            const value2 = stats[params[1]] || 0;
            return skill.calc_damage(level, value1, value2);
        }
        
        switch(skillName) {
            case "Грязный удар":
                return skill.calc_damage(level, stats.agi, stats.str);
            case "Слабое исцеление":
                return skill.calc_damage(level, stats.vit);
            case "Удар вампира":
                return skill.calc_damage(level, stats.agi, stats.vit);
            case "Мощный удар":
                return skill.calc_damage(level, stats.str, stats.atk);
            case "Сила теней":
                return skill.calc_damage(level, stats.lvl);
            case "Расправа":
                return skill.calc_damage(level, stats.lvl);
            case "Рассечение":
                return skill.calc_damage(level, stats.atk, stats.agi);
            case "Таран":
                return skill.calc_damage(level, stats.armor);
            case "Огонек надежды":
                return skill.calc_damage(level, stats.vit);
            case "Кровотечение":
                return skill.calc_damage(level, stats.atk, stats.agi);
            case "Заражение":
                return skill.calc_damage(level, stats.vit);
            case "Раскол":
                return skill.calc_damage(level, stats.agi);
            default:
                return skill.calc ? skill.calc(level) : '?';
        }
    } catch (e) {
        console.log('Ошибка расчета для', skillName, e);
        return '?';
    }
}

function getStatsString(skillName, stats) {
    switch(skillName) {
        case "Грязный удар":
            return `<div class="stat-item" onclick="editActiveStat(event, this, 'agi')"><span class="stat-icon-small">👐</span><div class="stat-value-container-small"><span class="stat-value-small">${stats.agi}</span><span class="stat-label-small">лвк</span></div></div><div class="stat-item" onclick="editActiveStat(event, this, 'str')"><span class="stat-icon-small">💪</span><div class="stat-value-container-small"><span class="stat-value-small">${stats.str}</span><span class="stat-label-small">сил</span></div></div>`;
        case "Слабое исцеление":
            return `<div class="stat-item" onclick="editActiveStat(event, this, 'vit')"><span class="stat-icon-small">❤️</span><div class="stat-value-container-small"><span class="stat-value-small">${stats.vit}</span><span class="stat-label-small">внс</span></div></div>`;
        case "Удар вампира":
            return `<div class="stat-item" onclick="editActiveStat(event, this, 'agi')"><span class="stat-icon-small">👐</span><div class="stat-value-container-small"><span class="stat-value-small">${stats.agi}</span><span class="stat-label-small">лвк</span></div></div><div class="stat-item" onclick="editActiveStat(event, this, 'vit')"><span class="stat-icon-small">❤️</span><div class="stat-value-container-small"><span class="stat-value-small">${stats.vit}</span><span class="stat-label-small">внс</span></div></div>`;
        case "Мощный удар":
            return `<div class="stat-item" onclick="editActiveStat(event, this, 'str')"><span class="stat-icon-small">💪</span><div class="stat-value-container-small"><span class="stat-value-small">${stats.str}</span><span class="stat-label-small">сил</span></div></div><div class="stat-item" onclick="editActiveStat(event, this, 'atk')"><span class="stat-icon-small">⚔️</span><div class="stat-value-container-small"><span class="stat-value-small">${stats.atk}</span><span class="stat-label-small">атк</span></div></div>`;
        case "Сила теней":
        case "Расправа":
        case "Проклятие тьмы":
        case "Целебный огонь":
            return `<div class="stat-item" onclick="editActiveStat(event, this, 'lvl')"><span class="stat-icon-small">🕯️</span><div class="stat-value-container-small"><span class="stat-value-small">${stats.lvl}</span><span class="stat-label-small">ур</span></div></div>`;
        case "Слепота":
        case "Берсеркер":
            return `<span class="stat-item">не требует статов</span>`;
        case "Рассечение":
            return `<div class="stat-item" onclick="editActiveStat(event, this, 'atk')"><span class="stat-icon-small">⚔️</span><div class="stat-value-container-small"><span class="stat-value-small">${stats.atk}</span><span class="stat-label-small">атк</span></div></div><div class="stat-item" onclick="editActiveStat(event, this, 'agi')"><span class="stat-icon-small">👐</span><div class="stat-value-container-small"><span class="stat-value-small">${stats.agi}</span><span class="stat-label-small">лвк</span></div></div>`;
        case "Таран":
            return `<div class="stat-item" onclick="editActiveStat(event, this, 'armor')"><span class="stat-icon-small">🛡️</span><div class="stat-value-container-small"><span class="stat-value-small">${stats.armor}</span><span class="stat-label-small">брн</span></div></div>`;
        case "Огонек надежды":
            return `<div class="stat-item" onclick="editActiveStat(event, this, 'vit')"><span class="stat-icon-small">❤️</span><div class="stat-value-container-small"><span class="stat-value-small">${stats.vit}</span><span class="stat-label-small">внс</span></div></div>`;
        case "Кровотечение":
            return `<div class="stat-item" onclick="editActiveStat(event, this, 'atk')"><span class="stat-icon-small">⚔️</span><div class="stat-value-container-small"><span class="stat-value-small">${stats.atk}</span><span class="stat-label-small">атк</span></div></div><div class="stat-item" onclick="editActiveStat(event, this, 'agi')"><span class="stat-icon-small">👐</span><div class="stat-value-container-small"><span class="stat-value-small">${stats.agi}</span><span class="stat-label-small">лвк</span></div></div>`;
        case "Заражение":
            return `<div class="stat-item" onclick="editActiveStat(event, this, 'vit')"><span class="stat-icon-small">❤️</span><div class="stat-value-container-small"><span class="stat-value-small">${stats.vit}</span><span class="stat-label-small">внс</span></div></div>`;
        case "Раскол":
            return `<div class="stat-item" onclick="editActiveStat(event, this, 'agi')"><span class="stat-icon-small">👐</span><div class="stat-value-container-small"><span class="stat-value-small">${stats.agi}</span><span class="stat-label-small">лвк</span></div></div>`;
        default:
            return '';
    }
}

function getSkillDescription(skillName, level, stats) {
    const skill = ACTIVE_SKILLS[skillName];
    if (!skill) return skillName;
    
    let desc = skill.desc;
    const damage = calculateActiveDamage(skillName, level, stats);
    const mult = skill.calc ? skill.calc(level) : 0;
    
    switch(skillName) {
        case "Расправа":
            const inner = Math.sqrt(level*10)/100 + 1;
            const rounded = Math.floor(inner * 100) / 100;
            const x_percent = Math.floor(rounded * 50);
            const max_damage = stats.lvl * 50;
            desc = desc.replace('{x_percent}', `<span class="book-val">${x_percent}</span>`)
                      .replace('{max_damage}', `<span class="book-val">${max_damage}</span>`)
                      .replace('{damage}', `<span class="book-val">${damage}</span>`);
            break;
        case "Слабое исцеление":
            const heal_percent = Math.floor(mult / 4);
            const accuracy_reduce = Math.floor(heal_percent / 5);
            desc = desc.replace('{heal_percent}', `<span class="book-val">${heal_percent}</span>`)
                      .replace('{accuracy_reduce}', `<span class="book-val">${accuracy_reduce}</span>`);
            break;
        case "Удар вампира":
            const regen = Math.ceil(damage / 15);
            desc = desc.replace('{regen}', `<span class="book-val">${regen}</span>`)
                      .replace('{damage}', `<span class="book-val">${damage}</span>`);
            break;
        case "Берсеркер":
            const berserk_percent = Math.floor((Math.sqrt(level*10)/100*1 + 1) * 50);
            desc = desc.replace('{berserk_percent}', `<span class="book-val">${berserk_percent}</span>`);
            break;
        case "Проклятие тьмы":
            const min_reduce = Math.floor(mult / 20);
            const max_reduce = Math.floor(mult * 3 / 20);
            const max_units = stats.lvl * 10;
            desc = desc.replace('{min_reduce}', `<span class="book-val">${min_reduce}</span>`)
                      .replace('{max_reduce}', `<span class="book-val">${max_reduce}</span>`)
                      .replace('{max_units}', `<span class="book-val">${max_units}</span>`);
            break;
        case "Целебный огонь":
            const heal_percent_fire = Math.floor((Math.sqrt(level*10)/100*0.5 + 1) * 20);
            const max_heal = stats.lvl * 50;
            desc = desc.replace(/{heal_percent}/g, `<span class="book-val">${heal_percent_fire}</span>`)
                      .replace('{max_heal}', `<span class="book-val">${max_heal}</span>`);
            break;
        case "Слепота":
            desc = desc.replace('{damage}', `<span class="book-val">${mult}</span>`);
            break;
        case "Раскол":
            const armor_reduce = Math.floor((Math.sqrt(level*10)/100*0.5 + 1) * 30);
            desc = desc.replace('{armor_reduce}', `<span class="book-val">${armor_reduce}</span>`)
                      .replace('{damage}', `<span class="book-val">${damage}</span>`);
            break;
        default:
            desc = desc.replace('{damage}', `<span class="book-val">${damage}</span>`);
    }
    return desc;
}

window.editActiveStat = function(event, element, statKey) {
    event.preventDefault();
    event.stopPropagation();
    
    const valueContainer = element.querySelector('.stat-value-container-small');
    const valueSpan = valueContainer.querySelector('.stat-value-small');
    const labelSpan = valueContainer.querySelector('.stat-label-small');
    if (!valueSpan) return;
    
    let currentVal = valueSpan.textContent;
    
    const input = document.createElement('input');
    input.type = 'number';
    input.value = currentVal === '0' ? '' : currentVal;
    input.className = 'stat-input-small';
    input.maxLength = 7;
    input.max = '9999999';
    
    input.addEventListener('input', function() {
        if (this.value.length > 7) {
            this.value = this.value.slice(0, 7);
        }
    });
    
    valueSpan.style.visibility = 'hidden';
    if (labelSpan) labelSpan.style.visibility = 'hidden';
    valueContainer.appendChild(input);
    input.focus();
    input.select();
    
    const finish = () => {
        let newVal = input.value;
        if (newVal === '') newVal = '0';
        
        let finalValue = newVal;
        const num = parseFloat(newVal);
        if (!isNaN(num)) {
            if (num > 9999999) finalValue = '9999999';
            else finalValue = Math.floor(num).toString();
        }
        
        if (statKey === 'str' || statKey === 'agi' || statKey === 'vit') {
            if (parseInt(finalValue) < 3) finalValue = '3';
        }
        
        valueSpan.textContent = finalValue;
        valueSpan.style.visibility = 'visible';
        if (labelSpan) labelSpan.style.visibility = 'visible';
        input.remove();
        
        const profileStat = document.querySelector(`.stat-value[data-key="${statKey}"]`);
        if (profileStat) {
            profileStat.textContent = finalValue;
        }
        
        // Обновляем все активные книги
        const items = document.querySelectorAll('#activeBooksContainer .book-item');
        const stats = getStatsFromProfile();
        items.forEach(item => {
            const bookName = item.querySelector('.book-name').textContent;
            const level = parseInt(item.querySelector('.book-level-input').value) || 1;
            const descDiv = item.querySelector('.book-desc');
            if (descDiv) {
                descDiv.innerHTML = getSkillDescription(bookName, level, stats);
            }
            const statsDiv = item.querySelector('.stats-row');
            if (statsDiv) {
                statsDiv.innerHTML = getStatsString(bookName, stats);
            }
            const percentSpan = item.querySelector('.book-percent');
            const skill = ACTIVE_SKILLS[bookName];
            if (percentSpan && skill && skill.calc) {
                const effectPercent = skill.calc(level);
                percentSpan.textContent = `(${effectPercent}%)`;
            }
            updateActiveBookPrice(item, bookName, level);
        });
    };
    
    input.onblur = finish;
    input.onkeydown = e => {
        if(e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            input.blur();
            return false;
        }
    };
    input.onclick = e => e.stopPropagation();
};

window.updateActiveBookLevel = function(name, value) {
    const savedLevels = JSON.parse(localStorage.getItem('rpg_active_books_levels_final_verified_v8') || '{}');
    const newLevel = parseInt(value) || 0;
    if (savedLevels[name] === newLevel) return;
    
    savedLevels[name] = newLevel;
    localStorage.setItem('rpg_active_books_levels_final_verified_v8', JSON.stringify(savedLevels));
    
    const items = document.querySelectorAll('#activeBooksContainer .book-item');
    for (const item of items) {
        if (item.dataset.bookName === name.toLowerCase()) {
            const input = item.querySelector('.book-level-input');
            if (input && parseInt(input.value) !== newLevel) {
                input.value = newLevel;
                const font = window.getComputedStyle(input).font;
                const width = measureTextWidth(input.value || '1', font, 2);
                input.style.width = (width + 2) + 'px';
            }
            updateActiveBookDescription(item, name, newLevel);
            updateActiveBookPrice(item, name, newLevel);
            break;
        }
    }
};

function updateActiveBookDescription(bookElement, bookName, level) {
    const stats = getStatsFromProfile();
    const desc = getSkillDescription(bookName, level, stats);
    const statsString = getStatsString(bookName, stats);
    const percentSpan = bookElement.querySelector('.book-percent');
    const skill = ACTIVE_SKILLS[bookName];
    
    if (percentSpan && skill && skill.calc) {
        const effectPercent = skill.calc(level);
        percentSpan.textContent = `(${effectPercent}%)`;
    }
    
    const descDiv = bookElement.querySelector('.book-desc');
    if (descDiv) {
        descDiv.innerHTML = desc;
    }
    
    const statsDiv = bookElement.querySelector('.stats-row');
    if (statsDiv) {
        statsDiv.innerHTML = statsString;
    }
}

async function updateActiveBookPrice(bookElement, bookName, level) {
    try {
        const bookPrice = await getBookPrice(bookName);
        if (bookPrice && bookPrice > 0) {
            const totalCost = calculateUpgradeCost(level, bookPrice);
            if (totalCost) {
                const priceDiv = bookElement.querySelector('.book-price');
                if (priceDiv) {
                    priceDiv.innerHTML = `🌕 ${formatGold(totalCost)}`;
                }
            }
        }
    } catch (e) {
        console.log('Ошибка обновления цены для', bookName);
    }
}

window.toggleActiveSort = function() {
    activeSortByAlphabet = !activeSortByAlphabet;
    const iconList = document.getElementById('activeSortIconList');
    const iconAZ = document.getElementById('activeSortIconAZ');
    
    if (activeSortByAlphabet) {
        iconList.style.display = 'none';
        iconAZ.style.display = 'block';
    } else {
        iconList.style.display = 'block';
        iconAZ.style.display = 'none';
    }
    
    const searchInput = document.getElementById('activeSearchInput');
    const currentQuery = searchInput ? searchInput.value : '';
    renderActiveBooks().then(() => {
        if (searchInput) {
            searchInput.value = currentQuery;
            filterActiveBooks();
        }
    });
};

window.handleActiveSearch = function() {
    const input = document.getElementById('activeSearchInput');
    const clearBtn = document.getElementById('clearActiveSearchBtn');
    
    if (input.value.length > 0) {
        clearBtn.classList.add('visible');
    } else {
        clearBtn.classList.remove('visible');
    }
    filterActiveBooks();
};

window.clearActiveSearch = function() {
    const input = document.getElementById('activeSearchInput');
    const clearBtn = document.getElementById('clearActiveSearchBtn');
    input.value = '';
    clearBtn.classList.remove('visible');
    input.focus();
    filterActiveBooks();
};

window.filterActiveBooks = function() {
    const input = document.getElementById('activeSearchInput');
    const query = input.value.toLowerCase().trim();
    const items = document.querySelectorAll('#activeBooksContainer .book-item');
    let visibleCount = 0;
    
    items.forEach(item => {
        const name = item.dataset.bookName;
        if (name.startsWith(query)) {
            item.style.display = 'flex';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });
    
    const noResultsMsg = document.getElementById('activeNoResultsMsg');
    if (visibleCount === 0) {
        noResultsMsg.style.display = 'block';
    } else {
        noResultsMsg.style.display = 'none';
    }
};

window.renderActiveBooks = async function() {
    const savedLevels = JSON.parse(localStorage.getItem('rpg_active_books_levels_final_verified_v8') || '{}');
    const container = document.getElementById('activeBooksContainer');
    container.innerHTML = '';
    
    let booksArray = Object.entries(ACTIVE_SKILLS);
    if (activeSortByAlphabet) {
        booksArray.sort((a, b) => a[0].localeCompare(b[0], 'ru'));
    }
    
    const stats = getStatsFromProfile();
    
    for (const [name, data] of booksArray) {
        const lvl = savedLevels[name] || 0;
        const desc = getSkillDescription(name, lvl, stats);
        const statsString = getStatsString(name, stats);
        const effectPercent = data.calc ? data.calc(lvl) : 0;
        
        const item = document.createElement('div');
        item.className = 'book-item';
        item.dataset.bookName = name.toLowerCase();
        
        let priceText = '0';
        try {
            const bookPrice = await getBookPrice(name);
            if (bookPrice && bookPrice > 0) {
                const totalCost = calculateUpgradeCost(lvl, bookPrice);
                if (totalCost) {
                    priceText = formatGold(totalCost);
                }
            }
        } catch (e) {
            console.log('Ошибка получения цены для', name);
        }
        
        const headerDiv = document.createElement('div');
        headerDiv.className = 'book-header';
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'book-name';
        nameDiv.textContent = name;
        headerDiv.appendChild(nameDiv);
        
        const descDiv = document.createElement('div');
        descDiv.className = 'book-desc';
        descDiv.innerHTML = desc;
        
        const statsDiv = document.createElement('div');
        statsDiv.className = 'stats-row';
        statsDiv.innerHTML = statsString;
        
        const footerDiv = document.createElement('div');
        footerDiv.className = 'book-footer';
        
        const leftGroup = document.createElement('div');
        leftGroup.className = 'left-group';
        
        const levelWrapper = document.createElement('div');
        levelWrapper.className = 'book-level-wrapper';
        
        const levelInput = document.createElement('input');
        levelInput.type = 'number';
        levelInput.className = 'book-level-input';
        levelInput.value = lvl;
        levelInput.min = '0';
        levelInput.setAttribute('form', 'off');
        levelInput.setAttribute('autocomplete', 'off');
        levelInput.setAttribute('autocorrect', 'off');
        levelInput.setAttribute('spellcheck', 'false');
        
        const updateInputWidth = function() {
            const font = window.getComputedStyle(this).font;
            const width = measureTextWidth(this.value || '1', font, 2);
            this.style.width = (width + 2) + 'px';
        };
        
        levelInput.addEventListener('input', updateInputWidth);
        levelInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                this.blur();
                return false;
            }
        }, true);
        
        levelInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        }, true);
        
        levelInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        }, true);
        
        levelInput.addEventListener('blur', function() {
            updateActiveBookLevel(name, this.value);
        });
        
        setTimeout(() => {
            const font = window.getComputedStyle(levelInput).font;
            const width = measureTextWidth(levelInput.value || '1', font, 2);
            levelInput.style.width = (width + 2) + 'px';
        }, 0);
        
        const levelUnit = document.createElement('span');
        levelUnit.className = 'book-level-unit';
        levelUnit.textContent = 'ур.';
        levelWrapper.appendChild(levelInput);
        levelWrapper.appendChild(levelUnit);
        
        const percentSpan = document.createElement('span');
        percentSpan.className = 'book-percent';
        percentSpan.textContent = `(${effectPercent}%)`;
        
        leftGroup.appendChild(levelWrapper);
        leftGroup.appendChild(percentSpan);
        
        const priceDiv = document.createElement('div');
        priceDiv.className = 'book-price';
        priceDiv.innerHTML = `🌕 ${priceText}`;
        
        footerDiv.appendChild(leftGroup);
        footerDiv.appendChild(priceDiv);
        
        item.appendChild(headerDiv);
        item.appendChild(descDiv);
        if (statsString) {
            item.appendChild(statsDiv);
        }
        item.appendChild(footerDiv);
        
        container.appendChild(item);
    }
    handleActiveSearch();
};

// ========== ФУНКЦИИ ДЛЯ ПАССИВНЫХ КНИГ ==========
window.renderPassiveBooks = async function() {
    const savedLevels = JSON.parse(localStorage.getItem('rpg_books_levels_final_verified_v8') || '{}');
    const container = document.getElementById('passiveBooksContainer');
    container.innerHTML = '';
    
    let booksArray = [];
    if (passiveSortByAlphabet) {
        booksArray = Object.entries(PASSIVE_SKILLS).sort((a, b) => a[0].localeCompare(b[0], 'ru'));
    } else {
        for (const bookName of PASSIVE_ORDER) {
            if (PASSIVE_SKILLS[bookName]) {
                booksArray.push([bookName, PASSIVE_SKILLS[bookName]]);
            }
        }
        const existingBooks = new Set(booksArray.map(([name]) => name));
        for (const [name, data] of Object.entries(PASSIVE_SKILLS)) {
            if (!existingBooks.has(name)) {
                booksArray.push([name, data]);
            }
        }
    }
    
    for (const [name, data] of booksArray) {
        const lvl = savedLevels[name] || 0;
        let result = data.calc(lvl);
        let formatData;
        
        if (data.format) {
            if (typeof data.format === 'function') {
                formatData = data.format(result, lvl);
            } else {
                formatData = data.format;
            }
        } else {
            formatData = { result: result };
        }
        
        let desc = data.desc;
        for (const [key, val] of Object.entries(formatData)) {
            const regex = new RegExp(`\\{${key}(?::\\.2f)?\\}`, 'g');
            desc = desc.replace(regex, `<span class="book-val">${val}</span>`);
        }
        
        const item = document.createElement('div');
        item.className = 'book-item';
        item.dataset.bookName = name.toLowerCase();
        
        let priceText = '0';
        try {
            const bookPrice = await getBookPrice(name);
            if (bookPrice && bookPrice > 0) {
                const totalCost = calculateUpgradeCost(lvl, bookPrice);
                if (totalCost) {
                    priceText = formatGold(totalCost);
                }
            }
        } catch (e) {
            console.log('Ошибка получения цены для', name);
        }
        
        const headerDiv = document.createElement('div');
        headerDiv.className = 'book-header';
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'book-name';
        nameDiv.textContent = name;
        headerDiv.appendChild(nameDiv);
        
        const descDiv = document.createElement('div');
        descDiv.className = 'book-desc';
        descDiv.innerHTML = desc;
        
        const footerDiv = document.createElement('div');
        footerDiv.className = 'book-footer';
        
        const levelWrapper = document.createElement('div');
        levelWrapper.className = 'book-level-wrapper';
        
        const levelInput = document.createElement('input');
        levelInput.type = 'number';
        levelInput.className = 'book-level-input';
        levelInput.value = lvl;
        levelInput.min = '0';
        levelInput.setAttribute('form', 'off');
        levelInput.setAttribute('autocomplete', 'off');
        levelInput.setAttribute('autocorrect', 'off');
        levelInput.setAttribute('spellcheck', 'false');
        
        const updateInputWidth = function() {
            const font = window.getComputedStyle(this).font;
            const width = measureTextWidth(this.value || '1', font, 2);
            this.style.width = (width + 2) + 'px';
        };
        
        levelInput.addEventListener('input', updateInputWidth);
        levelInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                this.blur();
                return false;
            }
        }, true);
        
        levelInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        }, true);
        
        levelInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        }, true);
        
        levelInput.addEventListener('blur', function() {
            updatePassiveBookLevel(name, this.value);
        });
        
        setTimeout(() => {
            const font = window.getComputedStyle(levelInput).font;
            const width = measureTextWidth(levelInput.value || '1', font, 2);
            levelInput.style.width = (width + 2) + 'px';
        }, 0);
        
        const levelUnit = document.createElement('span');
        levelUnit.className = 'book-level-unit';
        levelUnit.textContent = 'ур.';
        levelWrapper.appendChild(levelInput);
        levelWrapper.appendChild(levelUnit);
        
        const priceDiv = document.createElement('div');
        priceDiv.className = 'book-price';
        priceDiv.innerHTML = `🌕 ${priceText}`;
        
        footerDiv.appendChild(levelWrapper);
        footerDiv.appendChild(priceDiv);
        
        item.appendChild(headerDiv);
        item.appendChild(descDiv);
        item.appendChild(footerDiv);
        
        container.appendChild(item);
    }
    handlePassiveSearch();
};

window.updatePassiveBookLevel = function(name, value) {
    const savedLevels = JSON.parse(localStorage.getItem('rpg_books_levels_final_verified_v8') || '{}');
    const newLevel = parseInt(value) || 0;
    if (savedLevels[name] === newLevel) return;
    
    savedLevels[name] = newLevel;
    localStorage.setItem('rpg_books_levels_final_verified_v8', JSON.stringify(savedLevels));
    
    const items = document.querySelectorAll('#passiveBooksContainer .book-item');
    for (const item of items) {
        if (item.dataset.bookName === name.toLowerCase()) {
            const input = item.querySelector('.book-level-input');
            if (input && parseInt(input.value) !== newLevel) {
                input.value = newLevel;
                const font = window.getComputedStyle(input).font;
                const width = measureTextWidth(input.value || '1', font, 2);
                input.style.width = (width + 2) + 'px';
            }
            updatePassiveBookDescription(item, name, newLevel);
            updatePassiveBookPrice(item, name, newLevel);
            break;
        }
    }
};

function updatePassiveBookDescription(bookElement, bookName, level) {
    const data = PASSIVE_SKILLS[bookName];
    if (!data) return;
    
    let result = data.calc(level);
    let formatData;
    
    if (data.format) {
        if (typeof data.format === 'function') {
            formatData = data.format(result, level);
        } else {
            formatData = data.format;
        }
    } else {
        formatData = { result: result };
    }
    
    let desc = data.desc;
    for (const [key, val] of Object.entries(formatData)) {
        const regex = new RegExp(`\\{${key}(?::\\.2f)?\\}`, 'g');
        desc = desc.replace(regex, `<span class="book-val">${val}</span>`);
    }
    
    const descDiv = bookElement.querySelector('.book-desc');
    if (descDiv) {
        descDiv.innerHTML = desc;
    }
}

async function updatePassiveBookPrice(bookElement, bookName, level) {
    try {
        const bookPrice = await getBookPrice(bookName);
        if (bookPrice && bookPrice > 0) {
            const totalCost = calculateUpgradeCost(level, bookPrice);
            if (totalCost) {
                const priceDiv = bookElement.querySelector('.book-price');
                if (priceDiv) {
                    priceDiv.innerHTML = `🌕 ${formatGold(totalCost)}`;
                }
            }
        }
    } catch (e) {
        console.log('Ошибка обновления цены для', bookName);
    }
}

window.togglePassiveSort = function() {
    passiveSortByAlphabet = !passiveSortByAlphabet;
    const iconList = document.getElementById('passiveSortIconList');
    const iconAZ = document.getElementById('passiveSortIconAZ');
    
    if (passiveSortByAlphabet) {
        iconList.style.display = 'none';
        iconAZ.style.display = 'block';
    } else {
        iconList.style.display = 'block';
        iconAZ.style.display = 'none';
    }
    
    const searchInput = document.getElementById('passiveSearchInput');
    const currentQuery = searchInput ? searchInput.value : '';
    renderPassiveBooks().then(() => {
        if (searchInput) {
            searchInput.value = currentQuery;
            filterPassiveBooks();
        }
    });
};

window.handlePassiveSearch = function() {
    const input = document.getElementById('passiveSearchInput');
    const clearBtn = document.getElementById('clearPassiveSearchBtn');
    
    if (input.value.length > 0) {
        clearBtn.classList.add('visible');
    } else {
        clearBtn.classList.remove('visible');
    }
    filterPassiveBooks();
};

window.clearPassiveSearch = function() {
    const input = document.getElementById('passiveSearchInput');
    const clearBtn = document.getElementById('clearPassiveSearchBtn');
    input.value = '';
    clearBtn.classList.remove('visible');
    input.focus();
    filterPassiveBooks();
};

window.filterPassiveBooks = function() {
    const input = document.getElementById('passiveSearchInput');
    const query = input.value.toLowerCase().trim();
    const items = document.querySelectorAll('#passiveBooksContainer .book-item');
    let visibleCount = 0;
    
    items.forEach(item => {
        const name = item.dataset.bookName;
        if (name.startsWith(query)) {
            item.style.display = 'flex';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });
    
    const noResultsMsg = document.getElementById('passiveNoResultsMsg');
    if (visibleCount === 0) {
        noResultsMsg.style.display = 'block';
    } else {
        noResultsMsg.style.display = 'none';
    }
};

// ========== ФУНКЦИИ ДЛЯ ПАНЕЛИ МАССОВОГО ИЗМЕНЕНИЯ ==========
window.toggleBulkPanel = function(tab) {
    const panel = document.getElementById(`${tab}BulkPanel`);
    const btn = document.getElementById(`${tab}BulkBtn`);
    const input = document.getElementById(`${tab}BulkInput`);

    const isShown = panel.classList.contains('show');

    closeAllBulkPanels();

    if (!isShown) {
        panel.classList.add('show');
        btn.classList.add('active');
        input.value = '';
        setTimeout(() => input.focus(), 100);
    }
};

window.closeBulkPanel = function(tab) {
    const panel = document.getElementById(`${tab}BulkPanel`);
    const btn = document.getElementById(`${tab}BulkBtn`);
    panel.classList.remove('show');
    btn.classList.remove('active');
};

function closeAllBulkPanels() {
    ['active', 'passive'].forEach(tab => {
        const panel = document.getElementById(`${tab}BulkPanel`);
        const btn = document.getElementById(`${tab}BulkBtn`);
        panel.classList.remove('show');
        btn.classList.remove('active');
    });
}

window.applyBulkLevel = function(tab) {
    const input = document.getElementById(`${tab}BulkInput`);
    const level = parseInt(input.value);

    if (isNaN(level) || level < 0) {
        alert('Введите уровень (0 или больше)');
        return;
    }

    if (level > 9999999) {
        alert('Макс. уровень: 9999999');
        return;
    }

    if (tab === 'active') {
        applyBulkLevelToActive(level);
    } else {
        applyBulkLevelToPassive(level);
    }

    closeBulkPanel(tab);
};

function applyBulkLevelToActive(level) {
    const savedLevels = JSON.parse(localStorage.getItem('rpg_active_books_levels_final_verified_v8') || '{}');
    const items = document.querySelectorAll('#activeBooksContainer .book-item');

    items.forEach(item => {
        const bookName = item.dataset.bookName;
        const input = item.querySelector('.book-level-input');

        savedLevels[Object.keys(ACTIVE_SKILLS).find(key => key.toLowerCase() === bookName)] = level;

        if (input) {
            input.value = level;
            const font = window.getComputedStyle(input).font;
            const width = measureTextWidth(input.value || '1', font, 2);
            input.style.width = (width + 2) + 'px';
        }

        const fullName = Object.keys(ACTIVE_SKILLS).find(key => key.toLowerCase() === bookName);
        if (fullName) {
            updateActiveBookDescription(item, fullName, level);
            updateActiveBookPrice(item, fullName, level);
        }
    });

    localStorage.setItem('rpg_active_books_levels_final_verified_v8', JSON.stringify(savedLevels));
    localStorage.setItem('rpg_date_final_verified_v8', Date.now().toString());
}

function applyBulkLevelToPassive(level) {
    const savedLevels = JSON.parse(localStorage.getItem('rpg_books_levels_final_verified_v8') || '{}');
    const items = document.querySelectorAll('#passiveBooksContainer .book-item');

    items.forEach(item => {
        const bookName = item.dataset.bookName;
        const input = item.querySelector('.book-level-input');

        savedLevels[Object.keys(PASSIVE_SKILLS).find(key => key.toLowerCase() === bookName)] = level;

        if (input) {
            input.value = level;
            const font = window.getComputedStyle(input).font;
            const width = measureTextWidth(input.value || '1', font, 2);
            input.style.width = (width + 2) + 'px';
        }

        const fullName = Object.keys(PASSIVE_SKILLS).find(key => key.toLowerCase() === bookName);
        if (fullName) {
            updatePassiveBookDescription(item, fullName, level);
            updatePassiveBookPrice(item, fullName, level);
        }
    });

    localStorage.setItem('rpg_books_levels_final_verified_v8', JSON.stringify(savedLevels));
    localStorage.setItem('rpg_date_final_verified_v8', Date.now().toString());
}

// Закрытие панели при клике вне её
document.addEventListener('click', function(e) {
    if (!e.target.closest('.bulk-panel') && !e.target.closest('.bulk-level-btn')) {
        closeAllBulkPanels();
    }
});
