# Матрица трассируемости

| Требование / модуль | Риск | Чек-лист | Тест-кейсы | Автотест |
|---|---|---|---|---|
| Загрузка и local fallback | P0 | CL-001–CL-010 | TC-001 | `initial menu and local fallback` |
| Запуск игры | P0 | CL-012 | TC-002 | `starts a new game` |
| Базовый click | P0 | Основной кликер | TC-003 | `increments score` |
| Уровень 0→1 | P0 | Уровни | TC-004 | `reaches level 1 after 150 clicks` |
| Statistics | P1 | Статистика | TC-005 | `statistics reflects clicks` |
| Language | P1 | Настройки, Локализация | TC-006, TC-007 | `switches language` |
| Theme | P1 | Настройки | TC-008, TC-009 | `applies and persists theme` |
| Click upgrade | P0 | Улучшение клика | TC-010, TC-011 | `buys click upgrade` |
| Robots | P0 | Роботы и автодоход | TC-012, TC-013 | `buys robot and receives income` |
| Skins | P1 | Скины | TC-014, TC-015 | `buys and equips skin` |
| Boosts | P1 | Бусты | TC-016, TC-017 | `buys a temporary boost` |
| Achievements | P1 | Достижения | TC-018, TC-026 | `opens achievements after progress` |
| Back to menu | P1 | Навигация | TC-019 | `returns to menu with score preserved` |
| Reset | P0 | Настройки | TC-020 | Manual / future clock test |
| Corrupt storage | P1 | Сохранение | TC-021 | Manual data-driven negative suite |
| Mobile layout | P1 | UI и адаптивность | TC-022 | Mobile Chromium project |
| Keyboard access | P1 | Accessibility | TC-023 | Manual + future axe audit |
| Rewarded ads | P0 | SDK | TC-024 | Stub integration test |
| Interstitial state | P1 | SDK | TC-025 | Stub integration test |
