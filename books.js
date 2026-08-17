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
            desc = desc.replace('{x_percent}', `<span class="book-val editable-val" data-key="x_percent" onclick="editActiveTarget(this)">${x_percent}</span>`)
                      .replace('{max_damage}', `<span class="book-val">${max_damage}</span>`)
                      .replace('{damage}', `<span class="book-val editable-val" data-key="damage" onclick="editActiveTarget(this)">${damage}</span>`);
            break;
        case "Слабое исцеление":
            const heal_percent = Math.floor(mult / 4);
            const accuracy_reduce = Math.floor(heal_percent / 5);
            desc = desc.replace('{heal_percent}', `<span class="book-val editable-val" data-key="heal_percent" onclick="editActiveTarget(this)">${heal_percent}</span>`)
                      .replace('{accuracy_reduce}', `<span class="book-val">${accuracy_reduce}</span>`);
            break;
        case "Удар вампира":
            const regen = Math.ceil(damage / 15);
            desc = desc.replace('{regen}', `<span class="book-val">${regen}</span>`)
                      .replace('{damage}', `<span class="book-val editable-val" data-key="damage" onclick="editActiveTarget(this)">${damage}</span>`);
            break;
        case "Берсеркер":
            const berserk_percent = Math.floor((Math.sqrt(level*10)/100*1 + 1) * 50);
            desc = desc.replace('{berserk_percent}', `<span class="book-val editable-val" data-key="berserk_percent" onclick="editActiveTarget(this)">${berserk_percent}</span>`);
            break;
        case "Проклятие тьмы":
            const min_reduce = Math.floor(mult / 20);
            const max_reduce = Math.floor(mult * 3 / 20);
            const max_units = stats.lvl * 10;
            desc = desc.replace('{min_reduce}', `<span class="book-val">${min_reduce}</span>`)
                      .replace('{max_reduce}', `<span class="book-val editable-val" data-key="max_reduce" onclick="editActiveTarget(this)">${max_reduce}</span>`)
                      .replace('{max_units}', `<span class="book-val">${max_units}</span>`);
            break;
        case "Целебный огонь":
            const heal_percent_fire = Math.floor((Math.sqrt(level*10)/100*0.5 + 1) * 20);
            const max_heal = stats.lvl * 50;
            desc = desc.replace(/{heal_percent}/g, `<span class="book-val editable-val" data-key="heal_percent" onclick="editActiveTarget(this)">${heal_percent_fire}</span>`)
                      .replace('{max_heal}', `<span class="book-val">${max_heal}</span>`);
            break;
        case "Слепота":
            desc = desc.replace('{damage}', `<span class="book-val editable-val" data-key="mult" onclick="editActiveTarget(this)">${mult}</span>`);
            break;
        case "Раскол":
            const armor_reduce = Math.floor((Math.sqrt(level*10)/100*0.5 + 1) * 30);
            desc = desc.replace('{armor_reduce}', `<span class="book-val">${armor_reduce}</span>`)
                      .replace('{damage}', `<span class="book-val editable-val" data-key="damage" onclick="editActiveTarget(this)">${damage}</span>`);
            break;
        default:
            desc = desc.replace('{damage}', `<span class="book-val editable-val" data-key="damage" onclick="editActiveTarget(this)">${damage}</span>`);
    }
    return desc;
}

// === ЦЕЛЬ для активок: клик по урону → подбор уровня книги (статы из профиля не трогаем) ===
function findLevelForActiveTarget(skillName, targetDamage, stats) {
    const getDmg = (lvl) => calculateActiveDamage(skillName, lvl, stats);
    const MAX = 9999999;
    // Цель выше достижимого — ставим максимум, доступный в приложении
    if (getDmg(MAX) < targetDamage) return MAX;
    let lo = 0, hi = MAX, res = null;
    for (let i = 0; i < 64 && lo <= hi; i++) {
        const mid = Math.floor((lo + hi) / 2);
        if (getDmg(mid) >= targetDamage) { res = mid; hi = mid - 1; } else { lo = mid + 1; }
    }
    return res;
}

// Значение %-эффекта активки на уровне (для активок без урона)
function activePercentValue(skillName, key, level) {
    const skill = ACTIVE_SKILLS[skillName];
    const mult = (skill && skill.calc) ? skill.calc(level) : 0;
    switch (skillName + '|' + key) {
        case 'Слепота|mult': return mult;
        case 'Берсеркер|berserk_percent': return Math.floor((Math.sqrt(level*10)/100*1 + 1) * 50);
        case 'Целебный огонь|heal_percent': return Math.floor((Math.sqrt(level*10)/100*0.5 + 1) * 20);
        case 'Слабое исцеление|heal_percent': return Math.floor(mult / 4);
        case 'Проклятие тьмы|max_reduce': return Math.floor(mult * 3 / 20);
        case 'Проклятие тьмы|min_reduce': return Math.floor(mult / 20);
        case 'Расправа|x_percent': {
            const rounded = Math.floor((Math.sqrt(level*10)/100 + 1) * 100) / 100;
            return Math.floor(rounded * 50);
        }
        default: return null;
    }
}

function findLevelForActivePercent(skillName, key, target) {
    const getV = (lvl) => activePercentValue(skillName, key, lvl);
    const MAX = 9999999;
    const top = getV(MAX);
    if (top == null) return null;
    // Цель выше достижимого — ставим максимум, доступный в приложении
    if (top < target) return MAX;
    let lo = 0, hi = MAX, res = null;
    for (let i = 0; i < 64 && lo <= hi; i++) {
        const mid = Math.floor((lo + hi) / 2);
        if (getV(mid) >= target) { res = mid; hi = mid - 1; } else { lo = mid + 1; }
    }
    return res;
}

window.editActiveTarget = function(spanEl) {
    const item = spanEl.closest('.book-item');
    const bookName = item ? item.dataset.bookExact : null;
    const key = spanEl.dataset.key;
    if (!bookName || !ACTIVE_SKILLS[bookName]) return;
    if (spanEl.querySelector('input')) return;

    const current = spanEl.textContent;
    const input = document.createElement('input');
    input.type = 'number';
    input.value = current;
    input.className = 'book-val-input';
    const fit = () => { input.style.width = (measureTextWidth(input.value || '1', window.getComputedStyle(input).font) + 2) + 'px'; };
    input.maxLength = 7;
    input.addEventListener('input', function() {
        // Живое ограничение цели: максимум 7 знаков
        if (this.value.length > 7) this.value = this.value.slice(0, 7);
        fit();
    });
    spanEl.textContent = '';
    spanEl.appendChild(input);
    fit(); input.focus(); input.select();

    let done = false;
    const KEY = 'rpg_active_books_levels_final_verified_v8';
    const savedLvl = () => { const sl = JSON.parse(localStorage.getItem(KEY) || '{}'); return sl[bookName] || 0; };
    const restore = () => { if (item) updateActiveBookDescription(item, bookName, savedLvl()); };
    const applyLevel = (level) => {
        const sl = JSON.parse(localStorage.getItem(KEY) || '{}');
        sl[bookName] = level;
        localStorage.setItem(KEY, JSON.stringify(sl));
        if (item) {
            const inp = item.querySelector('.book-level-input');
            if (inp) { inp.value = level; const f = window.getComputedStyle(inp).font; inp.style.width = (measureTextWidth(inp.value || '1', f, 2) + 2) + 'px'; }
            updateActiveBookDescription(item, bookName, level);
            updateActiveBookPrice(item, bookName, level);
        }
    };
    const finish = () => {
        if (done) return; done = true;
        const target = parseFloat(input.value.replace(',', '.'));
        if (isNaN(target)) { restore(); return; }
        const level = (key === 'damage')
            ? findLevelForActiveTarget(bookName, target, getStatsFromProfile())
            : findLevelForActivePercent(bookName, key, target);
        if (level == null) { restore(); return; }
        applyLevel(level);
    };
    input.onblur = finish;
    input.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); input.blur(); } };
};

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
    input.maxLength = 5;
    input.max = '99999';

    // input встраиваем в ряд (авто-ширина) — название сдвигается вместе с числом, без перекрытия
    input.style.position = 'static';
    input.style.width = 'auto';
    input.style.height = 'auto';
    input.style.flexShrink = '0';
    const fitWidth = function() {
        const w = measureTextWidth(input.value || '1', window.getComputedStyle(input).font);
        input.style.width = (w + 2) + 'px';
        input.style.marginRight = '-2px';
    };
    input.addEventListener('input', function() {
        if (this.value.length > 5) {
            this.value = this.value.slice(0, 5);
        }
        fitWidth();
    });

    valueSpan.style.display = 'none';
    // название стата остаётся видимым и сдвигается вместе с числом
    if (labelSpan) valueContainer.insertBefore(input, labelSpan);
    else valueContainer.appendChild(input);
    fitWidth();
    input.focus();
    input.select();
    
    const finish = () => {
        let newVal = input.value;
        if (newVal === '') newVal = '0';
        
        let finalValue = newVal;
        const num = parseFloat(newVal);
        if (!isNaN(num)) {
            if (num > 99999) finalValue = '99999';
            else finalValue = Math.floor(num).toString();
        }

        if (statKey === 'str' || statKey === 'agi' || statKey === 'vit') {
            if (parseInt(finalValue) < 3) finalValue = '3';
        }
        
        valueSpan.textContent = finalValue;
        valueSpan.style.display = '';
        if (labelSpan) labelSpan.style.visibility = 'visible';
        input.remove();
        
        const profileStat = document.querySelector(`.stat-value[data-key="${statKey}"]`);
        if (profileStat) {
            profileStat.textContent = finalValue;
        }
        
        const items = document.querySelectorAll('#activeBooksContainer .book-item');
        const stats = getStatsFromProfile();
        items.forEach(item => {
            const bookName = item.querySelector('.book-name').textContent;
            const level = parseInt(item.querySelector('.book-level-input').value) || 0;
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

// Подтягивает свежие цены и обновляет их в уже отрисованном списке (не блокирует рендер)
async function refreshPricesInList(kind) {
    const data = await loadPricesData();
    if (!data) return;
    const sel = (kind === 'active') ? '#activeBooksContainer .book-item' : '#passiveBooksContainer .book-item';
    document.querySelectorAll(sel).forEach(item => {
        const name = item.dataset.bookExact;
        const input = item.querySelector('.book-level-input');
        const lvl = parseInt(input && input.value) || 0;
        const price = getBookPriceSync(name);
        const div = item.querySelector('.book-price');
        if (!div) return;
        const total = (price && price > 0) ? calculateUpgradeCost(lvl, price) : null;
        div.innerHTML = '🌕 ' + (total ? formatGold(total) : '0');
    });
}

window.updateActiveBookLevel = function(name, value) {
    const savedLevels = JSON.parse(localStorage.getItem('rpg_active_books_levels_final_verified_v8') || '{}');
    const newLevel = parseInt(value) || 0;
    if (savedLevels[name] === newLevel) return;
    
    savedLevels[name] = newLevel;
    localStorage.setItem('rpg_active_books_levels_final_verified_v8', JSON.stringify(savedLevels));
    if (typeof updateEquipLevels === 'function') updateEquipLevels();
    
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
            const priceDiv = bookElement.querySelector('.book-price');
            if (priceDiv) {
                priceDiv.innerHTML = `🌕 ${totalCost ? formatGold(totalCost) : '0'}`;
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
        item.dataset.bookExact = name;
        
        let priceText = '0';
        const bookPrice = getBookPriceSync(name);
        if (bookPrice && bookPrice > 0) {
            const totalCost = calculateUpgradeCost(lvl, bookPrice);
            if (totalCost) priceText = formatGold(totalCost);
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
            // Живое ограничение уровня книги: максимум 7 знаков (при вводе, а не только после)
            if (this.value.length > 7) {
                this.value = this.value.slice(0, 7);
            }
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
    refreshPricesInList('active');
    if (typeof updateEquipLevels === 'function') updateEquipLevels();
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
            desc = desc.replace(regex, `<span class="book-val editable-val" data-key="${key}" onclick="editPassiveTarget(this)">${val}</span>`);
        }
        
        const item = document.createElement('div');
        item.className = 'book-item';
        item.dataset.bookName = name.toLowerCase();
        item.dataset.bookExact = name;
        
        let priceText = '0';
        const bookPrice = getBookPriceSync(name);
        if (bookPrice && bookPrice > 0) {
            const totalCost = calculateUpgradeCost(lvl, bookPrice);
            if (totalCost) priceText = formatGold(totalCost);
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
            // Живое ограничение уровня книги: максимум 7 знаков (при вводе, а не только после)
            if (this.value.length > 7) {
                this.value = this.value.slice(0, 7);
            }
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
        
        leftGroup.appendChild(levelWrapper);
        
        const priceDiv = document.createElement('div');
        priceDiv.className = 'book-price';
        priceDiv.innerHTML = `🌕 ${priceText}`;
        
        footerDiv.appendChild(leftGroup);
        footerDiv.appendChild(priceDiv);
        
        item.appendChild(headerDiv);
        item.appendChild(descDiv);
        item.appendChild(footerDiv);
        
        container.appendChild(item);
    }
    refreshPricesInList('passive');
    if (typeof updateEquipLevels === 'function') updateEquipLevels();
    handlePassiveSearch();
};

window.updatePassiveBookLevel = function(name, value) {
    const savedLevels = JSON.parse(localStorage.getItem('rpg_books_levels_final_verified_v8') || '{}');
    const newLevel = parseInt(value) || 0;
    if (savedLevels[name] === newLevel) return;
    
    savedLevels[name] = newLevel;
    localStorage.setItem('rpg_books_levels_final_verified_v8', JSON.stringify(savedLevels));
    if (typeof updateEquipLevels === 'function') updateEquipLevels();
    
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

// === ЦЕЛЬ: клик по значению эффекта пассивки → подбор уровня под это значение ===
function _savedPassiveLevel(name) {
    const sl = JSON.parse(localStorage.getItem('rpg_books_levels_final_verified_v8') || '{}');
    return sl[name] || 0;
}

function findLevelByTargetPassive(bookName, key, target) {
    const skill = PASSIVE_SKILLS[bookName];
    if (!skill) return null;
    const getVal = (lvl) => {
        const r = skill.calc(lvl);
        return (r && typeof r === 'object') ? r[key] : r;
    };
    const MAX = 9999999;
    const increasing = getVal(MAX) >= getVal(1);
    // Цель за пределом возможного — ставим максимум (значение упрётся в кап книги)
    const limit = getVal(MAX);
    if (increasing ? (target > limit) : (target < limit)) return MAX;
    let lo = 0, hi = MAX, res = null;
    for (let i = 0; i < 64 && lo <= hi; i++) {
        const mid = Math.floor((lo + hi) / 2);
        const eff = getVal(mid);
        const reached = increasing ? (eff >= target) : (eff <= target);
        if (reached) { res = mid; hi = mid - 1; } else { lo = mid + 1; }
    }
    return res;
}

window.editPassiveTarget = function(spanEl) {
    const item = spanEl.closest('.book-item');
    const bookName = item ? item.dataset.bookExact : null;
    const key = spanEl.dataset.key;
    if (!bookName || !PASSIVE_SKILLS[bookName]) return;
    if (spanEl.querySelector('input')) return;
    const current = spanEl.textContent;
    const input = document.createElement('input');
    input.type = 'number';
    input.value = current;
    input.className = 'book-val-input';
    const fit = () => {
        const w = measureTextWidth(input.value || '1', window.getComputedStyle(input).font);
        input.style.width = (w + 2) + 'px';
    };
    input.maxLength = 7;
    input.addEventListener('input', function() {
        // Живое ограничение цели: максимум 7 знаков
        if (this.value.length > 7) this.value = this.value.slice(0, 7);
        fit();
    });
    spanEl.textContent = '';
    spanEl.appendChild(input);
    fit();
    input.focus();
    input.select();

    let done = false;
    const applyLevel = (level) => {
        const sl = JSON.parse(localStorage.getItem('rpg_books_levels_final_verified_v8') || '{}');
        sl[bookName] = level;
        localStorage.setItem('rpg_books_levels_final_verified_v8', JSON.stringify(sl));
        if (item) {
            const inp = item.querySelector('.book-level-input');
            if (inp) {
                inp.value = level;
                const f = window.getComputedStyle(inp).font;
                inp.style.width = (measureTextWidth(inp.value || '1', f, 2) + 2) + 'px';
            }
            updatePassiveBookDescription(item, bookName, level);
            updatePassiveBookPrice(item, bookName, level);
        }
    };
    const restore = () => { if (item) updatePassiveBookDescription(item, bookName, _savedPassiveLevel(bookName)); };
    const finish = () => {
        if (done) return; done = true;
        const target = parseFloat(input.value.replace(',', '.'));
        if (isNaN(target)) { restore(); return; }
        const level = findLevelByTargetPassive(bookName, key, target);
        if (level == null) { restore(); return; }
        applyLevel(level);
    };
    input.onblur = finish;
    input.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); input.blur(); } };
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
        desc = desc.replace(regex, `<span class="book-val editable-val" data-key="${key}" onclick="editPassiveTarget(this)">${val}</span>`);
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
            const priceDiv = bookElement.querySelector('.book-price');
            if (priceDiv) {
                priceDiv.innerHTML = `🌕 ${totalCost ? formatGold(totalCost) : '0'}`;
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
    if (typeof updateEquipLevels === 'function') updateEquipLevels();
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
    if (typeof updateEquipLevels === 'function') updateEquipLevels();
}

// Закрытие панели при клике вне её
document.addEventListener('click', function(e) {
    if (!e.target.closest('.bulk-panel') && !e.target.closest('.bulk-level-btn')) {
        closeAllBulkPanels();
    }
});
