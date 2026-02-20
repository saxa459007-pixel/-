// prices.js - Получение цен книг из GitHub Gist

const PRICE_CACHE = {};
const CACHE_DURATION = 3600000; // 1 час в миллисекундах

// URL к Gist с ценами (ТОТ ЖЕ, ЧТО В БОТЕ)
const GIST_URL = "https://gist.githubusercontent.com/saxa459007-pixel/45fd999aa7ad102f78209501450e6aa6/raw/book_prices.json";

// ID книг (синхронизировано с book_price_parser.py)
const BOOK_IDS = {
    // Активные умения
    "грязный удар": 13580,
    "слабое исцеление": 13581,
    "удар вампира": 13582,
    "мощный удар": 13583,
    "сила теней": 13592,
    "расправа": 13595,
    "слепота": 13600,
    "рассечение": 13603,
    "берсеркер": 13606,
    "таран": 13609,
    "проклятие тьмы": 13612,
    "огонек надежды": 13615,
    "целебный огонь": 13619,
    "кровотечение": 13623,
    "заражение": 13626,
    "раскол": 13628,

    // Пассивные умения
    "незаметность": 15219,
    "быстрое восстановление": 13639,
    "мародер": 13642,
    "внимательность": 13644,
    "инициативность": 13646,
    "исследователь": 13648,
    "ведьмак": 13650,
    "собиратель": 13652,
    "запасливость": 13654,
    "охотник за головами": 13656,
    "подвижность": 13658,
    "упорность": 13660,
    "регенерация": 13662,
    "расчетливость": 13664,
    "презрение к боли": 13666,
    "ошеломление": 13668,
    "рыбак": 13670,
    "неуязвимый": 13672,
    "колющий удар": 13674,
    "бесстрашие": 13677,
    "режущий удар": 13679,
    "феникс": 13681,
    "непоколебимый": 13683,
    "суеверность": 13685,
    "гладиатор": 13687,
    "воздаяние": 13689,
    "ученик": 13691,
    "прочность": 13693,
    "расторопность": 13695,
    "устрашение": 13697,
    "контратака": 13699,
    "дробящий удар": 14505,
    "защитная стойка": 14507,
    "стойка сосредоточения": 14777,
    "водохлеб": 14779,
    "картограф": 14970,
    "браконьер": 14972,
    "парирование": 14986,
    "ловкость рук": 14988,
    "атлетика": 15359,
    "устойчивость": 15363,
    "угроза": 15429,
    "знания древних": 15433,
    "еретик": 15435,
    "барьер": 15437
};

// Форматирование чисел с пробелами (ПОЛНАЯ СУММА БЕЗ СОКРАЩЕНИЙ)
function formatGold(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Получение цены книги из Gist
async function getBookPrice(bookName) {
    const bookId = BOOK_IDS[bookName];
    if (!bookId) return null;

    // Проверка кэша
    const now = Date.now();
    if (PRICE_CACHE[bookId] && (now - PRICE_CACHE[bookId].timestamp < CACHE_DURATION)) {
        return PRICE_CACHE[bookId].price;
    }

    try {
        const response = await fetch(GIST_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const pricesData = await response.json();
        
        // Ищем книгу по ID
        for (const [name, data] of Object.entries(pricesData)) {
            if (data.id === bookId && data.price > 0) {
                const price = parseInt(data.price);
                PRICE_CACHE[bookId] = {
                    price: price,
                    timestamp: now
                };
                return price;
            }
        }
        return null;
    } catch (error) {
        console.error('Ошибка загрузки цен:', error);
        return null;
    }
}

// Расчет стоимости прокачки (1 книга = 5 уровней)
function calculateUpgradeCost(targetLevel, bookPrice) {
    if (targetLevel <= 0 || bookPrice <= 0) return null;
    
    // Стоимость одного уровня = цена книги / 5
    const costPerLevel = bookPrice / 5;
    
    // Стоимость уровней
    const levelCost = Math.ceil(targetLevel * costPerLevel);
    
    // Плата за каждый уровень (103 золота)
    const upgradeFee = targetLevel * 103;
    
    // ИТОГО
    const totalCost = levelCost + upgradeFee;
    
    return totalCost;
}
