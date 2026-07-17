# Тест-план Robo Clicker

## 1. Общая информация

**Продукт:** Robo Clicker / Clicker 2.0  
**Тип:** браузерная single-page clicker-игра  
**Стек:** HTML5, CSS3, JavaScript, Web Audio, localStorage, Yandex Games SDK  
**Цель:** оценить функциональную корректность, сохранение прогресса, экономику, переходы состояний, localization, адаптивность, доступность и стабильность интеграции с платформой.

## 2. Цели

- проверить критический цикл «старт → клик → начисление → покупка → сохранение»;
- проверить уровни, роботов, скины, бусты, достижения и статистику;
- проверить безопасное восстановление состояния и сброс;
- проверить работу без SDK и контракт с Yandex Games SDK;
- проверить русский/английский интерфейс, темы, звук и яркость;
- выявить UI/UX и accessibility-проблемы;
- создать воспроизводимый регрессионный набор и автоматизировать smoke-сценарии.

## 3. Объём

### Входит

- главное меню, About и Settings;
- основной clicker и level progression;
- click upgrades и robot auto income;
- offline income;
- 16 скинов;
- 12 бустов в трёх категориях;
- 80 достижений / 11 серий;
- статистика;
- RU/EN, Dark/Light/Auto;
- звук, яркость, reset;
- localStorage и cloud-sync guard;
- interstitial/rewarded/banner SDK-логика;
- desktop/mobile responsive;
- keyboard и базовая WCAG-проверка;
- Console, Network и ресурсы.

### Не входит

- реальная рекламная статистика и выплаты;
- серверная безопасность Yandex Games;
- производительность платформенного backend;
- полный аудит WCAG 2.2 AA;
- penetration testing;
- устаревшие браузеры без современной JavaScript-поддержки.

## 4. Стратегия

### Функциональное тестирование

Проверяются позитивные, негативные и граничные сценарии для каждой покупки, начисления и разблокировки.

### Переходы состояний

1. Menu.
2. About / Settings.
3. Game active.
4. Feature modal open — gameplay paused.
5. Ad open — gameplay paused.
6. Game resumed.
7. Offline and restored.
8. Reset armed / holding / completed / cancelled.

### Тестирование данных

- валидные значения localStorage;
- отсутствующие ключи;
- отрицательные и нечисловые значения;
- повреждённый JSON;
- устаревшие achievement-state схемы;
- истёкшие и активные timers.

### Интеграционное тестирование

Yandex Games SDK тестируется через stub/mock: init, LoadingAPI, GameplayAPI, player data, interstitial, rewarded, banner, pause/resume.

### UI/UX и accessibility

- 320×568, 390×844, 768×1024, 1366×768, 1920×1080;
- мышь, touch, клавиатура;
- focus, accessible names, progressbar semantics;
- контраст, масштаб 200%, отсутствие горизонтального скролла;
- отсутствие блокировки обычных клавиш.

### Автоматизация

Автоматизируются детерминированные сценарии высокого риска: загрузка, старт, click, level boundary, statistics, settings, upgrades, robot, skins, boosts, persistence и mobile viewport. Вероятностные, рекламные и длительные таймеры остаются ручными либо выполняются со stub/clock.

## 5. Приоритеты

| Приоритет | Значение |
|---|---|
| P0 | Игра не запускается, неверное начисление/списание, потеря прогресса |
| P1 | Ошибки крупных модулей, достижений, SDK state, accessibility основного действия |
| P2 | Вторичные настройки, UI, таймеры, responsive |
| P3 | Косметика, wording и улучшения UX |

## 6. Основные риски

| Риск | Вероятность | Влияние | Митигация |
|---|---:|---:|---|
| Различия local mode и Yandex SDK | Высокая | Высокое | Отдельные mock и platform-прогоны |
| Таймеры и visibility делают тесты flaky | Средняя | Высокое | Проверять состояние, использовать clock/stub |
| Большое количество achievement-условий | Высокая | Высокое | Трассируемость и data-driven проверки |
| Повреждённый localStorage | Средняя | Высокое | Негативные сценарии и нормализация |
| Mobile overflow длинных строк | Высокая | Среднее | Viewport matrix и EN localization |
| Анимации влияют на click stability | Средняя | Среднее | Проверка hit target и reduced motion |
| Неправильные пути аудио | Высокая | Низкое | Network-аудит ресурсов |

## 7. Критерии начала

- доступен исходный код;
- приложение запускается через HTTP;
- определены основные требования и критические потоки;
- подготовлены Chrome/Chromium и Playwright;
- для SDK-тестов доступен mock или платформа.

## 8. Критерии завершения

- выполнены все P0/P1-проверки;
- нет открытых Blocker/Critical;
- smoke suite проходит в CI;
- дефекты воспроизводимы и имеют evidence;
- требования связаны с тестами;
- сформирован итоговый отчёт.

## 9. Метрики

- количество и Pass Rate проверок;
- дефекты по Severity/Priority;
- coverage по модулям;
- доля автоматизации P0/P1;
- flaky rate;
- количество blocked/not applicable;
- время smoke/regression прогона.
