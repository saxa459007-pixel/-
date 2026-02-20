// passives.js - Формулы пассивных умений (синхронизированы с passives.py)

const PASSIVE_SKILLS = {
    "незаметность": {
        "calc": function(lvl) {
            return Math.floor((Math.sqrt(lvl*10)/100*1 + 1) * 50);
        },
        "desc": "Развивает скрытность персонажа, увеличивая шансы прокрасться в PvE и шансы первого хода в PvP на {result}%.",
        "displayDivide": false
    },
    "быстрое восстановление": {
        "calc": function(lvl) {
            return Math.floor((Math.sqrt(lvl*10)/100*1 + 1) * 100);
        },
        "desc": "Снижение шанса травмы/боя при отдыхе в {result_div} раз.",
        "displayDivide": true
    },
    "мародер": {
        "calc": function(lvl) {
            return Math.floor(Math.sqrt(lvl*10) / 2);
        },
        "desc": "+{result}% к получаемым трофеям.",
        "displayDivide": false
    },
    "внимательность": {
        "calc": function(lvl) {
            return Math.floor((Math.sqrt(lvl*10)/100*1 + 1) * 100);
        },
        "desc": "Шанс нахождения позитивных событий при исследовании увеличен в {result_div} раз.",
        "displayDivide": true
    },
    "инициативность": {
        "calc": function(lvl) {
            return Math.floor((Math.sqrt(lvl*10)/100*1 + 1) * 100);
        },
        "desc": "Шанс получения книг и страниц при любой добыче увеличен в {result_div} раз.",
        "displayDivide": true
    },
    "исследователь": {
        "calc": function(lvl) {
            return Math.floor((Math.sqrt(lvl*10)/100*1 + 1) * 100 / 100 * 2 - 0.01);
        },
        "desc": "Шанс встретить любого противника в подземелье уменьшен в {result:.2f} раз.",
        "displayDivide": false
    },
    "ведьмак": {
        "calc": function(lvl) {
            return Math.floor((Math.sqrt(lvl*10)/100*1 + 1) * 100 / 100 * 30);
        },
        "desc": "Эффекты боевых и лечебных зелий повышены на {result}%.",
        "displayDivide": false
    },
    "собиратель": {
        "calc": function(lvl) {
            return Math.floor((Math.sqrt(lvl*10)/100*1 + 1) * 100 / 100 * 20);
        },
        "desc": "Шанс найти любые собираемые предметы на локациях и получить ценную добычу в бою повышен на {result}%.",
        "displayDivide": false
    },
    "запасливость": {
        "calc": function(lvl) {
            return Math.floor(0.24624 * Math.sqrt(lvl*10) + 49.606);
        },
        "desc": "Шанс найти полезные травы повышен на {result}%.",
        "displayDivide": false
    },
    "охотник за головами": {
        "calc": function(lvl) {
            const base = Math.floor((Math.sqrt(lvl*10)/100*1 + 1) * 100);
            return {
                result: base,
                elite_bonus: Math.floor(base * 0.5)
            };
        },
        "desc": "Шанс встретить хранителя прохода повышен на {result}%. Шанс встретить элитных противников повышен на {elite_bonus}%.",
        "displayDivide": false
    },
    "подвижность": {
        "calc": function(lvl) {
            return Math.floor((Math.sqrt(lvl*10)/100*1 + 1) * 100 / 100 * 10);
        },
        "desc": "В бою у Вас есть дополнительный шанс увернуться от атаки противника +{result}%.",
        "displayDivide": false
    },
    "упорность": {
        "calc": function(lvl) {
            return Math.floor((Math.sqrt(lvl*10)/100*1 + 1) * 100);
        },
        "desc": "Снижение времени отката в {result_div} раз.",
        "displayDivide": true
    },
    "регенерация": {
        "calc": function(lvl) {
            return Math.floor((Math.sqrt(lvl*10)/100*1 + 1) * 200);
        },
        "desc": "Каждый ход в бою Вы восстанавливаете здоровье в размере {result:.2f}% от максимального.",
        "displayDivide": false
    },
    "расчетливость": {
        "calc": function(lvl) {
            return Math.floor((Math.sqrt(lvl*10)/100*0.5 + 1) * 100 / 100 * 10);
        },
        "desc": "Шанс {result}%, что использование умения не вызовет откат.",
        "displayDivide": false
    },
    "презрение к боли": {
        "calc": function(lvl) {
            return Math.floor((Math.sqrt(lvl*10)/100*1 + 1) * 100);
        },
        "desc": "Снижение эффекта травм еще в {result_div} раз.",
        "displayDivide": true
    },
    "ошеломление": {
        "calc": function(lvl) {
            return Math.floor((Math.sqrt(lvl*10)/100*1 + 1) * 100 / 100 * 15);
        },
        "desc": "Снижение концентрации противника в бою на {result}% от изначальной.",
        "displayDivide": false
    },
    "рыбак": {
        "calc": function(lvl) {
            return Math.floor((Math.sqrt(lvl*10)/100*0.5 + 1) * 100);
        },
        "desc": "Вес рыбы увеличен в {result:.2f} раз.",
        "displayDivide": true
    },
    "неуязвимый": {
        "calc": function(lvl) {
            return Math.floor(3 + ((Math.sqrt(lvl*10)/100*0.6 + 1) * 100 / 100 * 30));
        },
        "desc": "Повышает на {result}% вероятность заблокировать внезапный удар противника (PvE).",
        "displayDivide": false
    },
    "колющий удар": {
        "calc": function(lvl) {
            return Math.floor((Math.sqrt(lvl*10)/100 * (2/3) + 1) * 30);
        },
        "desc": "Стойка, увеличивающая максимальный разброс урона на {result}% и уменьшающая точность на 15%.",
        "displayDivide": false
    },
    "бесстрашие": {
        "calc": function(lvl) {
            const base = Math.floor((Math.sqrt(lvl*10)/100*1 + 1) * 100);
            const contraband_mult = (base / 100 * 1.5).toFixed(2);
            return {
                result: (base / 100).toFixed(2),
                contraband_mult: contraband_mult
            };
        },
        "desc": "Шанс встретить противника в подземелье повышен в {result} раза. Шанс встретить целебный источник повышен в {result} раза. Шанс встретить контрабандиста повышен в {contraband_mult} раза.",
        "displayDivide": false
    },
    "режущий удар": {
        "calc": function(lvl) {
            return Math.floor((Math.sqrt(lvl*10)/100*0.5 + 1) * 100 / 100 * 20);
        },
        "desc": "Стойка, увеличивающая точность на {result}% и уменьшающая верхний порог разброса урона в 2 раза.",
        "displayDivide": false
    },
    "феникс": {
        "calc": function(lvl) {
            const pve = Math.floor(90 - 40 / (1 + Math.sqrt(lvl / 1000)));
            const pvp = Math.floor(pve * 0.5);
            return {
                result: pve,
                pvp_result: pvp
            };
        },
        "desc": "При получении смертельного урона - с вероятностью в {result}% ({pvp_result}% в PvP) Вы останетесь живы с 1 НР.",
        "displayDivide": false
    },
    "непоколебимый": {
        "calc": function(lvl) {
            return Math.floor((Math.sqrt(lvl*10)/100*1 + 1) * 100 / 100 * 20);
        },
        "desc": "Повышение собственной концентрации в бою на {result}% от изначальной.",
        "displayDivide": false
    },
    "суеверность": {
        "calc": function(lvl) {
            return Math.floor((Math.sqrt(lvl*10)/100*1 + 1) * 100);
        },
        "desc": "Шанс получения колец в добыче повышен в {result_div} раз.",
        "displayDivide": true
    },
    "гладиатор": {
        "calc": function(lvl) {
            return Math.floor(Math.sqrt(lvl*2.5));
        },
        "desc": "Повышение урона от параметра атаки на {result}%.",
        "displayDivide": false
    },
    "воздаяние": {
        "calc": function(lvl) {
            return Math.floor((Math.sqrt(lvl*10)/100*1 + 1) * 100);
        },
        "desc": "Множитель бонуса {result}%.",
        "displayDivide": false
    },
    "ученик": {
        "calc": function(lvl) {
            return Math.floor((Math.sqrt(lvl*10)/100*1 + 1) * 100 / 100 * 50);
        },
        "desc": "Шанс прокачки всех характеристик в бою увеличен на {result}%.",
        "displayDivide": false
    },
    "прочность": {
        "calc": function(lvl) {
            return Math.floor(80 - 50 / (1 + Math.sqrt(lvl / 1000)));
        },
        "desc": "Снижает эффективность раскола Вашей брони на {result}%.",
        "displayDivide": false
    },
    "расторопность": {
        "calc": function(lvl) {
            return Math.floor((Math.sqrt(lvl*10)/100*1 + 1) * 100 * 2/100);
        },
        "desc": "Снижает время на добычу руды, разбор завалов и ныряние за осколками в {result_div} раз.",
        "displayDivide": true
    },
    "устрашение": {
        "calc": function(lvl) {
            return Math.floor((10 + 90.1793 * (1 - Math.exp(-0.00332238 * Math.sqrt(lvl)))) * 100) / 100;
        },
        "desc": "Уменьшает максимальное здоровье противников на {result:.2f}% (только в PvE).\n⚠️ Формула имеет погрешность 0.01%",
        "displayDivide": false
    },
    "контратака": {
        "calc": function(lvl) {
            return Math.floor((Math.sqrt(lvl*10)/100*1 + 1) * 100 / 100 * 10);
        },
        "desc": "Усиление урона от параметра атаки на {result}% со следующего хода после каждого успешного уклонения в течение боя.",
        "displayDivide": false
    },
    "дробящий удар": {
        "calc": function(lvl) {
            const val = Math.floor(10 + 20 / ((Math.sqrt(lvl*10)/100*1 + 1)));
            return {
                result: val,
                result_div: (val / 10).toFixed(2)
            };
        },
        "desc": "Стойка, уменьшающая урон от обычных атак на {result}%. Уменьшение коэффициента штрафа в {result_div} раз.",
        "displayDivide": false
    },
    "защитная стойка": {
        "calc": function(lvl) {
            return Math.floor((Math.sqrt(lvl*10)/100*1 + 1) * 100 * 15 / 100);
        },
        "desc": "Стойка, увеличивающая поглощение урона за счет брони персонажа на {result}%.",
        "displayDivide": false
    },
    "стойка сосредоточения": {
        "calc": function(lvl) {
            return Math.floor((Math.sqrt(lvl*10)/100*0.5 + 1) * 100 / 100 * 20);
        },
        "desc": "Стойка, увеличивающая эффект концентрации на {result}%.",
        "displayDivide": false
    },
    "водохлеб": {
        "calc": function(lvl) {
            return Math.floor((Math.sqrt(lvl*10)/100*1 + 1) * 100 / 100 * 15);
        },
        "desc": "Эффект концентрации для использования зелий повышен на {result}%.",
        "displayDivide": false
    },
    "картограф": {
        "calc": function(lvl) {
            return Math.floor(9 + ((Math.sqrt(lvl*10)/100*5 + 1) * 100 / 100));
        },
        "desc": "В {result} раз повышает шанс зарисовать карта к встреченному событию.",
        "displayDivide": false
    },
    "браконьер": {
        "calc": function(lvl) {
            return Math.floor((Math.sqrt(lvl*10)/100*1 + 1) * 100);
        },
        "desc": "{result}% репутации с дополнительной добычи при ее сдаче.",
        "displayDivide": false
    },
    "парирование": {
        "calc": function(lvl) {
            return Math.floor(5 + ((Math.sqrt(lvl*10)/100*2.5 + 1) * 100 / 100 * 2));
        },
        "desc": "Шанс {result}% парировать обычную атаку противника, не получив урона.",
        "displayDivide": false
    },
    "ловкость рук": {
        "calc": function(lvl) {
            return Math.floor((Math.sqrt(lvl*10)/100*0.5 + 1) * 100 / 100 * 20);
        },
        "desc": "Шанс {result}% не потратить время дополнительного действия в бою.",
        "displayDivide": false
    },
    "атлетика": {
        "calc": function(lvl) {
            return Math.floor(5 + ((Math.sqrt(lvl*10)/100*1.5 + 1) * 100 / 100 * 10));
        },
        "desc": "Улучшает физические способности персонажа, увеличивая эффект и урон от силы персонажа на {result}%.",
        "displayDivide": false
    },
    "устойчивость": {
        "calc": function(lvl) {
            return Math.floor(190 + ((Math.sqrt(lvl*10)/100*5 + 1) * 10));
        },
        "desc": "Увеличивает устойчивость персонажа к периодическому урону, уменьшая получаемый урон от кровотечения и отравления на {result}%.",
        "displayDivide": false
    },
    "угроза": {
        "calc": function(lvl) {
            return Math.floor((Math.sqrt(lvl*10)/100*1 + 1) * 100 / 100 * 25);
        },
        "desc": "Первый найденный при исследовании противник с вероятностью {result}% призовет подмогу перед началом боя.",
        "displayDivide": false
    },
    "знания древних": {
        "calc": function(lvl) {
            return Math.floor(((Math.sqrt(lvl*10)/100*40 + 1) * 100 / 100) / 2.1);
        },
        "desc": "Вероятность прокачки активных умений при их использовании в бою повышается на {result}%.",
        "displayDivide": false
    },
    "еретик": {
        "calc": function(lvl) {
            return Math.floor((15 + 0.75 * Math.sqrt(lvl / 10)) * 100) / 100;
        },
        "desc": "Ваши исцеляющие навыки позволяют наносить урон в размере {result:.2f}% от Вашего исцеления.",
        "displayDivide": false
    },
    "барьер": {
        "calc": function(lvl) {
            const effect1 = Math.floor(20 + 2 * Math.sqrt(lvl / 10));
            const effect2 = Math.floor(20 + Math.sqrt(lvl / 10));
            return {
                effect1: effect1,
                effect2: effect2
            };
        },
        "desc": "Ваши исцеляющие или восстанавливающие навыки позволяют создавать барьер, поглощающий большую часть источников урона в размере {effect1}% от Вашего исцеления свыше максимального здоровья. Максимальный размер барьера увеличивается на {effect2}% от Вашего максимального здоровья.",
        "displayDivide": false
    }
};