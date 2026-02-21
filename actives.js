// --- ФУНКЦИЯ ДЛЯ РАСЧЕТА УРОНА АКТИВНОГО УМЕНИЯ ---
function calculateActiveDamage(skillName, level, stats) {
    const skill = ACTIVE_SKILLS[skillName];
    if (!skill) return '?';
    
    try {
        // Если у умения нет calc_damage, возвращаем множитель
        if (!skill.calc_damage) {
            const mult = skill.calc_mult ? skill.calc_mult(level) : '?';
            return mult;
        }
        
        // Расчет в зависимости от умения
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
                // Для умений без прямой формулы урона
                if (skill.calc_mult) {
                    return skill.calc_mult(level);
                }
                return '?';
        }
    } catch (e) {
        console.log('Ошибка расчета для', skillName, e);
        return '?';
    }
}

// --- ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ ОПИСАНИЯ ---
function getSkillDescription(skillName, level, stats) {
    const skill = ACTIVE_SKILLS[skillName];
    if (!skill) return skillName;
    
    let desc = skill.desc;
    const damage = calculateActiveDamage(skillName, level, stats);
    
    // Заменяем все возможные плейсхолдеры
    desc = desc.replace('{damage}', `<span class="book-val">${damage}</span>`);
    desc = desc.replace('{damage}%', `<span class="book-val">${damage}%</span>`);
    
    // Для Раскола
    if (skillName === "Раскол") {
        const armorReduce = Math.floor((Math.sqrt(level*10)/100*0.5 + 1) * 30);
        desc = desc.replace('{armor_reduce}', `<span class="book-val">${armorReduce}</span>`);
    }
    
    // Для Слабого исцеления
    if (skillName === "Слабое исцеление") {
        const accuracy = Math.floor(damage / 20);
        desc = desc.replace('{accuracy}', `<span class="book-val">${accuracy}</span>`);
    }
    
    return desc;
}
