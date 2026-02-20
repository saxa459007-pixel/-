// prices.js - Получение цен книг из GitHub Gist

const PRICE_CACHE = {};
const CACHE_DURATION = 3600000; // 1 час в миллисекундах

// URL к Gist с ценами (ТОТ ЖЕ, ЧТО В БОТЕ)
const GIST_URL = "https://gist.githubusercontent.com/saxa459007-pixel/45fd999aa7ad102f78209501450e6aa6/raw/book_prices.json";

// ID книг (синхронизировано с book_price_parser.py) - ТЕПЕРЬ С ЗАГЛАВНЫМИ
const BOOK_IDS = {
    // Активные умения
    "Грязный удар": 13580,
    "Слабое исцеление": 13581,
    "Удар вампира": 13582,
    "Мощный удар": 13583,
    "Сила теней": 13592,
    "Расправа": 13595,
    "Слепота": 13600,
    "Рассечение": 13603,
    "Берсеркер": 13606,
    "Таран": 13609,
    "Проклятие тьмы": 13612,
    "Огонек надежды": 13615,
    "Целебный огонь": 13619,
    "Кровотечение": 13623,
    "Заражение": 13626,
    "Раскол": 13628,

    // Пассивные умения
    "Незаметность": 15219,
    "Быстрое восстановление": 13639,
    "Мародер": 13642,
    "Внимательность": 13644,
    "Инициативность": 13646,
    "Исследователь": 13648,
    "Ведьмак": 13650,
    "Собиратель": 13652,
    "Запасливость": 13654,
    "Охотник за головами": 13656,
    "Подвижность": 13658,
    "Упорность": 13660,
    "Регенерация": 13662,
    "Расчетливость": 13664,
    "Презрение к боли": 13666,
    "Ошеломление": 13668,
    "Рыбак": 13670,
    "Неуязвимый": 13672,
    "Колющий удар": 13674,
    "Бесстрашие": 13677,
    "Режущий удар": 13679,
    "Феникс": 13681,
    "Непоколебимый": 13683,
    "Суеверность": 13685,
    "Гладиатор": 13687,
    "Воздаяние": 13689,
    "Ученик": 13691,
    "Прочность": 13693,
    "Расторопность": 13695,
    "Устрашение": 13697,
    "Контратака": 13699,
    "Дробящий удар": 14505,
    "Защитная стойка": 14507,
    "Стойка сосредоточения": 14777,
    "Водохлеб": 14779,
    "Картограф": 14970,
    "Браконьер": 14972,
    "Парирование": 14986,
    "Ловкость рук": 14988,
    "Атлетика": 15359,
    "Устойчивость": 15363,
    "Угроза": 15429,
    "Знания древних": 15433,
    "Еретик": 15435,
    "Барьер": 15437
};

// Форматирование чисел с пробелами (ПОЛНАЯ СУММА БЕЗ СОКРАЩЕНИЙ)
function formatGold(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Получение цены книги из Gist
async function getBookPrice(bookName) {
    const bookId = BOOK_IDS[bookName];
    if (!bookId) {
        console.log('ID не найден для:', bookName);
        return null;
    }

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
