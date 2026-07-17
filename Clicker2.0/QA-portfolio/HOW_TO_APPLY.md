# Как загрузить пакет в GitHub

1. Распакуйте готовый архив.
2. Скопируйте всё содержимое в корень нужного репозитория.
3. Не загружайте внешний ZIP как отдельный файл.
4. Убедитесь, что папки `.github`, `qa` и `tests` сохранили вложенность.
5. Выполните локально:

```bash
npm install
npx playwright install chromium
npm test
```

6. Добавьте созданный `package-lock.json` в репозиторий.
7. Сделайте commit:

```text
Add QA documentation, Excel workbook and Playwright tests
```

Description:

```text
- Added QA test plan, checklist, test cases and bug reports
- Added Excel QA workbook with three worksheets
- Added traceability matrix and test summary
- Added Playwright end-to-end tests
- Added GitHub Actions and issue template
- Updated README for QA portfolio presentation
```
