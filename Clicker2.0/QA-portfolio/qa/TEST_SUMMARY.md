# Итоговый QA-отчёт

## Объект

Robo Clicker — frontend-игра объёмом примерно 3 560 строк JavaScript, 2 605 строк CSS и 265 строк HTML. В продукте определены 16 скинов, 12 бустов, 80 достижений и интеграция с Yandex Games SDK.

## Выполненная работа

- декомпозиция функциональности и рисков;
- проверка синтаксиса `script.js` через Node.js;
- статический анализ DOM, localStorage, timers, SDK hooks и achievement rules;
- изолированный Chromium-smoke: меню, старт, клики, статистика, Скины, Бусты, темы и языки;
- подготовлено 199 checklist-проверок;
- подготовлено 26 подробных тест-кейсов;
- оформлено 8 дефектов/кандидатов;
- создан Playwright smoke/regression suite;
- добавлены GitHub Actions и Issue Form;
- создана Excel-книга с тремя рабочими листами.

## Наблюдения

| Категория | Результат |
|---|---|
| JavaScript syntax | Passed |
| DOM: duplicate IDs | Не обнаружены |
| Основной click flow | Passed в изолированном Chromium-smoke |
| Модальные окна и статистика | Passed в изолированном Chromium-smoke |
| RU/EN и Dark/Light | Passed для переключения в текущей сессии |
| Persistence выбранного языка | Defect BUG-001 |
| Keyboard accessibility | Defects BUG-004/BUG-005/BUG-006 |
| Achievement conditions | Defects BUG-007/BUG-008 |
| Реальный Yandex SDK | Не выполнено: нужен platform environment/mock |
| Полный HTTP Playwright CI | Подготовлен; запуск после `npm install` |

## Дефекты по Severity

- Major: 5
- Minor: 3
- Blocker/Critical: 0 по статическому анализу

## Ограничения

Изолированный smoke выполнялся с inline DOM/CSS/JS, поскольку целевое окружение должно отдельно проверяться через HTTP и Yandex Games. Рекламные callback, real cloud player, touch-устройства, звук и длительные таймеры требуют прогона в браузере/на платформе.

## Рекомендация

Перед демонстрацией работодателю запустить GitHub Actions, приложить первый HTML-report Playwright и перевести подтверждённые баги в GitHub Issues со screenshot/video evidence.
