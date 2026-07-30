const fs = require('node:fs');
const path = require('node:path');

const qaRoot = path.resolve(__dirname, '..');
const appRoot = path.resolve(qaRoot, '..');
const requiredAppFiles = ['index.html', 'style.css', 'script.js'];
const missingAppFiles = requiredAppFiles.filter((file) => !fs.existsSync(path.join(appRoot, file)));

if (missingAppFiles.length > 0) {
  throw new Error(`Missing application files: ${missingAppFiles.join(', ')}`);
}

const testDir = path.join(qaRoot, 'tests', 'e2e');
if (!fs.existsSync(testDir) || !fs.statSync(testDir).isDirectory()) {
  throw new Error('tests/e2e must be a directory');
}

const testFiles = fs.readdirSync(testDir).filter((file) => file.endsWith('.spec.js'));
if (testFiles.length === 0) throw new Error('No Playwright tests found');

console.log(`QA project check passed (${testFiles.length} E2E file${testFiles.length === 1 ? '' : 's'}).`);
