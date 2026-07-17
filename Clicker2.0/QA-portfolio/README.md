# Robo Clicker — QA Portfolio

Учебный проект для портфолио **специалиста по тестированию**. Объект тестирования — браузерная clicker-игра на HTML, CSS и JavaScript с локальным сохранением и интеграцией Yandex Games SDK.

Репозиторий дополнен полноценным набором QA-артефактов, UI-автотестами Playwright, GitHub Actions и Excel-книгой для ведения проверок.

## Возможности приложения

- основной clicker и уровни с растущим порогом;
- улучшение силы клика и автоматические роботы;
- 16 скинов четырёх редкостей;
- 12 временных, постоянных и супер-бустов;
- 80 условий достижений, объединённых в 11 серий;
- подробная статистика;
- русский и английский языки;
- тёмная, светлая и автоматическая темы;
- громкость, яркость и безопасный сброс прогресса;
- сохранение в `localStorage`, офлайн-доход и облачная синхронизация;
- interstitial, rewarded и banner-реклама через Yandex Games SDK;
- локальный fallback при отсутствии SDK.

## QA-артефакты

| Артефакт | Назначение |
|---|---|
| [Тест-план](qa/TEST_PLAN.md) | Цели, объём, стратегия, риски и критерии завершения |
| [Чек-лист](qa/CHECKLIST.md) | 199 функциональных, UI, localization, compatibility и accessibility-проверок |
| [Тест-кейсы](qa/TEST_CASES.md) | 26 подробных сценариев с шагами и ожидаемыми результатами |
| [Баг-репорты](qa/BUG_REPORTS.md) | 8 дефектов/кандидатов, обнаруженных при статическом анализе |
| [Матрица трассируемости](qa/TRACEABILITY_MATRIX.md) | Связь модулей, рисков, ручных и автоматических проверок |
| [Итоговый отчёт](qa/TEST_SUMMARY.md) | Покрытие, результаты анализа и ограничения |
| [Excel QA workbook](qa/Robo_Clicker_QA.xlsx) | Листы «Чек-лист», «Баг-репорты», «Общие сведения» |
| [UI-автотесты](tests/e2e/clicker.spec.js) | Smoke и regression-набор Playwright |
| [Шаблон дефекта](.github/ISSUE_TEMPLATE/bug_report.yml) | Стандартизированная форма GitHub Issues |
| [GitHub Actions](.github/workflows/e2e.yml) | Автоматический запуск тестов в CI |

## Тест-дизайн

- классы эквивалентности и граничные значения;
- переходы состояний;
- таблицы принятия решений;
- позитивные и негативные сценарии;
- риск-ориентированное и исследовательское тестирование;
- статический анализ JavaScript/DOM;
- базовый accessibility-аудит;
- проверка интеграции с SDK через mock/stub.

## Автоматизированные проверки

Playwright-набор покрывает загрузку, локальный fallback, навигацию, кликер, статистику, уровень, настройки, покупку улучшения, робота, скин, буст, сохранение и мобильный viewport.

### Установка

Требуются Node.js 20+ и npm.

```bash
npm install
npx playwright install chromium
```

### Запуск

```bash
npm test
```

```bash
npm run test:headed
npm run test:report
```

## Структура

```text
.
├── .github/
│   ├── ISSUE_TEMPLATE/bug_report.yml
│   └── workflows/e2e.yml
├── qa/
│   ├── BUG_REPORTS.md
│   ├── CHECKLIST.md
│   ├── Robo_Clicker_QA.xlsx
│   ├── TEST_CASES.md
│   ├── TEST_PLAN.md
│   ├── TEST_SUMMARY.md
│   └── TRACEABILITY_MATRIX.md
├── tests/e2e/clicker.spec.js
├── click.wav
├── menu.wav
├── start.wav
├── index.html
├── script.js
├── style.css
├── roadmap.md
├── package.json
├── playwright.config.js
└── README.md
```

## Что проект демонстрирует работодателю

- декомпозицию сложного frontend-продукта;
- подготовку тестовой документации;
- понимание Severity и Priority;
- оформление воспроизводимых дефектов;
- анализ `localStorage`, таймеров и переходов состояний;
- тестирование localization, responsive UI и accessibility;
- автоматизацию на Playwright;
- организацию CI и GitHub Issues;
- умение честно отделять подтверждённый результат от проверки, требующей реального SDK/устройства.

## Статус анализа

Проведены статический анализ исходников, проверка синтаксиса JavaScript и изолированный Chromium-smoke основных пользовательских потоков. Полный прогон по HTTP, реальным устройствам и Yandex Games SDK выполняется после установки зависимостей в локальном окружении или GitHub Actions.
