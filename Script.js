// 1. DOM

// Ждем загрузки всей страницы
document.addEventListener('DOMContentLoaded', () => {
	const menuScreen = document.getElementById('menu'); // Ссылки на наши экраны
	const aboutScreen = document.getElementById('about-modal');
	const settingsScreen = document.getElementById('settings');

	const startBtn = document.getElementById('start-btn'); // Кнопки начать игру
	const backBtn = document.getElementById('back-menu-btn'); // В меню

	const aboutBtn = document.getElementById('about-btn'); // Об игре
	const closeAbout = document.getElementById('close-about');

	const settingsBtn = document.getElementById('settings-btn'); // настройки
	const closeSetting = document.getElementById('close-settings');

	const THEME_KEY = 'theme'; // тема
	const themeSelect = document.querySelector('.theme-select');

	// Кликер
	const scoreEl = document.getElementById('score');
	const clickPowerEl = document.getElementById('click-power-val');
	const clickObject = document.getElementById('click-object');
	const gameEl = document.getElementById('game');

	let coins = 0;
	let clickPower = 1;

	// === Улучшение клика ===
	const CLICK_UPGRADE_PRICE_KEY = 'clickUpgradePrice';
	let upgradePrice = 85; // стартовая цена (можешь поменять)

	const upgradeClickBtn = document.getElementById('btn-upgrade-click');
	const upgradeClickPriceEl = upgradeClickBtn ? upgradeClickBtn.querySelector('.price') : null;

	// Яркость
	const BRIGHTNESS_KEY = 'brightness';
	const BR_MIN = 20;
	const BR_MAX = 80;

	const brightnessRange = document.getElementById('brightness-range'); // именно яркость (не звук)
	let brightness = 70; // 20..80

	if (brightnessRange) {
		brightnessRange.min = String(BR_MIN);
		brightnessRange.max = String(BR_MAX);
	}

	// Увеличение уровня
	const levelBarEl = document.getElementById('level-bar');
	const levelFillEl = document.getElementById('level-fill');
	const levelTextEl = document.getElementById('level-text');

	const LEVEL_KEY = 'playerLevel';
	const LEVEL_CLICKS_KEY = 'levelClicks';

	let level = 0; // стартовый уровень 0
	let levelClicks = 0; // прогресс кликов в текущем уровне

	// Сложность: LVL 0 -> 1 = 150 кликов, дальше умножаем на 2.1 каждый уровень
	const LEVEL_FIRST_CLICKS = 150; // требование для перехода с LVL 0 на LVL 1
	const LEVEL_MULTIPLIER = 2.1; // множитель роста сложности

	function toFiniteNumber(value, fallback = 0) {
		const n = Number(value);
		return Number.isFinite(n) ? n : fallback;
	}

	function getStorageItem(key) {
		try {
			return localStorage.getItem(key);
		} catch {
			return null;
		}
	}

	function setStorageItem(key, value) {
		try {
			localStorage.setItem(key, String(value));
		} catch {
			// localStorage может быть недоступен (privacy mode / quota / sandbox)
		}
	}

	// Game Start
	function startGame() {
		if (!menuScreen) return;
		menuScreen.classList.add('hidden');
	}

	// Функция возврата в меню
	function goToMenu() {
		saveGame();
		if (!menuScreen) return;
		menuScreen.classList.remove('hidden');
	}

	if (startBtn) {
		startBtn.addEventListener('click', startGame); // Слушаем клики по кнопкам
	}

	if (backBtn) {
		backBtn.addEventListener('click', goToMenu); // меню
	}

	if (aboutBtn && aboutScreen) {
		aboutBtn.onclick = () => {
			aboutScreen.classList.remove('hidden'); // об игре
		};
	}

	if (closeAbout && aboutScreen) {
		closeAbout.onclick = () => {
			aboutScreen.classList.add('hidden'); // крестик об игре
		};
	}

	if (settingsBtn && settingsScreen) {
		settingsBtn.onclick = () => {
			settingsScreen.classList.remove('hidden'); // Настройки
		};
	}

	if (closeSetting && settingsScreen) {
		closeSetting.onclick = () => {
			settingsScreen.classList.add('hidden'); // Закрыть настройки
		};
	}

	// ТЕМА =========================

	function normalizeTheme(value) {
		const v = String(value || '').toLowerCase().trim();
		if (v === 'light') return 'light';
		if (v === 'dark') return 'dark';
		if (v === 'auto') return 'auto';
		return 'dark';
	}

	function applyTheme(theme) {
		const t = normalizeTheme(theme);

		document.body.classList.remove('light_theme', 'auto', 'dark'); // снимаем старые классы

		if (t === 'light') {
			document.body.classList.add('light_theme');
		} else if (t === 'auto') {
			document.body.classList.add('auto');
		} else {
			document.body.classList.add('dark'); // default = dark
		}
	}

	function setSelectToTheme(theme) {
		if (!themeSelect) return;
		const t = normalizeTheme(theme);
		const options = Array.from(themeSelect.options); // Подбираем option по data-theme
		const wanted = t === 'auto' ? 'auto' : t;
		const opt = options.find((o) => (o.dataset.theme || '').toLowerCase() === wanted);
		if (opt) {
			themeSelect.value = opt.value; // value у option без value = её текст
		}
	}

	// 1) При загрузке — вспомнить тему или поставить тёмную по умолчанию
	const savedTheme = getStorageItem(THEME_KEY) || 'dark';
	applyTheme(savedTheme);
	setSelectToTheme(savedTheme);

	// 2) При смене select — применить и сохранить
	if (themeSelect) {
		themeSelect.addEventListener('change', () => {
			const selectedOption = themeSelect.options[themeSelect.selectedIndex];
			const selectedTheme = selectedOption?.dataset?.theme || 'dark';

			applyTheme(selectedTheme);
			setStorageItem(THEME_KEY, normalizeTheme(selectedTheme));
		});
	}

	// Яркость
	function clamp(n, min, max) {
		const num = toFiniteNumber(n, min);
		return Math.max(min, Math.min(max, num));
	}

	function applyBrightness(value) {
		const v = clamp(value, BR_MIN, BR_MAX);
		const factor = v / BR_MAX; // 20..80 => 0.25..1.0
		document.documentElement.style.setProperty('--screen-brightness', String(factor));
	}

	// Движение ползунка яркости
	if (brightnessRange) {
		brightnessRange.addEventListener('input', () => {
			brightness = clamp(brightnessRange.value, BR_MIN, BR_MAX);
			applyBrightness(brightness);
			saveGame(); // сохраняем сразу
		});
	}

	//---------------КЛИКЕР-------------------------------------

	// Обновляет числа на экране
	function updateUI() {
		if (scoreEl) scoreEl.textContent = String(coins);
		if (clickPowerEl) clickPowerEl.textContent = String(clickPower);
		updateLevelUI();
		updateClickUpgradeUI();
	}

	// Сохраняем данные в localStorage
	function saveGame() {
		setStorageItem('coins', Math.max(0, toFiniteNumber(coins, 0)));
		setStorageItem('clickPower', Math.max(1, toFiniteNumber(clickPower, 1)));
		setStorageItem(CLICK_UPGRADE_PRICE_KEY, Math.max(1, toFiniteNumber(upgradePrice, 85)));
		setStorageItem(BRIGHTNESS_KEY, clamp(brightness, BR_MIN, BR_MAX));
		setStorageItem(LEVEL_KEY, Math.max(0, Math.floor(toFiniteNumber(level, 0))));
		setStorageItem(LEVEL_CLICKS_KEY, Math.max(0, Math.floor(toFiniteNumber(levelClicks, 0))));
	}

	// Загружаем данные из localStorage
	function loadGame() {
		const savedCoins = getStorageItem('coins');
		const savedClickPower = getStorageItem('clickPower');
		const savedUpgradePrice = getStorageItem(CLICK_UPGRADE_PRICE_KEY);
		const savedBrightness = getStorageItem(BRIGHTNESS_KEY);
		const savedLevel = getStorageItem(LEVEL_KEY);
		const savedLevelClicks = getStorageItem(LEVEL_CLICKS_KEY);

		if (savedCoins !== null) {
			coins = Math.max(0, toFiniteNumber(savedCoins, 0));
		}
		if (savedClickPower !== null) {
			clickPower = Math.max(1, toFiniteNumber(savedClickPower, 1));
		}
		if (savedUpgradePrice !== null) {
			upgradePrice = Math.max(1, toFiniteNumber(savedUpgradePrice, 85));
		}

		if (savedBrightness !== null) {
			brightness = clamp(savedBrightness, BR_MIN, BR_MAX);
		} else if (brightnessRange) {
			brightness = clamp(brightnessRange.value || 70, BR_MIN, BR_MAX);
		} else {
			brightness = 70;
		}

		if (savedLevel !== null) {
			level = Math.max(0, Math.floor(toFiniteNumber(savedLevel, 0)));
		}
		if (savedLevelClicks !== null) {
			levelClicks = Math.max(0, Math.floor(toFiniteNumber(savedLevelClicks, 0)));
		}
	}

	// Клик по роботу
	if (clickObject) {
		clickObject.addEventListener('pointerdown', (e) => {
			e.preventDefault();
			coins += clickPower;

			// прогресс уровня по кликам
			levelClicks += 1;
			const req = requiredClicksForLevel(level);
			if (levelClicks >= req) {
				level += 1;
				levelClicks = 0; // шкала обнуляется при апе
				playLevelUpGlow(); // мягкое свечение
			}

			updateUI();
			saveGame();
			createFloatingNumber(e.clientX, e.clientY, clickPower);
		});
	}

	loadGame(); // 1. загружаем сохранение
	updateUI(); // 2. показываем данные на экране
	applyBrightness(brightness);
	if (brightnessRange) brightnessRange.value = String(clamp(brightness, BR_MIN, BR_MAX));

	// Сохранение при перезагрузке/закрытии и при уходе со страницы
	window.addEventListener('beforeunload', saveGame);
	document.addEventListener('visibilitychange', () => {
		if (document.visibilityState === 'hidden') saveGame();
	});

	// "вылет" числа в точке клика (рисуем внутри #game)
	function createFloatingNumber(clientX, clientY, value) {
		if (!gameEl) return;

		const rect = gameEl.getBoundingClientRect();
		const x = clientX - rect.left;
		const y = clientY - rect.top;

		const el = document.createElement('div');
		el.className = 'floating-number';

		const randomX = (Math.random() - 0.5) * 40;

		el.innerHTML = `<span style="color: var(--gold, #ffd24a)">+</span>${value}`;
		el.style.left = `${x + randomX}px`;
		el.style.top = `${y}px`;

		gameEl.appendChild(el);
		setTimeout(() => el.remove(), 900);
	}

	// Уровень
	function requiredClicksForLevel(lvl) {
		const safeLevel = Math.max(0, Math.floor(toFiniteNumber(lvl, 0)));
		return Math.max(1, Math.round(LEVEL_FIRST_CLICKS * Math.pow(LEVEL_MULTIPLIER, safeLevel)));
	}

	function updateLevelUI() {
		if (!levelFillEl || !levelTextEl) return;

		const req = requiredClicksForLevel(level);
		const safeLevelClicks = Math.max(0, toFiniteNumber(levelClicks, 0));
		const progress = Math.min(safeLevelClicks / req, 1);
		levelFillEl.style.width = `${(progress * 100).toFixed(2)}%`;

		// Поддержка data-lang-template="LVL {n}"
		const template = levelTextEl.dataset.langTemplate || 'LVL {n}';
		levelTextEl.textContent = template.replace('{n}', level);

		if (levelBarEl) {
			levelBarEl.setAttribute('aria-valuenow', String(safeLevelClicks));
			levelBarEl.setAttribute('aria-valuemax', String(req));
		}
	}

	function playLevelUpGlow() {
		if (!levelBarEl) return;
		levelBarEl.classList.remove('level-up');
		void levelBarEl.offsetWidth; // перезапуск анимации
		levelBarEl.classList.add('level-up');
		setTimeout(() => levelBarEl.classList.remove('level-up'), 900);
	}

	// улучшение клика
	function updateClickUpgradeUI() {
		// Цена на кнопке
		if (upgradeClickPriceEl) {
			upgradeClickPriceEl.textContent = `${upgradePrice} 💰`;
		}

		// Блокировка/разблокировка
		if (upgradeClickBtn) {
			const disabled = coins < upgradePrice;
			upgradeClickBtn.disabled = disabled;
			upgradeClickBtn.classList.toggle('disabled', disabled);
		}
	}

	// Покупка улучшения клика
	function buyClickUpgrade() {
		if (coins < upgradePrice) return;

		coins -= upgradePrice;
		clickPower += 1;

		// Плавный рост цены на 15%, но всегда минимум +1
		upgradePrice = Math.max(upgradePrice + 1, Math.floor(upgradePrice * 1.15));

		updateUI();
		saveGame();
	}

	// Кнопка "Улучшить клик"
	if (upgradeClickBtn) {
		upgradeClickBtn.addEventListener('click', buyClickUpgrade);
	}
});