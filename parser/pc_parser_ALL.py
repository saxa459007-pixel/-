# pc_parser_ALL.py - Парсит ВСЕ книги со средней ценой за 5 дней
import json
import requests
import re
import time
from datetime import datetime
import sys

# === ДАННЫЕ ИЗ СЕКРЕТОВ (GitHub Actions передаёт через переменные окружения) ===
import os as _os, json as _json
VK_PARAMS = _json.loads(_os.environ["VK_PARAMS"])
COOKIES = _json.loads(_os.environ["COOKIES"])
GITHUB_TOKEN = _os.environ["GIST_TOKEN"]
GIST_ID = _os.environ.get("GIST_ID", "45fd999aa7ad102f78209501450e6aa6")

# === ВСЕ КНИГИ (59 штук - добавили Барьер и Еретик) ===
BOOK_IDS = {
    # Активные умения (16)
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

    # Пассивные умения (43 - добавили Барьер и Еретик)
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
    "незаметность": 15219,
    "атлетика": 15359,
    "устойчивость": 15363,
    "угроза": 15429,
    "знания древних": 15433,
    
    # НОВЫЕ КНИГИ (добавлены)
    "барьер": 15700,
    "еретик": 15708,
}

def get_book_price(book_id):
    """
    Парсит цену книги
    Возвращает СРЕДНЮЮ цену за ПОСЛЕДНИЕ 5 ДНЕЙ
    """
    url = "https://well2.activeusers.ru/app.php"
    
    params = VK_PARAMS.copy()
    params['act'] = 'item'
    params['id'] = book_id
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Referer": "https://vk.com/app6987489"
    }
    
    for attempt in range(3):  # 3 попытки
        try:
            print(f"  Попытка {attempt+1}...")
            resp = requests.get(url, params=params, cookies=COOKIES, 
                              headers=headers, timeout=30, verify=False)
            
            if resp.status_code == 200:
                # Ищем данные графика
                match = re.search(r'window\.graph_data\s*=\s*(\[\[.*?\]\]);', resp.text, re.DOTALL)
                if match:
                    raw_data = match.group(1)
                    
                    # Чистим JSON
                    raw_data = re.sub(r',\s*\]', ']', raw_data)
                    raw_data = re.sub(r',\s*,', ',', raw_data)
                    
                    try:
                        data = json.loads(raw_data)
                        if data and isinstance(data, list):
                            
                            # ====================================
                            # КЛЮЧЕВАЯ ЛОГИКА: СРЕДНЯЯ ЗА 5 ДНЕЙ
                            # ====================================
                            
                            # Текущее время в миллисекундах
                            now_ms = int(time.time() * 1000)
                            
                            # 5 дней назад в миллисекундах
                            # 5 дней × 24 часа × 60 минут × 60 секунд × 1000 миллисекунд
                            five_days_ago_ms = now_ms - (5 * 24 * 60 * 60 * 1000)
                            
                            # Собираем цены за последние 5 дней
                            prices_last_5_days = []
                            
                            for item in data:
                                if isinstance(item, list) and len(item) >= 2:
                                    timestamp = item[0]  # Временная метка
                                    price_value = item[1]  # Цена
                                    
                                    # Если запись за последние 5 дней
                                    if timestamp >= five_days_ago_ms:
                                        try:
                                            price_float = float(price_value)
                                            prices_last_5_days.append(price_float)
                                        except:
                                            continue
                            
                            # Если есть цены за 5 дней
                            if prices_last_5_days:
                                # Вычисляем среднюю
                                average_price = sum(prices_last_5_days) / len(prices_last_5_days)
                                avg_int = int(average_price)
                                
                                # Логируем статистику
                                print(f"    📊 Найдено {len(prices_last_5_days)} записей за 5 дней")
                                print(f"    📈 Диапазон: {min(prices_last_5_days):.0f}-{max(prices_last_5_days):.0f}")
                                print(f"    🎯 Средняя: {avg_int}")
                                
                                return avg_int
                            else:
                                # Если нет данных за 5 дней, берем все доступные
                                all_prices = []
                                for item in data:
                                    if isinstance(item, list) and len(item) >= 2:
                                        try:
                                            all_prices.append(float(item[1]))
                                        except:
                                            continue
                                
                                if all_prices:
                                    avg_all = int(sum(all_prices) / len(all_prices))
                                    print(f"    ⚠️  Нет данных за 5 дней, берем все ({len(all_prices)} записей)")
                                    print(f"    🎯 Средняя: {avg_all}")
                                    return avg_all
                    
                    except json.JSONDecodeError as e:
                        print(f"    ❌ Ошибка JSON: {e}")
                    except Exception as e:
                        print(f"    ❌ Ошибка обработки: {e}")
            
            time.sleep(1)  # Пауза между попытками
            
        except requests.exceptions.Timeout:
            print(f"    ⏱️  Таймаут, пробуем снова...")
            time.sleep(2)
        except Exception as e:
            print(f"    ❌ Ошибка сети: {e}")
            time.sleep(2)
    
    print(f"    ❌ Все 3 попытки неудачны")
    return None

def update_gist(prices_data):
    """Обновляет Gist на GitHub"""
    url = f"https://api.github.com/gists/{GIST_ID}"
    
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }
    
    try:
        # Формируем JSON с правильной кодировкой
        json_data = json.dumps(prices_data, indent=2, ensure_ascii=False, sort_keys=True)
        
        data = {
            "description": f"Цены книг WellDungeon (средняя за 5 дней) - {datetime.now().strftime('%Y-%m-%d %H:%M')}",
            "files": {
                "book_prices.json": {
                    "content": json_data
                }
            }
        }
        
        print("🔄 Отправляем данные в Gist...")
        resp = requests.patch(url, headers=headers, json=data, timeout=15)
        
        if resp.status_code == 200:
            print(f"✅ Gist успешно обновлен!")
            return True
        else:
            print(f"❌ Ошибка Gist: {resp.status_code}")
            print(f"📄 Ответ: {resp.text[:200]}")
            return False
            
    except Exception as e:
        print(f"❌ Ошибка при обновлении Gist: {e}")
        return False

def main():
    """Основная функция"""
    print("=" * 80)
    print("🏹 ПАРСЕР ДЛЯ WELLDUNGEON - ВСЕ КНИГИ")
    print("📊 РАСЧЕТ: СРЕДНЯЯ ЦЕНА ЗА 5 ДНЕЙ")
    print("=" * 80)
    
    print(f"📚 Всего книг для парсинга: {len(BOOK_IDS)}")
    print(f"⏱️  Примерное время: {len(BOOK_IDS) * 5 / 60:.1f} минут")
    print(f"💾 Gist для обновления: {GIST_ID}")
    print("=" * 80)
    
    # Парсим все книги
    prices_data = {}
    successful = 0
    failed = 0
    start_time = time.time()
    
    for i, (book_name, book_id) in enumerate(BOOK_IDS.items(), 1):
        print(f"\n[{i:2d}/{len(BOOK_IDS)}] 📖 {book_name} (ID: {book_id})")
        
        price = get_book_price(book_id)
        
        if price is not None:
            prices_data[book_name] = {
                "id": book_id,
                "price": price,
                "updated": datetime.now().isoformat(),
                "calculation": "average_5_days"  # Добавляем метку расчета
            }
            print(f"    ✅ Успешно: {price} золота")
            successful += 1
        else:
            print(f"    ❌ Не удалось получить цену")
            failed += 1
        
        # Показываем прогресс и делаем паузу (кроме последней книги)
        if i < len(BOOK_IDS):
            elapsed = time.time() - start_time
            estimated_total = elapsed * len(BOOK_IDS) / i
            remaining = estimated_total - elapsed
            
            progress = i / len(BOOK_IDS) * 100
            print(f"    📊 Прогресс: {progress:.1f}%")
            print(f"    ⏱️  Прошло: {elapsed/60:.1f} мин, осталось: {remaining/60:.1f} мин")
            print(f"    📈 Успешно: {successful}, Неудачно: {failed}")
            
            # Пауза между книгами (чтобы не перегружать сайт)
            print(f"    ⏳ Пауза 3 секунды...")
            time.sleep(3)
    
    # Итоговая статистика
    print("\n" + "=" * 80)
    print("📊 ИТОГОВЫЙ РЕЗУЛЬТАТ:")
    print(f"✅ Успешно: {successful} книг")
    print(f"❌ Неудачно: {failed} книг")
    print(f"📈 Общий процент успеха: {successful/len(BOOK_IDS)*100:.1f}%")
    print(f"⏱️  Общее время: {(time.time() - start_time)/60:.1f} минут")
    
    if successful > 0:
        # Сохраняем локально
        filename = f"prices_5days_{datetime.now().strftime('%Y%m%d_%H%M')}.json"
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(prices_data, f, indent=2, ensure_ascii=False)
        print(f"\n💾 Локальный файл сохранен: {filename}")
        
        # Также сохраняем как основной файл
        with open("prices_latest.json", "w", encoding="utf-8") as f:
            json.dump(prices_data, f, indent=2, ensure_ascii=False)
        
        # Обновляем Gist
        print("\n" + "=" * 80)
        print("🔄 ОБНОВЛЯЕМ GITHUB GIST...")
        
        if update_gist(prices_data):
            print("\n🎉 ВСЕ ОПЕРАЦИИ УСПЕШНО ЗАВЕРШЕНЫ!")
            print(f"📎 Ссылка на Gist: https://gist.github.com/saxa459007-pixel/{GIST_ID}")
            print(f"📊 Всего книг в Gist: {len(prices_data)}")
            
            # Показываем статистику по новым книгам
            if "барьер" in prices_data:
                print(f"\n🆕 Новая книга 'Барьер': {prices_data['барьер']['price']} золота")
            if "еретик" in prices_data:
                print(f"🆕 Новая книга 'Еретик': {prices_data['еретик']['price']} золота")
        else:
            print("\n⚠️  Не удалось обновить Gist")
            print("💾 Но локальные файлы сохранены")
    else:
        print("\n❌ Не удалось получить ни одной цены")
        print("Проверьте:")
        print("1. Интернет соединение")
        print("2. VK параметры в коде")
        print("3. Cookies")

if __name__ == "__main__":
    # Отключаем SSL предупреждения
    import urllib3
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    
    # Устанавливаем кодировку для Windows
    if sys.platform == 'win32':
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    
    main()