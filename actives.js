// actives.js - Формулы активных умений

function floor(x) {
    return Math.floor(x);
}

function excel_round_down(x) {
    return Math.floor(x * 100) / 100;
}

const ACTIVE_SKILLS = {
    "Грязный удар": {
        "calc": function(lvl) {
            return floor((Math.sqrt(lvl*10)/100*1 + 1) * 100);
        },
        "calc_damage": function(lvl, dex, str) {
            return floor((0.667*dex + 0.333*str) * ((Math.sqrt(lvl*10)/100*1 + 1)));
        },
        "desc": "Вы наносите внезапный удар кулаком. Урон (~{damage}✦) зависит значительно от ловкости и менее значительно от силы персонажа. Игнорирует броню.",
        "params": ["agi", "str"]
    },
    "Слабое исцеление": {
        "calc": function(lvl) {
            return floor((Math.sqrt(lvl*10)/100*1 + 1) * 100);
        },
        "calc_damage": function(lvl, vit) {
            return floor((vit / 3) * ((Math.sqrt(lvl*10)/100*1 + 1)));
        },
        "desc": "Вы восстанавливаете {damage} HP, на столько же снижая кровотечение, и дезориентируете врага, снижая его точность на {accuracy}% до конца боя.",
        "params": ["vit"]
    },
    "Удар вампира": {
        "calc": function(lvl) {
            return floor((Math.sqrt(lvl*10)/100*1 + 1) * 100);
        },
        "calc_damage": function(lvl, agi, vit) {
            return floor(0.4 * (agi + vit) * ((Math.sqrt(lvl*10)/100*1 + 1)));
        },
        "desc": "Сблизившись с противником, Вы наносите урон (~{damage}✦), зависящий от ловкости и выносливости персонажа в равной степени, и восстанавливаете здоровье в размере половина от нанесенного урона.",
        "params": ["agi", "vit"]
    },
    "Мощный удар": {
        "calc": function(lvl) {
            return floor((Math.sqrt(lvl*10)/100*1 + 1) * 100);
        },
        "calc_damage": function(lvl, str, atk) {
            return floor((2.4*str + 0.8*atk) * ((Math.sqrt(lvl*10)/100*1 + 1)));
        },
        "desc": "Вы наносите серьёзный урон (~{damage}✧), зависящий очень значительно от силы и незначительно от атаки персонажа.",
        "params": ["str", "atk"]
    },
    "Сила теней": {
        "calc": function(lvl) {
            return floor((Math.sqrt(lvl*10)/100*1 + 1) * 100);
        },
        "calc_damage": function(lvl, char_lvl) {
            return floor(char_lvl * ((Math.sqrt(lvl*10)/100*1 + 1) * 1.5));
        },
        "desc": "Используя тьму вокруг, Вы наносите противнику случайный урон (~{damage}✦), равный от текущего до удвоенного текущего уровня персонажа.",
        "params": ["lvl"]
    },
    "Расправа": {
        "calc": function(lvl) {
            return floor(excel_round_down((Math.sqrt(lvl*10)/100*1 + 1)) * 100);
        },
        "calc_damage": function(lvl, char_lvl) {
            const mult = excel_round_down((Math.sqrt(lvl*10)/100*1 + 1));
            return Math.min(
                floor(char_lvl * mult),
                char_lvl * 50
            );
        },
        "desc": "Вы наносите разовый урон в размере {damage}✧ от недостающего здоровья противника.",
        "params": ["lvl"]
    },
    "Слепота": {
        "calc": function(lvl) {
            return floor((Math.sqrt(lvl*10)/100*0.5 + 1) * 100);
        },
        "calc_damage": null,
        "desc": "Вы ослепляете противника сроком на 1 ход. Множитель урона точного удара: {damage}%",
        "params": []
    },
    "Рассечение": {
        "calc": function(lvl) {
            return floor((Math.sqrt(lvl*10)/100*1 + 1) * 100);
        },
        "calc_damage": function(lvl, atk, agi) {
            return floor((0.63*atk + 0.63*agi) * ((Math.sqrt(lvl*10)/100*1 + 1)));
        },
        "desc": "Вы наносите урон (~{damage}✧), зависящий от атаки и ловкости персонажа в равной степени.",
        "params": ["atk", "agi"]
    },
    "Берсеркер": {
        "calc": function(lvl) {
            return floor((Math.sqrt(lvl*10)/100*1 + 1) * 100);
        },
        "calc_damage": null,
        "desc": "Впадая в ярость, Вы наносите разовый урон в размере {damage}%✧ от Вашего недостающего здоровья.",
        "params": []
    },
    "Таран": {
        "calc": function(lvl) {
            return floor((Math.sqrt(lvl*10)/100*1 + 1) * 100);
        },
        "calc_damage": function(lvl, armor) {
            return floor(2.15 * armor * ((Math.sqrt(lvl*10)/100*1 + 1)));
        },
        "desc": "Разогнавшись, Вы наносите урон (~{damage}✦), зависящий от брони персонажа.",
        "params": ["armor"]
    },
    "Проклятие тьмы": {
        "calc": function(lvl) {
            return floor((Math.sqrt(lvl*10)/100*1 + 1) * 100);
        },
        "calc_damage": null,
        "desc": "Вы проклинаете противника, уменьшая его атаку на {damage}%.",
        "params": ["lvl"]
    },
    "Огонек надежды": {
        "calc": function(lvl) {
            return floor((Math.sqrt(lvl*10)/100*1 + 1) * 100);
        },
        "calc_damage": function(lvl, vit) {
            return floor((vit / 3) * ((Math.sqrt(lvl*10)/100*1 + 1)));
        },
        "desc": "Вы исцеляетесь на случайную величину (~{damage}), зависящую от параметра выносливости персонажа.",
        "params": ["vit"]
    },
    "Целебный огонь": {
        "calc": function(lvl) {
            return floor((Math.sqrt(lvl*10)/100*0.5 + 1) * 100);
        },
        "calc_damage": null,
        "desc": "Вы наносите {damage}% урона✦ от текущего НР противника и исцеляетесь на {damage}% от своего потерянного здоровья.",
        "params": ["lvl"]
    },
    "Кровотечение": {
        "calc": function(lvl) {
            return floor((Math.sqrt(lvl*10)/100*1 + 1) * 100);
        },
        "calc_damage": function(lvl, atk, agi) {
            return floor((0.125*atk + 0.125*agi) * ((Math.sqrt(lvl*10)/100*1 + 1)));
        },
        "desc": "Вы пускаете противнику кровь, заставляя его терять здоровье (~{damage}✦) каждый ход до конца боя.",
        "params": ["atk", "agi"]
    },
    "Заражение": {
        "calc": function(lvl) {
            return floor((Math.sqrt(lvl*10)/100*1 + 1) * 100);
        },
        "calc_damage": function(lvl, vit) {
            return floor(vit * ((Math.sqrt(lvl*10)/100*1 + 1)));
        },
        "desc": "Вы наносите урон (~{damage}✦), зависящий от текущего количества травм и выносливости персонажа.",
        "params": ["vit"]
    },
    "Раскол": {
        "calc": function(lvl) {
            return floor((Math.sqrt(lvl*10)/100*0.5 + 1) * 100);
        },
        "calc_damage": function(lvl, agi) {
            return floor(0.65 * agi * ((Math.sqrt(lvl*10)/100*1 + 1)));
        },
        "desc": "Вы снижаете броню противника на {armor_reduce}% от текущей до конца боя, а затем наносите урон (~{damage}✧), зависящий от ловкости персонажа.",
        "params": ["agi"]
    }
};
