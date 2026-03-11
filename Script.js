// 1. DOM

// Ждем загрузки всей страницы
document.addEventListener('DOMContentLoaded', () => {
	const menuScreen = document.getElementById('menu'); // Ссылки на наши экраны
	const aboutScreen = document.getElementById('about-modal');
	const settingsScreen = document.getElementById('settings');
	const skinsModal = document.getElementById('skins-modal');

	const startBtn = document.getElementById('start-btn'); // Кнопки начать игру
	const backBtn = document.getElementById('back-menu-btn'); // В меню

	const aboutBtn = document.getElementById('about-btn'); // Об игре
	const closeAbout = document.getElementById('close-about');
	const aboutGoBtn = document.getElementById('about-go-btn');

	const settingsBtn = document.getElementById('settings-btn'); // настройки
	const closeSetting = document.getElementById('close-settings');
	const closeSkinsBtn = document.getElementById('close-skins');
	const resetProgressBtn = document.getElementById('reset-progress-btn');
	const resetProgressLabel = resetProgressBtn ? resetProgressBtn.querySelector('.settings-restart-label') : null;
	const resetProgressOverlay = resetProgressBtn ? resetProgressBtn.querySelector('.settings-restart-progress') : null;

	const THEME_KEY = 'theme'; // тема
	const themeSelect = document.querySelector('.theme-select');

	const languageSelect = document.getElementById('language-select');
	const LANGUAGE_KEY = 'language';
	const SUPPORTED_LANGUAGES = ['ru', 'en'];
	let currentLanguage = 'ru';

	// Единый словарь локализации интерфейса.
	// Русские значения сохранены как оригинальные формулировки проекта.
	const TRANSLATIONS = {
		ru: {
			gamename: 'Robo Clicker',
			'about-title': ' — это космическое приключение!',
			inginer: 'Ты — главный инженер секретной лаборатории будущего!',
			klik: '✨Кликай: Зарабатывай золото своими руками!',
			Upgrade: '⚙️Прокачивай: Увеличивай силу клика и покупай автоматических роботов.',
			Skin: '🎭Скины: Открывай новых уникальных героев за достижения.',
			Level: '🏆Уровни: Докажи, что ты лучший, повышая свой уровень инженера.',
			young: 'Создано специально для юных изобретателей!',
			Go: 'ПОЕХАЛИ!',
			settings: 'Настройки', language: '🌍 Язык', sound: '🔊 Звук', brightness: '☀️ Яркость', theme: '🌗 Тема',
			restart: 'Сбросить весь прогресс', welcome: 'Кликай, улучшай и собирай скины!', 'start-btn': 'Начать игру',
			'about-btn': 'Об игре', 'settings-btn': 'Настройки', gold: 'Золото', 'power-label': 'Сила клика', level: 'LVL {n}',
			'back-menu-btn': 'В меню', 'shop-title': 'МАГАЗИН', 'upgrade-click': 'Улучшить клик', 'robot-btn': 'Робот',
			'robot-info-default': '+1/сек • 0 куплено', 'skins-btn': 'Скины', 'boosts-btn': 'Бусты', 'achievements-btn': 'Достижения',
			'stats-btn': 'Статистика', 'skins-title': 'СКИНЫ', 'boosts-title': 'БУСТЫ', 'active-boosts': 'Активные бусты',
			'achievements-title': 'ДОСТИЖЕНИЯ', 'stats-title': 'СТАТИСТИКА', 'theme-dark': 'Темная', 'theme-light': 'Светлая', 'theme-auto': 'Авто',
		},
		en: {
			gamename: 'Robo Clicker',
			'about-title': ' is a space adventure!',
			inginer: 'You are the chief engineer of a secret laboratory of the future!',
			klik: '✨Click: Earn gold with your own hands!',
			Upgrade: '⚙️Upgrade: Increase click power and buy automatic robots.',
			Skin: '🎭Skins: Unlock unique heroes through achievements.',
			Level: '🏆Levels: Prove you are the best by leveling up your engineer rank.',
			young: 'Created especially for young inventors!',
			Go: "LET'S GO!",
			settings: 'Settings', language: '🌍 Language', sound: '🔊 Sound', brightness: '☀️ Brightness', theme: '🌗 Theme',
			restart: 'Reset all progress', welcome: 'Click, upgrade, and collect skins!', 'start-btn': 'Start game',
			'about-btn': 'About game', 'settings-btn': 'Settings', gold: 'Gold', 'power-label': 'Click power', level: 'LVL {n}',
			'back-menu-btn': 'To menu', 'shop-title': 'SHOP', 'upgrade-click': 'Upgrade click', 'robot-btn': 'Robot',
			'robot-info-default': '+1/sec • 0 bought', 'skins-btn': 'Skins', 'boosts-btn': 'Boosts', 'achievements-btn': 'Achievements',
			'stats-btn': 'Statistics', 'skins-title': 'SKINS', 'boosts-title': 'BOOSTS', 'active-boosts': 'Active boosts',
			'achievements-title': 'ACHIEVEMENTS', 'stats-title': 'STATISTICS', 'theme-dark': 'Dark', 'theme-light': 'Light', 'theme-auto': 'Auto',
		}
	};

	function normalizeLanguage(language) {
		return SUPPORTED_LANGUAGES.includes(language) ? language : 'ru';
	}

	function t(key, params = {}) {
		const langPack = TRANSLATIONS[currentLanguage] || TRANSLATIONS.ru;
		const raw = langPack[key] ?? TRANSLATIONS.ru[key] ?? key;
		return String(raw).replace(/\{(\w+)\}/g, (_, token) => (params[token] ?? `{${token}}`));
	}

	// Получение имени скина на активном языке.
	function getSkinNameById(skinId, fallbackName = '') {
		const enNames = {
			1: 'Classic Robot', 2: 'Workshop Mechanic', 3: 'Steel Guardian', 4: 'Moon Scout',
			5: 'Neon Courier', 6: 'Fire Prototype', 7: 'Frost Guardian', 8: 'Camouflage Tactician',
			9: 'Cyber Ninja', 10: 'Electro Warrior', 11: 'Space Raider', 12: 'Chrome Phantom',
			13: 'Dragon Mech', 14: 'Galactic Emperor', 15: 'Ghost Protocol', 16: 'Absolute Omega',
		};
		if (currentLanguage !== 'en') return fallbackName;
		return enNames[skinId] || fallbackName;
	}

	// Получение названия/описания буста на активном языке строго по утверждённому словарю.
	function getBoostText(boost, field) {
		if (currentLanguage !== 'en') return boost[field] || '';
		const en = {
			neon_overdrive: { name: 'Neon Overdrive', desc: 'x3 click power for 45 seconds' },
			rocket_pulse: { name: 'Rocket Pulse', desc: 'x2.5 click power and +20% robot income' },
			drone_army: { name: 'Drone Army', desc: 'x3 robot income for 90 seconds' },
			golden_storm: { name: 'Golden Storm', desc: '+150% coins per click for 40 seconds' },
			coin_burst: { name: 'Coin Burst', desc: 'Instantly gain 500 coins' },
			super_click: { name: 'Super Click', desc: 'Your next click is x25' },
			discount_protocol: { name: 'Discount Protocol', desc: 'Your next upgrade purchase costs 50% less' },
			offline_bonus: { name: 'Offline Bonus', desc: 'Grants 50% of offline income' },
			processor_plus: { name: 'Enhanced Processor', desc: '+1 click power' },
			eternal_generator: { name: 'Eternal Generator', desc: '+0.5 robot income' },
			evolution_module: { name: 'Evolution Module', desc: '+5% click power per level' },
			space_amplifier: { name: 'Space Amplifier', desc: '+10% to all income' },
			critical_overload: { name: 'Critical Overload', desc: '30% chance for x10 click power' },
			time_freeze: { name: 'Time Freeze', desc: 'Timers run at x0.5 speed for 30 seconds' },
			galactic_breakthrough: { name: 'Galactic Breakthrough', desc: 'Clicks x10 and robots x5' },
			omega_mode: { name: 'Omega Mode', desc: 'Clicks x20 for 20 seconds' },
		};
		return en[boost.id]?.[field] || boost[field] || '';
	}

	function getLocalizedText(value) {
		if (value && typeof value === 'object') {
			return currentLanguage === 'en' ? (value.en || value.ru || '') : (value.ru || value.en || '');
		}
		return value ?? '';
	}

	function updateLocalizedUI() {
		document.documentElement.lang = currentLanguage;
		document.querySelectorAll('[data-lang]').forEach((el) => {
			const key = el.dataset.lang;
			if (!key) return;
			if (el.id === 'level-text') {
				el.dataset.langTemplate = t('level');
				return;
			}
			el.textContent = t(key);
		});

		const staticMap = {
			'.about-wait .wait > p': { ru: 'Что тебя ждёт:', en: 'What awaits you:' },
			'.stats-title': { ru: 'СТАТИСТИКА', en: 'STATISTICS' },
			'#stats-basic-title': { ru: 'Основное', en: 'Main' },
			'#stats-upgrade-title': { ru: 'Прокачка', en: 'Upgrades' },
			'#stats-robots-title': { ru: 'Роботы', en: 'Robots' },
			'#stats-skins-title': { ru: 'Скины', en: 'Skins' },
			'#stats-boosts-title': { ru: 'Бусты', en: 'Boosts' },
			'#stats-achievements-title': { ru: 'Достижения', en: 'Achievements' },
		};
		Object.entries(staticMap).forEach(([selector, labels]) => {
			const el = document.querySelector(selector);
			if (el) el.textContent = labels[currentLanguage] || labels.ru;
		});

		const statsFieldLabels = [
			{ ru: 'Монеты сейчас', en: 'Coins Now' },
			{ ru: 'Всего заработано монет', en: 'Total Coins Earned' },
			{ ru: 'Всего кликов', en: 'Total Clicks' },
			{ ru: 'Базовая сила клика', en: 'Base Click Power' },
			{ ru: 'Эффективная сила клика', en: 'Effective Click Power' },
			{ ru: 'Текущий уровень', en: 'Current Level' },
			{ ru: 'Прогресс уровня', en: 'Level Progress' },
			{ ru: 'До следующего уровня', en: 'Remaining to Next Level' },
			{ ru: 'Куплено улучшений клика', en: 'Click Upgrades Purchased' },
			{ ru: 'Роботов куплено', en: 'Robots Purchased' },
			{ ru: 'Базовый доход роботов в секунду', en: 'Base Robot Income' },
			{ ru: 'Эффективный доход роботов в секунду', en: 'Effective Robot Income' },
			{ ru: 'Куплено скинов', en: 'Skins Purchased' },
			{ ru: 'Открыто скинов', en: 'Skins Unlocked' },
			{ ru: 'Выбранный скин', en: 'Selected Skin' },
			{ ru: 'Улучшено бустов', en: 'Boosts Upgraded' },
			{ ru: 'Всего использовано бустов', en: 'Boosts Used' },
			{ ru: 'Разных типов использовано', en: 'Boost Types Used' },
			{ ru: 'Активно сейчас', en: 'Active Boosts' },
			{ ru: 'Лучшее комбо бустов', en: 'Best Boost Combo' },
			{ ru: 'Суммарное время бустов (сек)', en: 'Total Boost Time' },
			{ ru: 'Открыто достижений', en: 'Achievements Unlocked' },
			{ ru: 'Получено наград', en: 'Rewards Claimed' },
			{ ru: 'Система достижений', en: 'Achievement System Unlocked' },
		];
		document.querySelectorAll('.stats-item__label').forEach((el, index) => {
			const pair = statsFieldLabels[index];
			if (!pair) return;
			el.textContent = pair[currentLanguage] || pair.ru;
		});

		if (languageSelect) languageSelect.value = currentLanguage;
		renderSkinsGrid();
		renderBoostsUI();
		renderAchievements();
		renderStatistics();
		updateUI();
	}

	function applyLanguage(language, options = {}) {
		const { save = true } = options;
		currentLanguage = normalizeLanguage(language);
		if (save) setStorageItem(LANGUAGE_KEY, currentLanguage);
		updateLocalizedUI();
	}

	// Кликер
	const scoreEl = document.getElementById('score');
	const clickPowerEl = document.getElementById('click-power-val');
	const clickObject = document.getElementById('click-object');
	const gameEl = document.getElementById('game');

	// Кнопки панели разделов
	const skinsBtn = document.getElementById('btn-skins');
	const boostsBtn = document.getElementById('btn-boosts');
	const achievementsBtn = document.getElementById('btn-achievements');
	const statsBtn = document.getElementById('btn-stats');
	const skinsGrid = document.getElementById('skins-grid');
	const boostsModal = document.getElementById('boosts-modal');
	const closeBoostsBtn = document.getElementById('close-boosts');
		const boostsGrid = document.getElementById('boosts-grid');
		const boostsTabs = document.getElementById('boosts-tabs');
		const boostsActiveList = document.getElementById('boosts-active-list');
		const achievementsModal = document.getElementById('achievements-modal');
		const closeAchievementsBtn = document.getElementById('close-achievements');
		const achievementsList = document.getElementById('achievements-list');
		const achievementsSummary = document.getElementById('achievements-summary');
		const achievementsOverallFill = document.getElementById('achievements-overall-fill');
		const statsModal = document.getElementById('stats-modal');
		const closeStatsBtn = document.getElementById('close-stats');

		// Элементы вкладки статистики. Храним ссылки централизованно,
		// чтобы обновление шло через один рендер-метод без разрозненного кода.
		const statsEls = {
			coinsCurrent: document.getElementById('stats-coins-current'),
			totalCoinsEarned: document.getElementById('stats-total-coins-earned'),
			totalClicks: document.getElementById('stats-total-clicks'),
			clickPowerBase: document.getElementById('stats-click-power-base'),
			clickPowerEffective: document.getElementById('stats-click-power-effective'),
			level: document.getElementById('stats-level'),
			levelProgress: document.getElementById('stats-level-progress'),
			levelRemaining: document.getElementById('stats-level-remaining'),
			clickUpgrades: document.getElementById('stats-click-upgrades'),
			robotsCount: document.getElementById('stats-robots-count'),
			robotsIncomeBase: document.getElementById('stats-robots-income-base'),
			robotsIncomeEffective: document.getElementById('stats-robots-income-effective'),
			skinsBought: document.getElementById('stats-skins-bought'),
			skinsOwned: document.getElementById('stats-skins-owned'),
			skinsSelected: document.getElementById('stats-skins-selected'),
			boostsUpgraded: document.getElementById('stats-boosts-upgraded'),
			boostsUsedTotal: document.getElementById('stats-boosts-used-total'),
			boostsTypesUsed: document.getElementById('stats-boosts-types-used'),
			boostsActive: document.getElementById('stats-boosts-active'),
			boostsBestCombo: document.getElementById('stats-boosts-best-combo'),
			boostsTotalTime: document.getElementById('stats-boosts-total-time'),
			achievementsUnlocked: document.getElementById('stats-achievements-unlocked'),
			achievementsClaimed: document.getElementById('stats-achievements-claimed'),
			achievementsSystem: document.getElementById('stats-achievements-system'),
		};

	let coins = 0;
	let clickPower = 1;

	// === Улучшение клика ===
	const CLICK_UPGRADE_PRICE_KEY = 'clickUpgradePrice';
	let upgradePrice = 85; // стартовая цена (можешь поменять)

	const upgradeClickBtn = document.getElementById('btn-upgrade-click');
	const upgradeClickPriceEl = upgradeClickBtn ? upgradeClickBtn.querySelector('.price') : null;

	// === Робот (автодоход) ===
	const ROBOT_PRICE_KEY = 'robotPrice';
	const ROBOT_COUNT_KEY = 'robotCount';
	const ROBOT_INCOME_KEY = 'robotIncomePerSecond';
	const ROBOT_BASE_PRICE = 200;

	const autoBotBtn = document.getElementById('btn-auto-bot');
	const autoBotPriceEl = autoBotBtn ? autoBotBtn.querySelector('.price') : null;
	const robotInfoEl = document.getElementById('robot-info');
	const moneyCounterEl = document.getElementById('money-counter');

	let robotPrice = ROBOT_BASE_PRICE;
	let robotCount = 0;
	let robotIncomePerSecond = 0;
	let robotTimer = null;

	// Звук
	const VOLUME_KEY = 'globalVolume';
	const volumeSlider =
		document.getElementById('volume-slider') ||
		document.querySelector('#settings input[type="range"]:not(#brightness-range)');

	let globalVolume = 1; // 0..1

	// Яркость
	const BRIGHTNESS_KEY = 'brightness';
	const BR_MIN = 20;
	const BR_MAX = 80;
	const DEFAULT_THEME = 'dark';
	const DEFAULT_BRIGHTNESS = BR_MAX;
	const DEFAULT_VOLUME = 1;

	const brightnessRange = document.getElementById('brightness-range'); // именно яркость (не звук)
	let brightness = DEFAULT_BRIGHTNESS; // 20..80

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


		// === СКИНЫ ===
	const SKINS_OWNED_KEY = 'skinsOwned';
	const SKINS_SELECTED_KEY = 'skinSelected';
	const skins = [
		{ id: 1, name: 'Классический Робот', icon: '🤖', price: 0, rarity: 'common' },
		{ id: 2, name: 'Рабочий Механик', icon: '🔧', price: 800, rarity: 'common' },
		{ id: 3, name: 'Стальной Защитник', icon: '🛡️', price: 1600, rarity: 'common' },
		{ id: 4, name: 'Лунный Разведчик', icon: '🪐', price: 3500, rarity: 'common' },
		{ id: 5, name: 'Неоновый Курьер', icon: '🌟', price: 6000, rarity: 'uncommon' },
		{ id: 6, name: 'Огненный Прототип', icon: '🔥', price: 8500, rarity: 'uncommon' },
		{ id: 7, name: 'Ледяной Страж', icon: '❄️', price: 11000, rarity: 'uncommon' },
		{ id: 8, name: 'Камуфляжный Тактик', icon: '🪖', price: 14000, rarity: 'uncommon' },
		{ id: 9, name: 'Кибер-Ниндзя', icon: '🥷', price: 22000, rarity: 'rare' },
		{ id: 10, name: 'Электро-Воин', icon: '⚡', price: 29000, rarity: 'rare' },
		{ id: 11, name: 'Космический Рейдер', icon: '🌌', price: 39000, rarity: 'rare' },
		{ id: 12, name: 'Хромовый Фантом', icon: '💎', price: 49000, rarity: 'rare' },
		{ id: 13, name: 'Драконий Мех', icon: '🐉', price: 78000, rarity: 'ultra' },
		{ id: 14, name: 'Галактический Император', icon: '👑', price: 115000, rarity: 'ultra' },
		{ id: 15, name: 'Призрачный Протокол', icon: '👻', price: 155000, rarity: 'ultra' },
		{ id: 16, name: 'Абсолютный Омега', icon: '☄️', price: 780000, rarity: 'ultra' },
	];

	const DEFAULT_SKIN_ID = 1;
	const skinById = new Map(skins.map((skin) => [skin.id, skin]));
	let ownedSkinIds = new Set([DEFAULT_SKIN_ID]);
	let selectedSkinId = DEFAULT_SKIN_ID;

	// === БУСТЫ ===
	const BOOST_LEVELS_KEY = 'boostLevels';
	const BOOST_USAGE_KEY = 'boostUsageCount';
	const BOOST_ACTIVE_KEY = 'activeBoosts';
	const BOOST_PENDING_DISCOUNT_KEY = 'pendingDiscount';
	const BOOST_PENDING_SUPER_CLICK_KEY = 'pendingSuperClick';

	let currentBoostCategory = 'temporary';
	let boostLevels = {};
	let boostUsageCount = {};
	let activeBoosts = {};
	let boostTimers = new Map();
	let pendingSuperClick = false;
	let pendingDiscount = false;
	let boostTimeScale = 1;
	let critBoostActive = false;

	const boostCategories = [
		{ id: 'temporary', label: { ru: 'Временные', en: 'Temporary' } },
		{ id: 'instant', label: { ru: 'Мгновенные', en: 'Instant' } },
		{ id: 'permanent', label: { ru: 'Постоянные', en: 'Permanent' } },
		{ id: 'super', label: { ru: 'Супер', en: 'Super' } },
	];

	const boosts = [
		{ id: 'neon_overdrive', category: 'temporary', rarity: 'rare', icon: '⚡', name: 'Неоновый разгон', desc: 'x3 к силе клика на 45 секунд', price: 900, duration: 45 },
		{ id: 'rocket_pulse', category: 'temporary', rarity: 'rare', icon: '🚀', name: 'Ракетный импульс', desc: 'x2.5 к клику и +20% дохода роботов', price: 1400, duration: 60 },
		{ id: 'drone_army', category: 'temporary', rarity: 'epic', icon: '🤖', name: 'Армия дронов', desc: 'x3 доход роботов на 90 секунд', price: 1800, duration: 90 },
		{ id: 'golden_storm', category: 'temporary', rarity: 'rare', icon: '🌟', name: 'Золотой шторм', desc: '+150% монет за клик на 40 секунд', price: 1200, duration: 40 },
		{ id: 'coin_burst', category: 'instant', rarity: 'common', icon: '💰', name: 'Монетный взрыв', desc: 'Сразу +500 монет', price: 400, priceGrowth: 1.28 },
		{ id: 'super_click', category: 'instant', rarity: 'rare', icon: '🔨', name: 'Супер клик', desc: 'Следующий клик x25', price: 750, priceGrowth: 1.3 },
		{ id: 'discount_protocol', category: 'instant', rarity: 'common', icon: '🛒', name: 'Скидочный протокол', desc: 'Следующая покупка апгрейда -50%', price: 600, priceGrowth: 1.25 },
		{ id: 'offline_bonus', category: 'instant', rarity: 'rare', icon: '⏳', name: 'Офлайн бонус', desc: 'Начисляет 50% офлайн дохода', price: 850, priceGrowth: 1.35 },
		{ id: 'processor_plus', category: 'permanent', rarity: 'rare', icon: '📈', name: 'Улучшенный процессор', desc: '+1 к силе клика', price: 3000, priceGrowth: 1.35 },
		{ id: 'eternal_generator', category: 'permanent', rarity: 'epic', icon: '🔋', name: 'Вечный генератор', desc: '+0.5 дохода роботов', price: 5000, priceGrowth: 1.35 },
		{ id: 'evolution_module', category: 'permanent', rarity: 'epic', icon: '🧬', name: 'Модуль эволюции', desc: '+5% к силе клика за уровень', price: 12000, oneTime: true },
		{ id: 'space_amplifier', category: 'permanent', rarity: 'epic', icon: '🌌', name: 'Космический усилитель', desc: '+10% ко всем доходам', price: 25000, oneTime: true },
		{ id: 'critical_overload', category: 'super', rarity: 'epic', icon: '💥', name: 'Критический перегруз', desc: '30% шанс x10 за клик', price: 1700, duration: 75 },
		{ id: 'time_freeze', category: 'super', rarity: 'rare', icon: '❄', name: 'Заморозка времени', desc: 'Таймеры x0.5 на 30 секунд', price: 1500, duration: 30 },
		{ id: 'galactic_breakthrough', category: 'super', rarity: 'epic', icon: '🌠', name: 'Галактический прорыв', desc: 'Клики x10 и роботы x5', price: 8000, duration: 15 },
		{ id: 'omega_mode', category: 'super', rarity: 'epic', icon: '🌀', name: 'Омега режим', desc: 'Клики x20 на 20 секунд', price: 12000, duration: 20 },
	];
		const boostById = new Map(boosts.map((boost) => [boost.id, boost]));

		const ACHIEVEMENTS_STATE_KEY = 'achievementsState';
		const ACHIEVEMENTS_BUTTON_UNLOCKED_KEY = 'achievementsButtonUnlocked';
		const ACHIEVEMENTS_COUNTERS_KEY = 'achievementsCounters';
		const TOTAL_CLICKS_KEY = 'totalClicks';
		const TOTAL_COINS_EARNED_KEY = 'totalCoinsEarned';
		const CLICK_UPGRADES_COUNT_KEY = 'clickUpgradesCount';
		const SKINS_BOUGHT_COUNT_KEY = 'skinsBoughtCount';

		const achievementsSeriesDefinitions = [
			{
				id: 'levels',
				category: 'level',
				icon: '🧠',
				title: { ru: 'Оживи меня', en: 'Bring Me Online' },
				stages: [
					{ goal: 1, metric: 'level', desc: { ru: 'Достигни 1 уровня', en: 'Reach level 1' }, reward: 200 },
					{ goal: 5, metric: 'level', desc: { ru: 'Достигни 5 уровня', en: 'Reach level 5' }, reward: 600 },
					{ goal: 10, metric: 'level', desc: { ru: 'Достигни 10 уровня', en: 'Reach level 10' }, reward: 1800 },
					{ goal: 20, metric: 'level', desc: { ru: 'Достигни 20 уровня', en: 'Reach level 20' }, reward: 8000 },
					{ goal: 30, metric: 'level', desc: { ru: 'Достигни 30 уровня', en: 'Reach level 30' }, reward: 15000 },
					{ goal: 40, metric: 'level', desc: { ru: 'Достигни 40 уровня', en: 'Reach level 40' }, reward: 30000 },
					{ goal: 50, metric: 'level', desc: { ru: 'Достигни 50 уровня', en: 'Reach level 50' }, reward: 60000, bonus: { ru: '+5% навсегда', en: '+5% forever' } },
					{ goal: 100, metric: 'level', desc: { ru: 'Достигни 100 уровня', en: 'Reach level 100' }, reward: 240000, bonus: { ru: 'Финал: титул «Абсолютный Омега»', en: 'Finale: “Absolute Omega” title' } },
				],
			},
			{
				id: 'clicks', category: 'clicks', icon: '🖱️', title: { ru: 'Пульс реактора', en: 'Reactor Pulse' },
				stages: [
					{ goal: 1, metric: 'clicks', desc: { ru: 'Сделай 1 клик', en: 'Make 1 click' }, reward: 50 },
					{ goal: 100, metric: 'clicks', desc: { ru: 'Сделай 100 кликов', en: 'Make 100 clicks' }, reward: 250 },
					{ goal: 500, metric: 'clicks', desc: { ru: 'Сделай 500 кликов', en: 'Make 500 clicks' }, reward: 500 },
					{ goal: 1000, metric: 'clicks', desc: { ru: 'Сделай 1 000 кликов', en: 'Make 1,000 clicks' }, reward: 900 },
					{ goal: 5000, metric: 'clicks', desc: { ru: 'Сделай 5 000 кликов', en: 'Make 5,000 clicks' }, reward: 2000 },
					{ goal: 10000, metric: 'clicks', desc: { ru: 'Сделай 10 000 кликов', en: 'Make 10,000 clicks' }, reward: 5000 },
					{ goal: 50000, metric: 'clicks', desc: { ru: 'Сделай 50 000 кликов', en: 'Make 50,000 clicks' }, reward: 12000 },
					{ goal: 100000, metric: 'clicks', desc: { ru: 'Сделай 100 000 кликов', en: 'Make 100,000 clicks' }, reward: 30000, bonus: { ru: '+2% навсегда', en: '+2% forever' } },
				],
			},
			{ id: 'coins', category: 'totalCoins', icon: '💰', title: { ru: 'Золотой контур', en: 'Golden Circuit' }, stages: [
				{ goal: 100, metric: 'totalCoins', desc: { ru: 'Заработай 100 монет', en: 'Earn 100 coins' }, reward: 200 },
				{ goal: 1000, metric: 'totalCoins', desc: { ru: 'Заработай 1 000 монет', en: 'Earn 1,000 coins' }, reward: 600 },
				{ goal: 10000, metric: 'totalCoins', desc: { ru: 'Заработай 10 000 монет', en: 'Earn 10,000 coins' }, reward: 2500 },
				{ goal: 50000, metric: 'totalCoins', desc: { ru: 'Заработай 50 000 монет', en: 'Earn 50,000 coins' }, reward: 7000 },
				{ goal: 100000, metric: 'totalCoins', desc: { ru: 'Заработай 100 000 монет', en: 'Earn 100,000 coins' }, reward: 15000 },
				{ goal: 500000, metric: 'totalCoins', desc: { ru: 'Заработай 500 000 монет', en: 'Earn 500,000 coins' }, reward: 40000 },
				{ goal: 1000000, metric: 'totalCoins', desc: { ru: 'Заработай 1 000 000 монет', en: 'Earn 1,000,000 coins' }, reward: 90000 },
				{ goal: 10000000, metric: 'totalCoins', desc: { ru: 'Заработай 10 000 000 монет', en: 'Earn 10,000,000 coins' }, reward: 260000, bonus: { ru: '+3% навсегда', en: '+3% forever' } },
			] },
			{ id: 'robots', category: 'robots', icon: '🤖', title: { ru: 'Армия конвейера', en: 'Conveyor Army' }, stages: [
				{ goal: 1, metric: 'robots', desc: { ru: 'Купи 1 робота', en: 'Buy 1 robot' }, reward: 150 },
				{ goal: 5, metric: 'robots', desc: { ru: 'Купи 5 роботов', en: 'Buy 5 robots' }, reward: 800 },
				{ goal: 10, metric: 'robots', desc: { ru: 'Купи 10 роботов', en: 'Buy 10 robots' }, reward: 2000 },
				{ goal: 25, metric: 'robots', desc: { ru: 'Купи 25 роботов', en: 'Buy 25 robots' }, reward: 6000 },
				{ goal: 50, metric: 'robots', desc: { ru: 'Купи 50 роботов', en: 'Buy 50 robots' }, reward: 12000 },
				{ goal: 100, metric: 'robots', desc: { ru: 'Купи 100 роботов', en: 'Buy 100 robots' }, reward: 25000 },
				{ goal: 250, metric: 'robots', desc: { ru: 'Купи 250 роботов', en: 'Buy 250 robots' }, reward: 60000 },
				{ goal: 500, metric: 'robots', desc: { ru: 'Купи 500 роботов', en: 'Buy 500 robots' }, reward: 180000, bonus: { ru: '+5% роботы', en: '+5% robots' } },
			] },
			{ id: 'upgrades', category: 'clickUpgrades', icon: '⚙️', title: { ru: 'Кузница апгрейдов', en: 'Upgrade Forge' }, stages: [
				{ goal: 1, metric: 'clickUpgrades', desc: { ru: 'Купи 1 улучшение клика', en: 'Buy 1 click upgrade' }, reward: 100 },
				{ goal: 5, metric: 'clickUpgrades', desc: { ru: 'Купи 5 улучшений клика', en: 'Buy 5 click upgrades' }, reward: 500 },
				{ goal: 10, metric: 'clickUpgrades', desc: { ru: 'Купи 10 улучшений клика', en: 'Buy 10 click upgrades' }, reward: 1300 },
				{ goal: 25, metric: 'clickUpgrades', desc: { ru: 'Купи 25 улучшений клика', en: 'Buy 25 click upgrades' }, reward: 5000 },
				{ goal: 50, metric: 'clickUpgrades', desc: { ru: 'Купи 50 улучшений клика', en: 'Buy 50 click upgrades' }, reward: 14000 },
				{ goal: 100, metric: 'clickUpgrades', desc: { ru: 'Купи 100 улучшений клика', en: 'Buy 100 click upgrades' }, reward: 65000, bonus: { ru: '+4% навсегда', en: '+4% forever' } },
			] },
			{ id: 'boosts', category: 'boosts', icon: '⚡', title: { ru: 'Энергоразгон', en: 'Overcharge Lane' }, stages: [
				{ goal: 1, metric: 'boosts', desc: { ru: 'Используй 1 буст', en: 'Use 1 boost' }, reward: 200 },
				{ goal: 5, metric: 'boosts', desc: { ru: 'Используй 5 бустов', en: 'Use 5 boosts' }, reward: 700 },
				{ goal: 10, metric: 'boosts', desc: { ru: 'Используй 10 бустов', en: 'Use 10 boosts' }, reward: 1600 },
				{ goal: 25, metric: 'boosts', desc: { ru: 'Используй 25 бустов', en: 'Use 25 boosts' }, reward: 4500 },
				{ goal: 50, metric: 'boosts', desc: { ru: 'Используй 50 бустов', en: 'Use 50 boosts' }, reward: 11000 },
				{ goal: 100, metric: 'boosts', desc: { ru: 'Используй 100 бустов', en: 'Use 100 boosts' }, reward: 24000 },
				{ goal: 250, metric: 'boosts', desc: { ru: 'Используй 250 бустов', en: 'Use 250 boosts' }, reward: 80000 },
				{ goal: 500, metric: 'boosts', desc: { ru: 'Используй 500 бустов', en: 'Use 500 boosts' }, reward: 180000, bonus: { ru: 'Финал: уникальный заряд «Омега»', en: 'Finale: unique “Omega” charge' } },
			] },
			{ id: 'skins', category: 'skinsBought', icon: '🎭', title: { ru: 'Галактический гардероб', en: 'Galactic Wardrobe' }, stages: [
				{ goal: 1, metric: 'skinsBought', desc: { ru: 'Купи 1 скин', en: 'Buy 1 skin' }, reward: 500 },
				{ goal: 3, metric: 'skinsBought', desc: { ru: 'Купи 3 скина', en: 'Buy 3 skins' }, reward: 1500 },
				{ goal: 5, metric: 'skinsBought', desc: { ru: 'Купи 5 скинов', en: 'Buy 5 skins' }, reward: 3000 },
				{ goal: 8, metric: 'skinsBought', desc: { ru: 'Купи 8 скинов', en: 'Buy 8 skins' }, reward: 7000 },
				{ goal: 10, metric: 'skinsBought', desc: { ru: 'Купи 10 скинов', en: 'Buy 10 skins' }, reward: 12000 },
				{ goal: 12, metric: 'skinsBought', desc: { ru: 'Купи 12 скинов', en: 'Buy 12 skins' }, reward: 18000 },
				{ goal: 15, metric: 'skinsBought', desc: { ru: 'Купи 15 скинов', en: 'Buy 15 skins' }, reward: 100000, bonus: { ru: 'Финал: секретный ультра-скин', en: 'Finale: secret ultra skin' } },
			] },
		];

		const specialAchievements = [
			{ id: 'special_eternal_engine', icon: '🔥', name: { ru: 'Вечный двигатель', en: 'Perpetual Engine' }, desc: { ru: '10 млн монет + 500 роботов', en: '10M coins + 500 robots' }, reward: 40000, bonus: null, unlocked: false, claimed: false },
			{ id: 'special_evolution', icon: '🧬', name: { ru: 'Эволюция завершена', en: 'Evolution Complete' }, desc: { ru: 'Сила клика 500 + уровень 45', en: 'Click power 500 + level 45' }, reward: 60000, bonus: null, unlocked: false, claimed: false },
			{ id: 'special_star_engineer', icon: '🌠', name: { ru: 'Звёздный инженер', en: 'Star Engineer' }, desc: { ru: 'Все скины + уровень 35', en: 'All skins + level 35' }, reward: 35000, bonus: null, unlocked: false, claimed: false },
			{ id: 'special_overload', icon: '💥', name: { ru: 'Перегрузка системы', en: 'System Overload' }, desc: { ru: '5 млн кликов + 1000 роботов', en: '5M clicks + 1,000 robots' }, reward: 80000, bonus: null, unlocked: false, claimed: false },
			{ id: 'special_ultimate', icon: '🏆', name: { ru: 'Абсолютная легенда', en: 'Ultimate Legend' }, desc: { ru: '500 млн монет + все серии завершены', en: '500M coins + all series completed' }, reward: 200000, bonus: { ru: 'секретный ультра-скин', en: 'secret ultra skin' }, unlocked: false, claimed: false },
		];

		const LEGACY_SERIES_ID_MAP = {
			levels: [4, 9, 10, 70, 71, 72, 73, 74],
			clicks: [1, 8, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
			coins: [5, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
			robots: [2, 6, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
			upgrades: [3, 7, 41, 45, 49, 50],
			boosts: [61, 62, 63, 64, 65, 66, 67, 68, 69],
			skins: [51, 52, 53, 54, 55, 58, 59, 60],
		};

		const LEGACY_SPECIAL_ID_MAP = {
			special_eternal_engine: 76,
			special_evolution: 77,
			special_star_engineer: 78,
			special_overload: 79,
			special_ultimate: 80,
		};

		let totalClicks = 0;
		let totalCoinsEarned = 0;
		let clickUpgradesCount = 0;
		let skinsBoughtCount = 0;
		const ACHIEVEMENT_BASE_LEVEL = 0;
		const ACHIEVEMENT_BASE_ROBOTS = 0;
		const ACHIEVEMENT_BASE_CLICK_UPGRADES = 0;
		const ACHIEVEMENT_BASE_SKINS = 1;
		let achievementsButtonUnlocked = false;
		let permanentCoinBonusMultiplier = 1;
		let permanentRobotBonusMultiplier = 1;
		const boostTypesUsed = new Set();
		const achievementCounters = { boostComboBest: 0, boostTime: 0 };
		const achievementSeriesState = {};
		achievementsSeriesDefinitions.forEach((series) => {
			achievementSeriesState[series.id] = { stageIndex: 0, stageClaimed: false, completed: false };
		});
	let lastBoostTick = Date.now();

	// Полный список ключей, которые относятся только к игре.
	// В reset мы чистим только эти ключи, не затрагивая чужие данные в localStorage.
	const GAME_STORAGE_KEYS = [
		'coins',
		'clickPower',
		CLICK_UPGRADE_PRICE_KEY,
		ROBOT_PRICE_KEY,
		ROBOT_COUNT_KEY,
		ROBOT_INCOME_KEY,
		BRIGHTNESS_KEY,
		VOLUME_KEY,
		LEVEL_KEY,
		LEVEL_CLICKS_KEY,
		SKINS_OWNED_KEY,
		SKINS_SELECTED_KEY,
		BOOST_LEVELS_KEY,
		BOOST_USAGE_KEY,
		BOOST_ACTIVE_KEY,
		BOOST_PENDING_DISCOUNT_KEY,
		BOOST_PENDING_SUPER_CLICK_KEY,
		TOTAL_CLICKS_KEY,
		TOTAL_COINS_EARNED_KEY,
		CLICK_UPGRADES_COUNT_KEY,
		SKINS_BOUGHT_COUNT_KEY,
		ACHIEVEMENTS_BUTTON_UNLOCKED_KEY,
		ACHIEVEMENTS_COUNTERS_KEY,
		ACHIEVEMENTS_STATE_KEY,
		THEME_KEY,
	];

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

		function safePercent(value, goal) {
			const safeGoal = Math.max(1, toFiniteNumber(goal, 1));
			const pct = (Math.max(0, toFiniteNumber(value, 0)) / safeGoal) * 100;
			return Math.max(0, Math.min(100, pct));
		}

		function getAchievementProgressValue(metric) {
			const purchasedRobots = Math.max(0, robotCount - ACHIEVEMENT_BASE_ROBOTS);
			const purchasedClickUpgrades = Math.max(0, clickUpgradesCount - ACHIEVEMENT_BASE_CLICK_UPGRADES);
			const ownedSkinsWithoutDefault = Math.max(0, ownedSkinIds.size - ACHIEVEMENT_BASE_SKINS);
			switch (metric) {
				case 'clicks': return totalClicks;
				case 'totalCoins': return totalCoinsEarned;
				case 'robots': return purchasedRobots;
				case 'clickUpgrades': return purchasedClickUpgrades;
				case 'clickPower': return Math.floor(getEffectiveClickPower());
				case 'level': return Math.max(0, level - ACHIEVEMENT_BASE_LEVEL);
				case 'skinsBought': return skinsBoughtCount;
				case 'skins': return ownedSkinsWithoutDefault;
				case 'boosts': return Object.values(boostUsageCount).reduce((sum, n) => sum + Math.max(0, Math.floor(toFiniteNumber(n, 0))), 0);
				default: return 0;
			}
		}

		function updateSpecialAchievementsState() {
			specialAchievements.forEach((achievement) => {
				if (achievement.id === 'special_eternal_engine') achievement.unlocked = totalCoinsEarned >= 10000000 && Math.max(0, robotCount - ACHIEVEMENT_BASE_ROBOTS) >= 500;
				if (achievement.id === 'special_evolution') achievement.unlocked = getEffectiveClickPower() >= 500 && level >= 45;
				if (achievement.id === 'special_star_engineer') achievement.unlocked = Math.max(0, ownedSkinIds.size - ACHIEVEMENT_BASE_SKINS) >= 16 && level >= 35;
				if (achievement.id === 'special_overload') achievement.unlocked = totalClicks >= 5000000 && Math.max(0, robotCount - ACHIEVEMENT_BASE_ROBOTS) >= 1000;
				if (achievement.id === 'special_ultimate') {
					const allSeriesDone = achievementsSeriesDefinitions.every((series) => achievementSeriesState[series.id]?.completed);
					achievement.unlocked = totalCoinsEarned >= 500000000 && allSeriesDone;
				}
			});
		}

		function getBonusFromEntry(entry) {
			if (!entry || !entry.bonus) return '';
			return getLocalizedText(entry.bonus);
		}

		function updatePermanentBonusesFromAchievements() {
			permanentCoinBonusMultiplier = 1;
			permanentRobotBonusMultiplier = 1;
			const claimedEntries = [];
			achievementsSeriesDefinitions.forEach((series) => {
				const state = achievementSeriesState[series.id];
				if (!state) return;
				for (let index = 0; index < series.stages.length; index += 1) {
					if (index < state.stageIndex || (state.completed && index === series.stages.length - 1)) claimedEntries.push(series.stages[index]);
				}
			});
			specialAchievements.forEach((achievement) => { if (achievement.claimed) claimedEntries.push(achievement); });
			claimedEntries.forEach((entry) => {
				const bonusText = getBonusFromEntry(entry);
				if (!bonusText) return;
				const pct = toFiniteNumber(bonusText.replace(/[^0-9.]/g, ''), 0);
				if (pct <= 0) return;
				const low = bonusText.toLowerCase();
				if (low.includes('роботы') || low.includes('robot')) permanentRobotBonusMultiplier *= (1 + (pct / 100));
				if (low.includes('навсегда') || low.includes('forever')) permanentCoinBonusMultiplier *= (1 + (pct / 100));
			});
		}

		function claimSeriesReward(seriesId) {
			const series = achievementsSeriesDefinitions.find((item) => item.id === seriesId);
			const state = achievementSeriesState[seriesId];
			if (!series || !state || state.completed) return;
			const stage = series.stages[state.stageIndex];
			if (!stage) return;
			if (getAchievementProgressValue(stage.metric) < stage.goal) return;
			coins += Math.max(0, toFiniteNumber(stage.reward, 0));
			const isFinal = state.stageIndex >= series.stages.length - 1;
			if (isFinal) {
				state.completed = true;
			} else {
				state.stageIndex += 1;
			}
			updatePermanentBonusesFromAchievements();
			updateSpecialAchievementsState();
			updateUI();
			saveGame();
			renderAchievements();
		}

		function claimSpecialReward(id) {
			const achievement = specialAchievements.find((item) => item.id === id);
			if (!achievement || achievement.claimed || !achievement.unlocked) return;
			achievement.claimed = true;
			coins += Math.max(0, toFiniteNumber(achievement.reward, 0));
			updatePermanentBonusesFromAchievements();
			updateUI();
			saveGame();
			renderAchievements();
		}

		function renderAchievements() {
			if (!achievementsList) return;
			updateSpecialAchievementsState();
			const totalCards = achievementsSeriesDefinitions.length + specialAchievements.length;
			const completedCards = achievementsSeriesDefinitions.filter((series) => achievementSeriesState[series.id]?.completed).length + specialAchievements.filter((item) => item.claimed).length;
			const percent = safePercent(completedCards, totalCards);
			if (achievementsSummary) {
				achievementsSummary.textContent = currentLanguage === 'en' ? `Completed ${completedCards} / ${totalCards} • ${percent.toFixed(1)}%` : `Завершено ${completedCards} / ${totalCards} • ${percent.toFixed(1)}%`;
			}
			if (achievementsOverallFill) achievementsOverallFill.style.width = `${percent.toFixed(1)}%`;
			achievementsList.textContent = '';

			achievementsSeriesDefinitions.forEach((series) => {
				const state = achievementSeriesState[series.id];
				const stage = series.stages[Math.min(state.stageIndex, series.stages.length - 1)];
				const current = getAchievementProgressValue(stage.metric);
				const ready = !state.completed && current >= stage.goal;
				const progressText = currentLanguage === 'en' ? `Progress: ${Math.min(current, stage.goal)} / ${stage.goal}` : `Прогресс: ${Math.min(current, stage.goal)} / ${stage.goal}`;
				const status = state.completed ? (currentLanguage === 'en' ? 'Series Complete' : 'Серия завершена') : (ready ? (currentLanguage === 'en' ? 'Ready' : 'Готово') : (currentLanguage === 'en' ? 'Not Completed' : 'Не выполнено'));
				const statusClass = state.completed ? 'achievement-card__status--done' : (ready ? 'achievement-card__status--progress' : 'achievement-card__status--locked');
				const card = document.createElement('article');
				card.className = `achievement-card ${state.completed ? 'achievement-card--series-complete' : ''}`;
				card.innerHTML = `
					<div class="achievement-card__icon">${series.icon}</div>
					<div class="achievement-card__main">
						<div class="achievement-card__topline">
							<h3 class="achievement-card__name">${getLocalizedText(series.title)} — <span class="achievement-card__status ${statusClass}">${status}</span></h3>
							<div class="achievement-card__controls">
								<button type="button" class="achievement-card__claim-btn ${state.completed ? 'is-claimed' : ready ? 'is-ready' : 'is-locked'}" data-achievement-kind="series" data-achievement-id="${series.id}" ${(!ready || state.completed) ? 'disabled' : ''}>${state.completed ? (currentLanguage === 'en' ? 'Series complete' : 'Серия завершена') : (ready ? (currentLanguage === 'en' ? 'Claim Reward' : 'Забрать награду') : (currentLanguage === 'en' ? 'Not ready' : 'Не готово'))}</button>
								<div class="achievement-card__reward">${currentLanguage === 'en' ? `+${stage.reward} coins` : `+${stage.reward} монет`}${stage.bonus ? ` • ${getBonusFromEntry(stage)}` : ''}</div>
							</div>
						</div>
						<p class="achievement-card__desc">${state.completed ? (currentLanguage === 'en' ? 'Final reward claimed. The chain is complete.' : 'Финальная награда получена. Цепочка завершена.') : getLocalizedText(stage.desc)}</p>
						<p class="achievement-card__meta">${progressText}</p>
					</div>
					<div class="achievement-card__progress"><div class="achievement-card__progress-fill" style="width:${state.completed ? 100 : safePercent(current, stage.goal)}%"></div></div>
				`;
				achievementsList.appendChild(card);
			});

			specialAchievements.forEach((item) => {
				const statusText = item.claimed ? (currentLanguage === 'en' ? 'Reward Claimed' : 'Награда получена') : item.unlocked ? (currentLanguage === 'en' ? 'Ready' : 'Готово') : (currentLanguage === 'en' ? 'Not Completed' : 'Не выполнено');
				const statusClass = item.claimed ? 'achievement-card__status--done' : item.unlocked ? 'achievement-card__status--progress' : 'achievement-card__status--locked';
				const card = document.createElement('article');
				card.className = `achievement-card ${item.claimed ? 'achievement-card--done' : ''}`;
				card.innerHTML = `
					<div class="achievement-card__icon">${item.icon}</div>
					<div class="achievement-card__main">
						<div class="achievement-card__topline">
							<h3 class="achievement-card__name">${getLocalizedText(item.name)} — <span class="achievement-card__status ${statusClass}">${statusText}</span></h3>
							<div class="achievement-card__controls">
								<button type="button" class="achievement-card__claim-btn ${item.claimed ? 'is-claimed' : item.unlocked ? 'is-ready' : 'is-locked'}" data-achievement-kind="special" data-achievement-id="${item.id}" ${(item.claimed || !item.unlocked) ? 'disabled' : ''}>${item.claimed ? (currentLanguage === 'en' ? 'Claimed' : 'Получено') : (currentLanguage === 'en' ? 'Claim Reward' : 'Забрать награду')}</button>
								<div class="achievement-card__reward">${currentLanguage === 'en' ? `+${item.reward} coins` : `+${item.reward} монет`}${item.bonus ? ` • ${getBonusFromEntry(item)}` : ''}</div>
							</div>
						</div>
						<p class="achievement-card__desc">${getLocalizedText(item.desc)}</p>
					</div>`;
				achievementsList.appendChild(card);
			});
		}

		function unlockAchievementsButton() {
			if (!achievementsBtn || achievementsButtonUnlocked) return;
			achievementsButtonUnlocked = true;
			achievementsBtn.classList.remove('locked');
			achievementsBtn.classList.add('is-unlocked', 'unlocking');
			setTimeout(() => {
				if (achievementsBtn) achievementsBtn.classList.remove('unlocking');
			}, 750);
		}

		function restoreAchievementsButtonState() {
			if (!achievementsBtn) return;
			if (achievementsButtonUnlocked) {
				achievementsBtn.classList.remove('locked');
				achievementsBtn.classList.add('is-unlocked');
			} else {
				achievementsBtn.classList.add('locked');
				achievementsBtn.classList.remove('is-unlocked', 'unlocking');
			}
		}

		function openAchievementsModal() {
			if (!achievementsModal) return;
			closeAllFeatureModals();
			unlockAchievementsButton();
			renderAchievements();
			achievementsModal.classList.remove('hidden');
			updateUI();
			saveGame();
		}

		function closeAchievementsModal() {
			if (!achievementsModal) return;
			achievementsModal.classList.add('hidden');
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


	if (languageSelect) {
		languageSelect.addEventListener('change', () => {
			applyLanguage(languageSelect.value || 'ru');
		});
	}

	const savedLanguage = normalizeLanguage(getStorageItem(LANGUAGE_KEY));
	applyLanguage(savedLanguage, { save: false });

	// 1) При загрузке — вспомнить тему или поставить тёмную по умолчанию
	const savedTheme = getStorageItem(THEME_KEY) || DEFAULT_THEME;
	applyTheme(savedTheme);
	setSelectToTheme(savedTheme);

	// 2) При смене select — применить и сохранить
	if (themeSelect) {
		themeSelect.addEventListener('change', () => {
			const selectedOption = themeSelect.options[themeSelect.selectedIndex];
			const selectedTheme = selectedOption?.dataset?.theme || DEFAULT_THEME;

			applyTheme(selectedTheme);
			setStorageItem(THEME_KEY, normalizeTheme(selectedTheme));
		});
	}

	// ЗВУК =========================
	function clamp01(value) {
		const num = toFiniteNumber(value, 1);
		return Math.max(0, Math.min(1, num));
	}

	function createGameSound(primarySrc, fallbackSrc = '') {
		const audio = new Audio();
		let fallbackUsed = false;

		if (fallbackSrc) {
			audio.addEventListener(
				'error',
				() => {
					if (fallbackUsed) return;
					fallbackUsed = true;
					audio.src = fallbackSrc;
					audio.load();
				},
				{ once: true }
			);
		}

		audio.preload = 'auto';
		audio.volume = globalVolume;
		audio.src = primarySrc;
		return audio;
	}

	const sounds = {
		click: createGameSound('sounds/click.wav', 'click.wav'),
		start: createGameSound('sounds/start.wav', 'start.wav'),
		menu: createGameSound('sounds/menu.wav', 'menu.wav'),
	};

	function applyGlobalVolume(value) {
		globalVolume = clamp01(value);

		Object.values(sounds).forEach((audio) => {
			audio.volume = globalVolume;
		});

		if (volumeSlider) {
			volumeSlider.value = String(Math.round(globalVolume * 100));
		}
	}

	function playSound(name) {
		const audio = sounds[name];
		if (!audio || globalVolume <= 0) return;

		try {
			audio.pause();
			audio.currentTime = 0;
			audio.volume = globalVolume;
		} catch {
			// Некоторые браузеры могут бросить исключение,
			// если аудио ещё не готово — просто игнорируем.
		}

		const playPromise = audio.play();

		if (playPromise && typeof playPromise.catch === 'function') {
			playPromise.catch(() => {
				// Игнорируем NotAllowedError / AbortError,
				// если браузер временно не дал воспроизвести звук.
			});
		}
	}

	function initVolumeControl() {
		if (volumeSlider) {
			volumeSlider.min = '0';
			volumeSlider.max = '100';
			volumeSlider.step = '1';
		}

		const savedVolume = getStorageItem(VOLUME_KEY);

		if (savedVolume !== null) {
			applyGlobalVolume(savedVolume);
		} else if (volumeSlider) {
			applyGlobalVolume(Number(volumeSlider.value || 100) / 100);
		} else {
			applyGlobalVolume(DEFAULT_VOLUME);
		}

		if (!volumeSlider) return;

		volumeSlider.addEventListener('input', () => {
			applyGlobalVolume(Number(volumeSlider.value) / 100);
			setStorageItem(VOLUME_KEY, globalVolume);
		});

		volumeSlider.addEventListener('change', () => {
			setStorageItem(VOLUME_KEY, globalVolume);
		});
	}

	// Яркость =========================
	function clamp(n, min, max) {
		const num = toFiniteNumber(n, min);
		return Math.max(min, Math.min(max, num));
	}

	function applyBrightness(value, options = {}) {
		const { syncSlider = true, syncState = true } = options;
		const v = clamp(value, BR_MIN, BR_MAX);

		if (syncState) {
			brightness = v;
		}

		if (syncSlider && brightnessRange) {
			brightnessRange.value = String(v);
		}

		const factor = v / BR_MAX; // 20..80 => 0.25..1.0
		document.documentElement.style.setProperty('--screen-brightness', String(factor));
		return v;
	}

	// Движение ползунка яркости
	if (brightnessRange) {
		brightnessRange.addEventListener('input', () => {
			applyBrightness(brightnessRange.value);
			saveGame(); // сохраняем сразу
		});
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
		startBtn.addEventListener('click', () => {
			playSound('start');
			startGame();
		});
	}

	if (backBtn) {
		backBtn.addEventListener('click', () => {
			goToMenu();
		});
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

	if (aboutGoBtn && aboutScreen) {
		aboutGoBtn.addEventListener('click', () => {
			playSound('start');
			aboutScreen.classList.add('hidden');
			goToMenu();
		});
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

	
	// --- СКИНЫ: модалка, покупка, выбор и рендер карточек ---
	function getRarityLabel(rarity) {
		if (rarity === 'uncommon') return currentLanguage === 'en' ? 'Uncommon' : 'Uncommon';
		if (rarity === 'rare') return currentLanguage === 'en' ? 'Rare' : 'Rare';
		if (rarity === 'ultra') return currentLanguage === 'en' ? 'Ultra Rare' : 'Ultra';
		return currentLanguage === 'en' ? 'Common' : 'Common';
	}

	function updateClickObjectSkin() {
		if (!clickObject) return;
		const currentSkin = skinById.get(selectedSkinId) || skinById.get(DEFAULT_SKIN_ID);
		clickObject.textContent = currentSkin ? currentSkin.icon : '🤖';
	}

	function getSkinButtonState(skin) {
		const isOwned = ownedSkinIds.has(skin.id) || skin.price === 0;
		if (skin.id === selectedSkinId) {
			return {
				text: currentLanguage === 'en' ? '✓ Equipped' : '✓ Надето',
				className: 'is-equipped',
				disabled: true,
				title: currentLanguage === 'en' ? 'Skin is already equipped' : 'Скин уже надет',
			};
		}

		if (isOwned) {
			return {
				text: currentLanguage === 'en' ? 'Owned' : 'Куплено',
				className: 'is-owned',
				disabled: false,
				title: currentLanguage === 'en' ? 'Click to equip skin' : 'Нажмите, чтобы надеть скин',
			};
		}

		const isLocked = coins < skin.price;

		return {
			text: currentLanguage === 'en' ? `Buy for ${skin.price} 💰` : `Купить за ${skin.price} 💰`,
			className: isLocked ? 'is-locked' : '',
			disabled: isLocked,
			title: isLocked ? (currentLanguage === 'en' ? 'Not enough coins to buy' : 'Недостаточно монет для покупки') : (currentLanguage === 'en' ? 'Click to buy skin' : 'Нажмите, чтобы купить скин'),
		};
	}

	function renderSkinsGrid() {
		if (!skinsGrid) return;

		skinsGrid.innerHTML = skins
			.map((skin) => {
				const buttonState = getSkinButtonState(skin);
				const rarityLabel = getRarityLabel(skin.rarity);
				const buttonClass = buttonState.className ? `skin-card__action ${buttonState.className}` : 'skin-card__action';
				const cardClass = buttonState.className === 'is-locked'
					? `skin-card skin-card--${skin.rarity} skin-card--locked`
					: `skin-card skin-card--${skin.rarity}`;

				return `
					<article class="${cardClass}">
						<div class="skin-card__icon" aria-hidden="true">${skin.icon}</div>
						<h3 class="skin-card__name">${getSkinNameById(skin.id, skin.name)}</h3>
						<span class="skin-card__rarity">${rarityLabel}</span>
						<button
							type="button"
							class="${buttonClass}"
							data-skin-id="${skin.id}"
							title="${buttonState.title}"
							aria-label="${buttonState.title}"
							${buttonState.disabled ? 'disabled' : ''}
						>
							${buttonState.text}
						</button>
					</article>
				`;
			})
			.join('');
	}

	function openSkinsModal() {
		if (!skinsModal) return;
		closeAllFeatureModals();
		renderSkinsGrid();
		skinsModal.classList.remove('hidden');
	}

	function closeSkinsModal() {
		if (!skinsModal) return;
		skinsModal.classList.add('hidden');
	}

	if (skinsBtn) {
		skinsBtn.addEventListener('click', () => {
			openSkinsModal();
		});
	}

	if (closeSkinsBtn) {
		closeSkinsBtn.addEventListener('click', () => {
			closeSkinsModal();
		});
	}

	if (skinsModal) {
		skinsModal.addEventListener('click', (event) => {
			if (event.target === skinsModal) {
				closeSkinsModal();
			}
		});
	}

	if (skinsGrid) {
		skinsGrid.addEventListener('click', (event) => {
			const target = event.target;
			if (!(target instanceof HTMLElement)) return;

			const actionBtn = target.closest('.skin-card__action');
			if (!actionBtn) return;

			const skinId = Number(actionBtn.dataset.skinId);
			const skin = skinById.get(skinId);
			if (!skin) return;

			const isOwned = ownedSkinIds.has(skin.id) || skin.price === 0;

			if (!isOwned) {
				if (coins < skin.price) return;
				coins -= skin.price;
				skinsBoughtCount += 1;
				ownedSkinIds.add(skin.id);
				selectedSkinId = skin.id;
			} else {
				selectedSkinId = skin.id;
			}

			updateClickObjectSkin();
			updateUI();
			saveGame();
			renderSkinsGrid();
		});
	}

	// Временные кликабельные обработчики для остальных кнопок панели

		if (achievementsBtn) {
			achievementsBtn.addEventListener('click', openAchievementsModal);
		}

		if (closeAchievementsBtn) {
			closeAchievementsBtn.addEventListener('click', closeAchievementsModal);
		}

		if (achievementsModal) {
			achievementsModal.addEventListener('click', (event) => {
				if (event.target === achievementsModal) {
					closeAchievementsModal();
				}
			});
		}

		if (achievementsList) {
			achievementsList.addEventListener('click', (event) => {
				const target = event.target;
				if (!(target instanceof HTMLElement)) return;
				const claimButton = target.closest('.achievement-card__claim-btn');
				if (!claimButton) return;
				const achievementId = claimButton.dataset.achievementId;
				const achievementKind = claimButton.dataset.achievementKind;
				if (!achievementId || !achievementKind) return;
				if (achievementKind === 'series') claimSeriesReward(achievementId);
				if (achievementKind === 'special') claimSpecialReward(achievementId);
			});
		}

	function closeAllFeatureModals() {
		// Единая точка закрытия игровых модалок: скины/бусты/достижения/статистика.
		// Это защищает от наложения нескольких окон и сохраняет единый UX.
		closeSkinsModal();
		closeBoostsModal();
		closeAchievementsModal();
		closeStatsModal();
	}

	function openStatsModal() {
		if (!statsModal) return;
		closeAllFeatureModals();
		renderStatistics();
		statsModal.classList.remove('hidden');
	}

	function closeStatsModal() {
		if (!statsModal) return;
		statsModal.classList.add('hidden');
	}

	if (statsBtn) {
		statsBtn.addEventListener('click', openStatsModal);
	}

	if (closeStatsBtn) {
		closeStatsBtn.addEventListener('click', closeStatsModal);
	}

	if (statsModal) {
		statsModal.addEventListener('click', (event) => {
			if (event.target === statsModal) {
				closeStatsModal();
			}
		});
	}

	function getBoostsUpgradedCount() {
		// Считаем, сколько бустов было улучшено/куплено хотя бы один раз.
		// Берём только реальные значения из boostLevels, без отдельного счётчика.
		return Object.values(boostLevels).reduce((count, value) => {
			return count + (Math.max(0, Math.floor(toFiniteNumber(value, 0))) > 0 ? 1 : 0);
		}, 0);
	}

	function getTotalBoostUsageCount() {
		// Сумма использований всех бустов из накопительного объекта boostUsageCount.
		return Object.values(boostUsageCount).reduce((sum, value) => {
			return sum + Math.max(0, Math.floor(toFiniteNumber(value, 0)));
		}, 0);
	}

	function getActiveBoostsCount() {
		// Считаем только бусты, которые реально активны на текущий момент,
		// чтобы статистика не показывала уже истёкшие записи.
		const now = Date.now();
		return Object.values(activeBoosts).reduce((count, boostData) => {
			return count + (toFiniteNumber(boostData?.endAt, 0) > now ? 1 : 0);
		}, 0);
	}

	function getSelectedSkinName() {
		const selectedSkin = skinById.get(selectedSkinId) || skinById.get(DEFAULT_SKIN_ID);
		return selectedSkin ? getSkinNameById(selectedSkin.id, selectedSkin.name) : (currentLanguage === 'en' ? 'Not selected' : 'Не выбран');
	}

	function renderStatistics() {
		if (!statsModal) return;

		const levelRequiredClicks = requiredClicksForLevel(level);
		const safeLevelClicks = Math.max(0, Math.floor(toFiniteNumber(levelClicks, 0)));
		const levelRemainingClicks = Math.max(0, levelRequiredClicks - safeLevelClicks);
		updateSpecialAchievementsState();
		const unlockedAchievementsCount = achievementsSeriesDefinitions.filter((series) => {
			const state = achievementSeriesState[series.id];
			if (!state) return false;
			if (state.completed) return true;
			const stage = series.stages[Math.min(state.stageIndex, series.stages.length - 1)];
			return getAchievementProgressValue(stage.metric) >= stage.goal;
		}).length + specialAchievements.filter((item) => item.unlocked).length;
		const claimedAchievementsCount = achievementsSeriesDefinitions.filter((series) => achievementSeriesState[series.id]?.completed).length + specialAchievements.filter((item) => item.claimed).length;

		if (statsEls.coinsCurrent) statsEls.coinsCurrent.textContent = String(Math.floor(toFiniteNumber(coins, 0)));
		if (statsEls.totalCoinsEarned) statsEls.totalCoinsEarned.textContent = String(Math.floor(toFiniteNumber(totalCoinsEarned, 0)));
		if (statsEls.totalClicks) statsEls.totalClicks.textContent = String(Math.floor(toFiniteNumber(totalClicks, 0)));

		if (statsEls.clickPowerBase) statsEls.clickPowerBase.textContent = String(Math.round(toFiniteNumber(clickPower, 0) * 100) / 100);
		if (statsEls.clickPowerEffective) statsEls.clickPowerEffective.textContent = String(Math.round(getEffectiveClickPower() * 100) / 100);
		if (statsEls.level) statsEls.level.textContent = String(Math.max(0, Math.floor(toFiniteNumber(level, 0))));
		if (statsEls.levelProgress) statsEls.levelProgress.textContent = `${safeLevelClicks} / ${levelRequiredClicks}`;
		if (statsEls.levelRemaining) statsEls.levelRemaining.textContent = String(levelRemainingClicks);
		if (statsEls.clickUpgrades) statsEls.clickUpgrades.textContent = String(Math.max(0, Math.floor(toFiniteNumber(clickUpgradesCount, 0))));

		if (statsEls.robotsCount) statsEls.robotsCount.textContent = String(Math.max(0, Math.floor(toFiniteNumber(robotCount, 0))));
		if (statsEls.robotsIncomeBase) statsEls.robotsIncomeBase.textContent = String(Math.round(Math.max(0, toFiniteNumber(robotIncomePerSecond, 0)) * 100) / 100);
		if (statsEls.robotsIncomeEffective) statsEls.robotsIncomeEffective.textContent = String(Math.round(Math.max(0, getEffectiveRobotIncome()) * 100) / 100);

		if (statsEls.skinsBought) statsEls.skinsBought.textContent = String(Math.max(0, Math.floor(toFiniteNumber(skinsBoughtCount, 0))));
		if (statsEls.skinsOwned) statsEls.skinsOwned.textContent = String(ownedSkinIds.size);
		if (statsEls.skinsSelected) statsEls.skinsSelected.textContent = getSelectedSkinName();

		if (statsEls.boostsUpgraded) statsEls.boostsUpgraded.textContent = String(getBoostsUpgradedCount());
		if (statsEls.boostsUsedTotal) statsEls.boostsUsedTotal.textContent = String(getTotalBoostUsageCount());
		if (statsEls.boostsTypesUsed) statsEls.boostsTypesUsed.textContent = String(boostTypesUsed.size);
		if (statsEls.boostsActive) statsEls.boostsActive.textContent = String(getActiveBoostsCount());
		if (statsEls.boostsBestCombo) statsEls.boostsBestCombo.textContent = String(Math.max(0, Math.floor(toFiniteNumber(achievementCounters.boostComboBest, 0))));
		if (statsEls.boostsTotalTime) statsEls.boostsTotalTime.textContent = String(Math.floor(Math.max(0, toFiniteNumber(achievementCounters.boostTime, 0))));

		if (statsEls.achievementsUnlocked) statsEls.achievementsUnlocked.textContent = String(unlockedAchievementsCount);
		if (statsEls.achievementsClaimed) statsEls.achievementsClaimed.textContent = String(claimedAchievementsCount);
		if (statsEls.achievementsSystem) statsEls.achievementsSystem.textContent = achievementsButtonUnlocked ? (currentLanguage === 'en' ? 'Yes' : 'Да') : (currentLanguage === 'en' ? 'No' : 'Нет');
	}

	function getBoostLevel(boostId) {
		return Math.max(0, Math.floor(toFiniteNumber(boostLevels[boostId], 0)));
	}

	function getBoostPrice(boost) {
		const level = getBoostLevel(boost.id);
		if (boost.oneTime) return boost.price;
		const growth = toFiniteNumber(boost.priceGrowth, 1.28);
		return Math.max(1, Math.floor(boost.price * Math.pow(growth, level)));
	}

	function isBoostActive(boostId) {
		const now = Date.now();
		const item = activeBoosts[boostId];
		if (!item) return false;
		return toFiniteNumber(item.endAt, 0) > now;
	}

	function updateBoostDerivedState() {
		critBoostActive = isBoostActive('critical_overload');
		boostTimeScale = isBoostActive('time_freeze') ? 0.5 : 1;
	}

	function getEffectiveClickPower() {
		let power = clickPower;
		power += getBoostLevel('processor_plus');
		if (getBoostLevel('evolution_module') > 0) {
			power *= 1 + (level * 0.05);
		}
		if (isBoostActive('neon_overdrive')) power *= 3;
		if (isBoostActive('rocket_pulse')) power *= 2.5;
		if (isBoostActive('galactic_breakthrough')) power *= 10;
		if (isBoostActive('omega_mode')) power *= 20;
		return power;
	}

		function getEffectiveCoinsPerClick() {
			let coinsPerClick = getEffectiveClickPower();
			if (isBoostActive('golden_storm')) coinsPerClick *= 2.5;
			if (getBoostLevel('space_amplifier') > 0) coinsPerClick *= 1.1;
			coinsPerClick *= permanentCoinBonusMultiplier;
			return coinsPerClick;
		}

		function getEffectiveRobotIncome() {
			let income = robotIncomePerSecond;
			income += getBoostLevel('eternal_generator') * 0.5;
			if (isBoostActive('rocket_pulse')) income *= 1.2;
			if (isBoostActive('drone_army')) income *= 3;
			if (isBoostActive('galactic_breakthrough')) income *= 5;
			if (getBoostLevel('space_amplifier') > 0) income *= 1.1;
			income *= permanentRobotBonusMultiplier;
			return income;
		}

	function showBoostActivation(text) {
		if (!clickObject) return;
		const pulse = document.createElement('div');
		pulse.className = 'boost-activate-fx';
		clickObject.appendChild(pulse);
		setTimeout(() => pulse.remove(), 750);

		const label = document.createElement('div');
		label.className = 'boost-fx-text';
		label.textContent = text;
		clickObject.appendChild(label);
		setTimeout(() => label.remove(), 920);
		playSound('menu');
	}

	function activateTimedBoost(boost) {
		const startAt = Date.now();
		const durationMs = Math.max(1000, Math.floor(toFiniteNumber(boost.duration, 10) * 1000));
		activeBoosts[boost.id] = { startAt, endAt: startAt + durationMs, durationMs };

		if (boost.id === 'time_freeze') {
			Object.entries(activeBoosts).forEach(([id, data]) => {
				if (id === 'time_freeze') return;
				data.endAt += durationMs;
				data.durationMs += durationMs;
				scheduleBoostTimer(id);
			});
		}

		scheduleBoostTimer(boost.id);
		updateBoostDerivedState();
		renderBoostsUI();
	}

	function deactivateBoost(boostId) {
		delete activeBoosts[boostId];
		const timer = boostTimers.get(boostId);
		if (timer) clearTimeout(timer);
		boostTimers.delete(boostId);
		updateBoostDerivedState();
		renderBoostsUI();
	}

	function scheduleBoostTimer(boostId) {
		const active = activeBoosts[boostId];
		if (!active) return;
		const existing = boostTimers.get(boostId);
		if (existing) clearTimeout(existing);
		const msLeft = Math.max(0, active.endAt - Date.now());
		const timeoutId = setTimeout(() => {
			deactivateBoost(boostId);
			saveGame();
		}, msLeft);
		boostTimers.set(boostId, timeoutId);
	}

	function getBoostActionState(boost) {
		const price = getBoostPrice(boost);
		if (boost.category === 'temporary') {
			const used = Math.max(0, Math.floor(toFiniteNumber(boostUsageCount[boost.id], 0)));
			if (isBoostActive(boost.id)) return { disabled: true, text: currentLanguage === 'en' ? 'Active' : 'Активен', meta: currentLanguage === 'en' ? 'Active (timer)' : 'Активен (таймер)' };
			if (used >= 20) return { disabled: true, text: currentLanguage === 'en' ? 'Limit' : 'Лимит', meta: currentLanguage === 'en' ? 'Left: 0/20' : 'Осталось: 0/20' };
			if (coins < price) return { disabled: true, text: currentLanguage === 'en' ? 'Not enough coins' : 'Недостаточно монет', meta: currentLanguage === 'en' ? `Left: ${20 - used}/20` : `Осталось: ${20 - used}/20` };
			return { disabled: false, text: currentLanguage === 'en' ? `Buy for ${price} 💰` : `Купить за ${price} 💰`, meta: currentLanguage === 'en' ? `Left: ${20 - used}/20` : `Осталось: ${20 - used}/20` };
		}
		if (boost.oneTime && getBoostLevel(boost.id) > 0) return { disabled: true, text: currentLanguage === 'en' ? 'Owned' : 'Куплено', meta: currentLanguage === 'en' ? 'One-time boost' : 'Одноразовый буст' };
		if (boost.category === 'super' && isBoostActive(boost.id)) return { disabled: true, text: currentLanguage === 'en' ? 'Active' : 'Активен', meta: currentLanguage === 'en' ? 'Active (timer)' : 'Активен (таймер)' };
		if (coins < price) return { disabled: true, text: currentLanguage === 'en' ? 'Not enough coins' : 'Недостаточно монет', meta: currentLanguage === 'en' ? `Price: ${price} 💰` : `Цена: ${price} 💰` };
		return { disabled: false, text: currentLanguage === 'en' ? `Buy for ${price} 💰` : `Купить за ${price} 💰`, meta: boost.category === 'permanent' ? (currentLanguage === 'en' ? `Level: ${getBoostLevel(boost.id)}` : `Уровень: ${getBoostLevel(boost.id)}`) : (currentLanguage === 'en' ? `Price: ${price} 💰` : `Цена: ${price} 💰`) };
	}

	function renderBoostTabs() {
		if (!boostsTabs) return;
		boostsTabs.innerHTML = boostCategories.map((cat) => `
			<button type="button" class="boosts-tab ${cat.id === currentBoostCategory ? 'is-active' : ''}" data-boost-category="${cat.id}">${cat.label[currentLanguage] || cat.label.ru}</button>
		`).join('');
	}

		function renderActiveBoosts() {
			const now = Date.now();
			const delta = Math.max(0, (now - lastBoostTick) / 1000);
			lastBoostTick = now;
			if (Object.keys(activeBoosts).length > 0) {
				achievementCounters.boostTime += delta;
			}
			achievementCounters.boostComboBest = Math.max(achievementCounters.boostComboBest, Object.keys(activeBoosts).length);
			if (!boostsActiveList) return;
			const items = Object.entries(activeBoosts)
			.filter(([, data]) => toFiniteNumber(data.endAt, 0) > now)
			.map(([id, data]) => {
				const boost = boostById.get(id);
				if (!boost) return '';
				const remainingMs = data.endAt - now;
				const seconds = Math.max(0, Math.ceil(remainingMs / 1000));
				const progress = data.durationMs > 0 ? (remainingMs / data.durationMs) * 100 : 0;
				return `
					<div class="boost-active-item">
						<div class="boost-active-item__icon">${boost.icon}</div>
						<div>
							<div class="boost-active-item__name">${getBoostText(boost, 'name')} — ${seconds}${currentLanguage === 'en' ? 's' : 'с'}</div>
							<div class="boost-active-item__time">${currentLanguage === 'en' ? 'Left' : 'Осталось'} ${seconds}${currentLanguage === 'en' ? 's' : 'с'}</div>
						</div>
						<div class="boost-progress"><div class="boost-progress__fill" style="width:${Math.max(0, Math.min(100, progress)).toFixed(1)}%"></div></div>
					</div>
				`;
			})
			.filter(Boolean);
		boostsActiveList.innerHTML = items.length ? items.join('') : `<div class="boost-active-item"><div class="boost-active-item__name">${currentLanguage === 'en' ? 'No active boosts' : 'Нет активных бустов'}</div></div>`;
	}

	function renderBoostsGrid() {
		if (!boostsGrid) return;
		const filtered = boosts.filter((boost) => boost.category === currentBoostCategory);
		boostsGrid.innerHTML = filtered.map((boost) => {
			const action = getBoostActionState(boost);
			const rarityClass = `boost-card boost-card--${boost.rarity === 'epic' ? 'epic' : boost.rarity === 'rare' ? 'rare' : 'common'}`;
			return `
				<article class="${rarityClass}">
					<div class="boost-card__icon">${boost.icon}</div>
					<h3 class="boost-card__name">${getBoostText(boost, 'name')}</h3>
					<p class="boost-card__desc">${getBoostText(boost, 'desc')}</p>
					<div class="boost-card__price">${action.meta}</div>
					<div class="boost-card__meta">${boost.category === 'temporary' || boost.category === 'super' ? (currentLanguage === 'en' ? `Duration: ${boost.duration}s` : `Длительность: ${boost.duration}с`) : (currentLanguage === 'en' ? 'Permanent effect / instant' : 'Постоянный эффект / моментально')}</div>
					<button class="boost-card__action" type="button" data-boost-id="${boost.id}" ${action.disabled ? 'disabled' : ''}>${action.text}</button>
				</article>
			`;
		}).join('');
	}

	function renderBoostsUI() {
		renderBoostTabs();
		renderBoostsGrid();
		renderActiveBoosts();
	}

	function openBoostsModal() {
		if (!boostsModal) return;
		closeAllFeatureModals();
		renderBoostsUI();
		boostsModal.classList.remove('hidden');
	}

	function closeBoostsModal() {
		if (!boostsModal) return;
		boostsModal.classList.add('hidden');
	}

	function getOfflineBonusReward() {
		const base = Math.max(0, getEffectiveRobotIncome());
		return Math.floor(base * 30);
	}

		function applyInstantBoost(boost) {
			if (boost.id === 'coin_burst') {
				coins += 500;
				totalCoinsEarned += 500;
				showBoostActivation(currentLanguage === 'en' ? '+500 COINS' : '+500 МОНЕТ');
			}
		if (boost.id === 'super_click') {
			pendingSuperClick = true;
			showBoostActivation(currentLanguage === 'en' ? 'SUPER CLICK x25' : 'СУПЕР КЛИК x25');
		}
		if (boost.id === 'discount_protocol') {
			pendingDiscount = true;
			showBoostActivation(currentLanguage === 'en' ? 'DISCOUNT -50%' : 'СКИДКА -50%');
		}
			if (boost.id === 'offline_bonus') {
				const reward = getOfflineBonusReward();
				coins += reward;
				totalCoinsEarned += reward;
				showBoostActivation(currentLanguage === 'en' ? `OFFLINE +${reward}` : `ОФЛАЙН +${reward}`);
			}
		}

		function buyBoost(boostId) {
			const boost = boostById.get(boostId);
			if (!boost) return;
			boostTypesUsed.add(boost.category);
			const price = getBoostPrice(boost);
		if (coins < price) return;

		if (boost.category === 'temporary') {
			const used = Math.max(0, Math.floor(toFiniteNumber(boostUsageCount[boost.id], 0)));
			if (used >= 20 || isBoostActive(boost.id)) return;
			coins -= price;
			boostLevels[boost.id] = getBoostLevel(boost.id) + 1;
			boostUsageCount[boost.id] = used + 1;
			closeBoostsModal();
			activateTimedBoost(boost);
			showBoostActivation(currentLanguage === 'en' ? (boost.id === 'neon_overdrive' ? '×3 CLICK' : boost.id === 'drone_army' ? 'DRONES ACTIVE' : 'BOOST ACTIVE') : (boost.id === 'neon_overdrive' ? '×3 КЛИК' : boost.id === 'drone_army' ? 'ДРОНЫ АКТИВНЫ' : 'БУСТ АКТИВЕН'));
		}

		if (boost.category === 'super') {
			if (isBoostActive(boost.id)) return;
			coins -= price;
			boostLevels[boost.id] = getBoostLevel(boost.id) + 1;
			closeBoostsModal();
			activateTimedBoost(boost);
			showBoostActivation(boost.id === 'omega_mode' ? 'OMEGA MODE' : (currentLanguage === 'en' ? 'SUPER BOOST' : 'СУПЕР БУСТ'));
		}

		if (boost.category === 'instant') {
			coins -= price;
			applyInstantBoost(boost);
			boostLevels[boost.id] = getBoostLevel(boost.id) + 1;
		}

		if (boost.category === 'permanent') {
			if (boost.oneTime && getBoostLevel(boost.id) > 0) return;
			coins -= price;
			boostLevels[boost.id] = getBoostLevel(boost.id) + 1;
			showBoostActivation(currentLanguage === 'en' ? 'UPGRADE INSTALLED' : 'АПГРЕЙД УСТАНОВЛЕН');
		}

		updateBoostDerivedState();
		updateUI();
		renderBoostsUI();
		saveGame();
	}

	if (boostsBtn) {
		boostsBtn.addEventListener('click', openBoostsModal);
	}

	if (closeBoostsBtn) {
		closeBoostsBtn.addEventListener('click', closeBoostsModal);
	}

	if (boostsModal) {
		boostsModal.addEventListener('click', (event) => {
			if (event.target === boostsModal) closeBoostsModal();
		});
	}

	if (boostsTabs) {
		boostsTabs.addEventListener('click', (event) => {
			const target = event.target;
			if (!(target instanceof HTMLElement)) return;
			const tab = target.closest('.boosts-tab');
			if (!tab) return;
			const category = tab.dataset.boostCategory;
			if (!category) return;
			currentBoostCategory = category;
			renderBoostsUI();
		});
	}

	if (boostsGrid) {
		boostsGrid.addEventListener('click', (event) => {
			const target = event.target;
			if (!(target instanceof HTMLElement)) return;
			const actionBtn = target.closest('.boost-card__action');
			if (!actionBtn) return;
			const boostId = actionBtn.dataset.boostId;
			if (!boostId) return;
			buyBoost(boostId);
		});
	}


	const RESET_BUTTON_IDLE_TEXT = () => (currentLanguage === 'en' ? 'Reset all progress' : 'Сбросить весь прогресс');
	const RESET_BUTTON_ARMED_TEXT = () => (currentLanguage === 'en' ? 'Hold for 3 seconds' : 'Держите 3 секунды');
	const RESET_HOLD_DURATION_MS = 3000;
	const RESET_ARM_TIMEOUT_MS = 30000;

	let resetArmTimeout = null;
	let resetHoldRaf = null;
	let resetHoldStart = 0;
	let resetArmed = false;
	let resetHolding = false;

	function clearResetArmTimeout() {
		if (!resetArmTimeout) return;
		clearTimeout(resetArmTimeout);
		resetArmTimeout = null;
	}

	function setResetLabel(text) {
		if (resetProgressLabel) {
			resetProgressLabel.textContent = text;
		}
	}

	function setResetProgress(progress) {
		if (!resetProgressOverlay) return;
		const safeProgress = Math.max(0, Math.min(1, toFiniteNumber(progress, 0)));
		resetProgressOverlay.style.transform = `scaleX(${safeProgress})`;
	}

	function resetButtonToIdleState() {
		clearResetArmTimeout();
		if (resetHoldRaf) {
			cancelAnimationFrame(resetHoldRaf);
			resetHoldRaf = null;
		}

		resetArmed = false;
		resetHolding = false;
		if (resetProgressBtn) {
			resetProgressBtn.classList.remove('is-armed', 'is-holding');
		}
		setResetLabel(RESET_BUTTON_IDLE_TEXT());
		setResetProgress(0);
	}

	function armResetButton() {
		if (!resetProgressBtn) return;
		clearResetArmTimeout();
		resetArmed = true;
		resetProgressBtn.classList.add('is-armed');
		setResetLabel(RESET_BUTTON_ARMED_TEXT());

		resetArmTimeout = setTimeout(() => {
			resetButtonToIdleState();
		}, RESET_ARM_TIMEOUT_MS);
	}

	function createInitialGameState() {
		return {
			coins: 0,
			clickPower: 1,
			upgradePrice: 85,
			robotPrice: ROBOT_BASE_PRICE,
			robotCount: 0,
			robotIncomePerSecond: 0,
			level: 0,
			levelClicks: 0,
			ownedSkinIds: new Set([DEFAULT_SKIN_ID]),
			selectedSkinId: DEFAULT_SKIN_ID,
			boostLevels: {},
			boostUsageCount: {},
			activeBoosts: {},
			pendingDiscount: false,
			pendingSuperClick: false,
			boostTimeScale: 1,
			critBoostActive: false,
			totalClicks: 0,
			totalCoinsEarned: 0,
			clickUpgradesCount: 0,
			skinsBoughtCount: 0,
			achievementsButtonUnlocked: false,
			achievementCounters: { boostComboBest: 0, boostTime: 0 },
			boostTypesUsed: [],
			brightness: DEFAULT_BRIGHTNESS,
			volume: DEFAULT_VOLUME,
			theme: DEFAULT_THEME,
		};
	}

	function clearGameStorage() {
		GAME_STORAGE_KEYS.forEach((key) => {
			try {
				localStorage.removeItem(key);
			} catch {
				// localStorage может быть недоступен
			}
		});
	}

	function resetAchievementsToInitialState() {
		achievementsButtonUnlocked = false;
		achievementCounters.boostComboBest = 0;
		achievementCounters.boostTime = 0;
		boostTypesUsed.clear();
		achievementsSeriesDefinitions.forEach((series) => {
			achievementSeriesState[series.id] = { stageIndex: 0, stageClaimed: false, completed: false };
		});
		specialAchievements.forEach((item) => {
			item.unlocked = false;
			item.claimed = false;
		});
		updatePermanentBonusesFromAchievements();
		restoreAchievementsButtonState();
	}

	function clearTransientUIState() {
		// Закрываем все модалки и приводим экран к состоянию меню.
		if (aboutScreen) aboutScreen.classList.add('hidden');
		if (settingsScreen) settingsScreen.classList.add('hidden');
		closeSkinsModal();
		closeBoostsModal();
		closeAchievementsModal();
		closeStatsModal();
		if (menuScreen) menuScreen.classList.remove('hidden');

		// Удаляем временные «всплывающие» числа от прошлой сессии.
		document.querySelectorAll('.floating-number').forEach((el) => el.remove());

		// Сбрасываем состояние кнопки reset (armed/holding/progress).
		resetButtonToIdleState();
	}

	function stopAllTransientProcesses() {
		stopRobotIncomeTimer();
		boostTimers.forEach((timer) => clearTimeout(timer));
		boostTimers.clear();
		activeBoosts = {};
		lastBoostTick = Date.now();
	}

	function applyInterfaceSettings(options = {}) {
		const {
			brightnessValue = brightness,
			volumeValue = globalVolume,
			themeValue = DEFAULT_THEME,
			save = false,
		} = options;

		applyBrightness(brightnessValue, { syncSlider: true, syncState: true });
		applyGlobalVolume(volumeValue);
		applyTheme(themeValue);
		setSelectToTheme(themeValue);

		if (save) {
			setStorageItem(BRIGHTNESS_KEY, brightness);
			setStorageItem(VOLUME_KEY, globalVolume);
			setStorageItem(THEME_KEY, normalizeTheme(themeValue));
		}
	}

	function applyGameState(state) {
		coins = state.coins;
		clickPower = state.clickPower;
		upgradePrice = state.upgradePrice;
		robotPrice = state.robotPrice;
		robotCount = state.robotCount;
		robotIncomePerSecond = state.robotIncomePerSecond;
		level = state.level;
		levelClicks = state.levelClicks;
		ownedSkinIds = new Set(state.ownedSkinIds);
		selectedSkinId = state.selectedSkinId;
		boostLevels = { ...state.boostLevels };
		boostUsageCount = { ...state.boostUsageCount };
		activeBoosts = { ...state.activeBoosts };
		pendingDiscount = state.pendingDiscount;
		pendingSuperClick = state.pendingSuperClick;
		boostTimeScale = state.boostTimeScale;
		critBoostActive = state.critBoostActive;
		totalClicks = state.totalClicks;
		totalCoinsEarned = state.totalCoinsEarned;
		clickUpgradesCount = state.clickUpgradesCount;
		skinsBoughtCount = state.skinsBoughtCount;

		resetAchievementsToInitialState();
		achievementsButtonUnlocked = state.achievementsButtonUnlocked;
		achievementCounters.boostComboBest = state.achievementCounters.boostComboBest;
		achievementCounters.boostTime = state.achievementCounters.boostTime;
		boostTypesUsed.clear();
		state.boostTypesUsed.forEach((type) => boostTypesUsed.add(String(type)));

		if (state.achievementsState && typeof state.achievementsState === 'object' && !Array.isArray(state.achievementsState)) {
			const seriesState = state.achievementsState.seriesState || {};
			Object.entries(seriesState).forEach(([seriesId, saved]) => {
				if (!achievementSeriesState[seriesId]) return;
				achievementSeriesState[seriesId].stageIndex = Math.max(0, Math.floor(toFiniteNumber(saved.stageIndex, 0)));
				achievementSeriesState[seriesId].completed = Boolean(saved.completed);
			});
			const byId = new Map((state.achievementsState.specialState || []).map((it) => [String(it.id), it]));
			specialAchievements.forEach((achievement) => {
				const saved = byId.get(achievement.id);
				if (!saved) return;
				achievement.unlocked = Boolean(saved.unlocked);
				achievement.claimed = Boolean(saved.claimed);
			});
		} else if (Array.isArray(state.achievementsState)) {
			const byId = new Map(state.achievementsState.map((it) => [Number(it.id), it]));
			achievementsSeriesDefinitions.forEach((series) => {
				const legacyIds = LEGACY_SERIES_ID_MAP[series.id] || [];
				const claimedCount = legacyIds.reduce((sum, id) => sum + (byId.get(id)?.claimed ? 1 : 0), 0);
				if (claimedCount >= series.stages.length) {
					achievementSeriesState[series.id].stageIndex = series.stages.length - 1;
					achievementSeriesState[series.id].completed = true;
				} else {
					achievementSeriesState[series.id].stageIndex = Math.max(0, claimedCount);
				}
			});
			specialAchievements.forEach((achievement) => {
				const legacyId = LEGACY_SPECIAL_ID_MAP[achievement.id];
				const saved = byId.get(legacyId);
				if (!saved) return;
				achievement.unlocked = Boolean(saved.unlocked);
				achievement.claimed = Boolean(saved.claimed);
			});
		}
		updateSpecialAchievementsState();
		updatePermanentBonusesFromAchievements();
		restoreAchievementsButtonState();
	}

	function resetGameProgress() {
		const initialState = createInitialGameState();
		stopAllTransientProcesses();
		clearGameStorage();
		applyGameState(initialState);
		applyInterfaceSettings({
			brightnessValue: initialState.brightness,
			volumeValue: initialState.volume,
			themeValue: initialState.theme,
			save: true,
		});
		updateBoostDerivedState();
		updateClickObjectSkin();
		renderSkinsGrid();
		updateUI();
		clearTransientUIState();
		saveGame();
	}


	function finishResetHold() {
		setResetProgress(1);
		resetGameProgress();
	}

	function tickResetHold(timestamp) {
		if (!resetHolding) return;
		const elapsed = timestamp - resetHoldStart;
		const progress = elapsed / RESET_HOLD_DURATION_MS;
		setResetProgress(progress);

		if (progress >= 1) {
			resetHolding = false;
			if (resetProgressBtn) {
				resetProgressBtn.classList.remove('is-holding');
			}
			finishResetHold();
			return;
		}

		resetHoldRaf = requestAnimationFrame(tickResetHold);
	}

	function startResetHold() {
		if (!resetProgressBtn || !resetArmed || resetHolding) return;
		clearResetArmTimeout();
		resetHolding = true;
		resetProgressBtn.classList.add('is-holding');
		resetHoldStart = performance.now();
		setResetProgress(0);
		resetHoldRaf = requestAnimationFrame(tickResetHold);
	}

	function cancelResetHold() {
		if (!resetHolding) return;
		resetButtonToIdleState();
	}

	function triggerResetClickPulse() {
		if (!resetProgressBtn) return;
		resetProgressBtn.classList.remove('is-click-pulse');
		void resetProgressBtn.offsetWidth;
		resetProgressBtn.classList.add('is-click-pulse');
	}

	function initResetProgressButton() {
		if (!resetProgressBtn) return;
		resetButtonToIdleState();

		resetProgressBtn.addEventListener('pointerdown', (event) => {
			if (event.pointerType === 'mouse' && event.button !== 0) return;
			triggerResetClickPulse();
		});

		resetProgressBtn.addEventListener('click', () => {
			if (!resetArmed && !resetHolding) {
				armResetButton();
			}
		});

		resetProgressBtn.addEventListener('animationend', (event) => {
			if (event.animationName === 'restartTapPulse') {
				resetProgressBtn.classList.remove('is-click-pulse');
			}
		});

		const onPressStart = (event) => {
			if (!resetArmed || resetHolding) return;
			if (event.type === 'mousedown' && event.button !== 0) return;
			startResetHold();
		};

		const onPressCancel = () => {
			cancelResetHold();
		};

		resetProgressBtn.addEventListener('mousedown', onPressStart);
		resetProgressBtn.addEventListener('touchstart', onPressStart, { passive: true });
		resetProgressBtn.addEventListener('mouseup', onPressCancel);
		resetProgressBtn.addEventListener('mouseleave', onPressCancel);
		resetProgressBtn.addEventListener('touchend', onPressCancel);
		resetProgressBtn.addEventListener('touchcancel', onPressCancel);
		resetProgressBtn.addEventListener('pointercancel', onPressCancel);
	}

	function isSpecialSoundButton(button) {
		if (!button) return true;
		if (button.disabled) return true;

		// У кнопки "Начать играть" свой отдельный звук
		if (startBtn && button === startBtn) return true;

		// У объекта клика (робота) свой отдельный звук,
		// даже если он когда-нибудь станет кнопкой или окажется внутри кнопки
		if (clickObject) {
			if (button === clickObject) return true;
			if (button.contains(clickObject)) return true;
			if (clickObject.contains(button)) return true;
		}

		return false;
	}

	function bindGenericButtonSound() {
		document.addEventListener('click', (e) => {
			const target = e.target;
			if (!(target instanceof Element)) return;

			const button = target.closest(
				'button, input[type="button"], input[type="submit"], input[type="reset"], [role="button"]'
			);

			if (!button) return;
			if (!document.contains(button)) return;
			if (isSpecialSoundButton(button)) return;

			playSound('menu');
		});
	}

	//---------------КЛИКЕР-------------------------------------
	function startRobotIncomeTimer() {
		if (robotTimer || robotIncomePerSecond <= 0) return;

		robotTimer = setInterval(() => {
			const robotIncome = getEffectiveRobotIncome();
			coins += robotIncome;
			totalCoinsEarned += robotIncome;
			updateUI();
			saveGame();
		}, 1000);
	}

	function stopRobotIncomeTimer() {
		if (!robotTimer) return;
		clearInterval(robotTimer);
		robotTimer = null;
	}

	// Обновляет числа на экране
		function updateUI() {
			if (scoreEl) scoreEl.textContent = String(coins);
			if (moneyCounterEl) moneyCounterEl.textContent = String(coins);
			if (clickPowerEl) clickPowerEl.textContent = String(Math.round(getEffectiveClickPower() * 100) / 100);
			updateLevelUI();
			updateClickUpgradeUI();
			updateRobotUpgradeUI();
			renderSkinsGrid();
			if (achievementsModal && !achievementsModal.classList.contains('hidden')) {
				renderAchievements();
			}
			renderStatistics();
		}

	// Сохраняем данные в localStorage
	function saveGame() {
		setStorageItem('coins', Math.max(0, toFiniteNumber(coins, 0)));
		setStorageItem('clickPower', Math.max(1, toFiniteNumber(clickPower, 1)));
		setStorageItem(CLICK_UPGRADE_PRICE_KEY, Math.max(1, toFiniteNumber(upgradePrice, 85)));
		setStorageItem(ROBOT_PRICE_KEY, Math.max(ROBOT_BASE_PRICE, toFiniteNumber(robotPrice, ROBOT_BASE_PRICE)));
		setStorageItem(ROBOT_COUNT_KEY, Math.max(0, Math.floor(toFiniteNumber(robotCount, 0))));
		setStorageItem(ROBOT_INCOME_KEY, Math.max(0, Math.floor(toFiniteNumber(robotIncomePerSecond, 0))));
		setStorageItem(BRIGHTNESS_KEY, clamp(brightness, BR_MIN, BR_MAX));
		setStorageItem(VOLUME_KEY, clamp01(globalVolume));
		setStorageItem(LEVEL_KEY, Math.max(0, Math.floor(toFiniteNumber(level, 0))));
		setStorageItem(LEVEL_CLICKS_KEY, Math.max(0, Math.floor(toFiniteNumber(levelClicks, 0))));
		setStorageItem(SKINS_OWNED_KEY, JSON.stringify(Array.from(ownedSkinIds)));
		setStorageItem(SKINS_SELECTED_KEY, Math.max(DEFAULT_SKIN_ID, Math.floor(toFiniteNumber(selectedSkinId, DEFAULT_SKIN_ID))));
			setStorageItem(BOOST_LEVELS_KEY, JSON.stringify(boostLevels));
			setStorageItem(BOOST_USAGE_KEY, JSON.stringify(boostUsageCount));
			setStorageItem(BOOST_ACTIVE_KEY, JSON.stringify(activeBoosts));
			setStorageItem(BOOST_PENDING_DISCOUNT_KEY, pendingDiscount ? '1' : '0');
			setStorageItem(BOOST_PENDING_SUPER_CLICK_KEY, pendingSuperClick ? '1' : '0');
			setStorageItem(TOTAL_CLICKS_KEY, Math.max(0, Math.floor(toFiniteNumber(totalClicks, 0))));
			setStorageItem(TOTAL_COINS_EARNED_KEY, Math.max(0, toFiniteNumber(totalCoinsEarned, 0)));
			setStorageItem(CLICK_UPGRADES_COUNT_KEY, Math.max(0, Math.floor(toFiniteNumber(clickUpgradesCount, 0))));
			setStorageItem(SKINS_BOUGHT_COUNT_KEY, Math.max(0, Math.floor(toFiniteNumber(skinsBoughtCount, 0))));
			setStorageItem(ACHIEVEMENTS_BUTTON_UNLOCKED_KEY, achievementsButtonUnlocked ? '1' : '0');
			setStorageItem(ACHIEVEMENTS_COUNTERS_KEY, JSON.stringify({ ...achievementCounters, boostTypesUsed: Array.from(boostTypesUsed) }));
			setStorageItem(ACHIEVEMENTS_STATE_KEY, JSON.stringify({ seriesState: achievementSeriesState, specialState: specialAchievements.map((item) => ({ id: item.id, unlocked: item.unlocked, claimed: item.claimed })) }));
		}

	// Загружаем данные из localStorage
	function loadGame() {
		const initialState = createInitialGameState();
		const loadedState = createInitialGameState();

		const savedCoins = getStorageItem('coins');
		const savedClickPower = getStorageItem('clickPower');
		const savedUpgradePrice = getStorageItem(CLICK_UPGRADE_PRICE_KEY);
		const savedRobotPrice = getStorageItem(ROBOT_PRICE_KEY);
		const savedRobotCount = getStorageItem(ROBOT_COUNT_KEY);
		const savedRobotIncome = getStorageItem(ROBOT_INCOME_KEY);
		const savedBrightness = getStorageItem(BRIGHTNESS_KEY);
		const savedVolume = getStorageItem(VOLUME_KEY);
		const savedTheme = getStorageItem(THEME_KEY);
		const savedLevel = getStorageItem(LEVEL_KEY);
		const savedLevelClicks = getStorageItem(LEVEL_CLICKS_KEY);
		const savedOwnedSkins = getStorageItem(SKINS_OWNED_KEY);
		const savedSelectedSkin = getStorageItem(SKINS_SELECTED_KEY);
		const savedBoostLevels = getStorageItem(BOOST_LEVELS_KEY);
		const savedBoostUsage = getStorageItem(BOOST_USAGE_KEY);
		const savedActiveBoosts = getStorageItem(BOOST_ACTIVE_KEY);
		const savedPendingDiscount = getStorageItem(BOOST_PENDING_DISCOUNT_KEY);
		const savedPendingSuperClick = getStorageItem(BOOST_PENDING_SUPER_CLICK_KEY);
		const savedTotalClicks = getStorageItem(TOTAL_CLICKS_KEY);
		const savedTotalCoinsEarned = getStorageItem(TOTAL_COINS_EARNED_KEY);
		const savedClickUpgradesCount = getStorageItem(CLICK_UPGRADES_COUNT_KEY);
		const savedSkinsBoughtCount = getStorageItem(SKINS_BOUGHT_COUNT_KEY);
		const savedAchievementsButtonUnlocked = getStorageItem(ACHIEVEMENTS_BUTTON_UNLOCKED_KEY);
		const savedAchievementCounters = getStorageItem(ACHIEVEMENTS_COUNTERS_KEY);
		const savedAchievementsState = getStorageItem(ACHIEVEMENTS_STATE_KEY);

		if (savedCoins !== null) loadedState.coins = Math.max(0, toFiniteNumber(savedCoins, initialState.coins));
		if (savedClickPower !== null) loadedState.clickPower = Math.max(1, toFiniteNumber(savedClickPower, initialState.clickPower));
		if (savedUpgradePrice !== null) loadedState.upgradePrice = Math.max(1, toFiniteNumber(savedUpgradePrice, initialState.upgradePrice));
		if (savedRobotPrice !== null) loadedState.robotPrice = Math.max(ROBOT_BASE_PRICE, toFiniteNumber(savedRobotPrice, initialState.robotPrice));
		if (savedRobotCount !== null) loadedState.robotCount = Math.max(0, Math.floor(toFiniteNumber(savedRobotCount, initialState.robotCount)));
		if (savedRobotIncome !== null) {
			loadedState.robotIncomePerSecond = Math.max(0, Math.floor(toFiniteNumber(savedRobotIncome, initialState.robotIncomePerSecond)));
		} else {
			loadedState.robotIncomePerSecond = loadedState.robotCount;
		}
		if (savedLevel !== null) loadedState.level = Math.max(0, Math.floor(toFiniteNumber(savedLevel, initialState.level)));
		if (savedLevelClicks !== null) loadedState.levelClicks = Math.max(0, Math.floor(toFiniteNumber(savedLevelClicks, initialState.levelClicks)));

		if (savedOwnedSkins) {
			try {
				const parsed = JSON.parse(savedOwnedSkins);
				if (Array.isArray(parsed)) {
					loadedState.ownedSkinIds = new Set(parsed.map((value) => Math.floor(toFiniteNumber(value, -1))).filter((id) => skinById.has(id)));
				}
			} catch {
				loadedState.ownedSkinIds = new Set([DEFAULT_SKIN_ID]);
			}
		}
		loadedState.ownedSkinIds.add(DEFAULT_SKIN_ID);

		if (savedSelectedSkin !== null) {
			const parsedSelected = Math.floor(toFiniteNumber(savedSelectedSkin, DEFAULT_SKIN_ID));
			loadedState.selectedSkinId = (skinById.has(parsedSelected) && loadedState.ownedSkinIds.has(parsedSelected)) ? parsedSelected : DEFAULT_SKIN_ID;
		}

		if (savedBoostLevels) {
			try { loadedState.boostLevels = JSON.parse(savedBoostLevels) || {}; } catch { loadedState.boostLevels = {}; }
		}
		if (savedBoostUsage) {
			try { loadedState.boostUsageCount = JSON.parse(savedBoostUsage) || {}; } catch { loadedState.boostUsageCount = {}; }
		}
		if (savedActiveBoosts) {
			try { loadedState.activeBoosts = JSON.parse(savedActiveBoosts) || {}; } catch { loadedState.activeBoosts = {}; }
		}

		loadedState.pendingDiscount = savedPendingDiscount === '1';
		loadedState.pendingSuperClick = savedPendingSuperClick === '1';
		if (savedTotalClicks !== null) loadedState.totalClicks = Math.max(0, Math.floor(toFiniteNumber(savedTotalClicks, initialState.totalClicks)));
		if (savedTotalCoinsEarned !== null) loadedState.totalCoinsEarned = Math.max(0, toFiniteNumber(savedTotalCoinsEarned, loadedState.coins));
		if (savedClickUpgradesCount !== null) loadedState.clickUpgradesCount = Math.max(0, Math.floor(toFiniteNumber(savedClickUpgradesCount, initialState.clickUpgradesCount)));
		if (savedSkinsBoughtCount !== null) loadedState.skinsBoughtCount = Math.max(0, Math.floor(toFiniteNumber(savedSkinsBoughtCount, initialState.skinsBoughtCount)));
		loadedState.achievementsButtonUnlocked = savedAchievementsButtonUnlocked === '1';

		if (savedAchievementCounters) {
			try {
				const parsedCounters = JSON.parse(savedAchievementCounters) || {};
				loadedState.achievementCounters.boostComboBest = Math.max(0, Math.floor(toFiniteNumber(parsedCounters.boostComboBest, 0)));
				loadedState.achievementCounters.boostTime = Math.max(0, toFiniteNumber(parsedCounters.boostTime, 0));
				if (Array.isArray(parsedCounters.boostTypesUsed)) {
					loadedState.boostTypesUsed = parsedCounters.boostTypesUsed.map((type) => String(type));
				}
			} catch {
				loadedState.achievementCounters = { ...initialState.achievementCounters };
				loadedState.boostTypesUsed = [];
			}
		}

		if (savedAchievementsState) {
			try {
				const parsedState = JSON.parse(savedAchievementsState);
				if (Array.isArray(parsedState) || (parsedState && typeof parsedState === 'object')) loadedState.achievementsState = parsedState;
			} catch {
				// игнор
			}
		}

		loadedState.brightness = savedBrightness !== null
			? clamp(savedBrightness, BR_MIN, BR_MAX)
			: initialState.brightness;
		loadedState.volume = savedVolume !== null ? clamp01(savedVolume) : initialState.volume;
		loadedState.theme = savedTheme !== null ? normalizeTheme(savedTheme) : initialState.theme;

		stopAllTransientProcesses();
		applyGameState(loadedState);
		applyInterfaceSettings({
			brightnessValue: loadedState.brightness,
			volumeValue: loadedState.volume,
			themeValue: loadedState.theme,
			save: false,
		});

		const now = Date.now();
		Object.entries(activeBoosts).forEach(([id, data]) => {
			if (toFiniteNumber(data.endAt, 0) <= now) {
				delete activeBoosts[id];
				return;
			}
			if (!toFiniteNumber(data.durationMs, 0)) {
				activeBoosts[id].durationMs = Math.max(1000, toFiniteNumber(data.endAt, now) - toFiniteNumber(data.startAt, now));
			}
			scheduleBoostTimer(id);
		});
		updateBoostDerivedState();
	}

	// Клик по роботу
	if (clickObject) {
		clickObject.addEventListener('pointerdown', (e) => {
			e.preventDefault();
			playSound('click');
			let gainedCoins = getEffectiveCoinsPerClick();
			if (pendingSuperClick) {
				gainedCoins *= 25;
				pendingSuperClick = false;
			}
			if (critBoostActive && Math.random() < 0.3) {
				gainedCoins *= 10;
				showBoostActivation(currentLanguage === 'en' ? 'CRIT x10' : 'КРИТ x10');
			}
				coins += gainedCoins;
				totalCoinsEarned += gainedCoins;
				totalClicks += 1;

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
			createFloatingNumber(e.clientX, e.clientY, Math.round(gainedCoins * 100) / 100);
		});
	}

	bindGenericButtonSound();
	initResetProgressButton();
	initVolumeControl();
		loadGame(); // 1. загружаем сохранение
		totalCoinsEarned = Math.max(totalCoinsEarned, coins);
		restoreAchievementsButtonState();
		updatePermanentBonusesFromAchievements();
	setInterval(() => {
		renderActiveBoosts();
	}, 250);
	updateClickObjectSkin();
	renderSkinsGrid();
	if (robotIncomePerSecond > 0) {
		startRobotIncomeTimer();
	} else {
		stopRobotIncomeTimer();
	}
	updateUI(); // 2. показываем данные на экране
	applyInterfaceSettings({
		brightnessValue: brightness,
		volumeValue: globalVolume,
		themeValue: getStorageItem(THEME_KEY) || DEFAULT_THEME,
		save: false,
	});

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
		const displayPrice = pendingDiscount ? Math.floor(upgradePrice * 0.5) : upgradePrice;
		if (upgradeClickPriceEl) {
			upgradeClickPriceEl.textContent = `${displayPrice} 💰`;
		}

		// Блокировка/разблокировка
		if (upgradeClickBtn) {
			const disabled = coins < displayPrice;
			upgradeClickBtn.disabled = disabled;
			upgradeClickBtn.classList.toggle('disabled', disabled);
		}
	}

	function updateRobotUpgradeUI() {
		const displayPrice = pendingDiscount ? Math.floor(robotPrice * 0.5) : robotPrice;
		if (autoBotPriceEl) {
			autoBotPriceEl.textContent = `${displayPrice} 💰`;
		}

		if (robotInfoEl) {
			robotInfoEl.textContent = currentLanguage === 'en' ? `+${robotIncomePerSecond}/sec • ${robotCount} bought` : `+${robotIncomePerSecond}/сек • ${robotCount} куплено`;
		}

		if (autoBotBtn) {
			const disabled = coins < displayPrice;
			autoBotBtn.disabled = disabled;
			autoBotBtn.classList.toggle('disabled', disabled);
		}
	}

	function buyAutoBot() {
		const finalPrice = pendingDiscount ? Math.floor(robotPrice * 0.5) : robotPrice;
		if (coins < finalPrice) return;
		coins -= finalPrice;
		pendingDiscount = false;
		robotCount += 1;
		robotIncomePerSecond += 1;
		robotPrice *= 2;

		startRobotIncomeTimer();
		updateUI();
		saveGame();
	}

	// Покупка улучшения клика
	function buyClickUpgrade() {
		const finalPrice = pendingDiscount ? Math.floor(upgradePrice * 0.5) : upgradePrice;
		if (coins < finalPrice) return;

			coins -= finalPrice;
			pendingDiscount = false;
			clickPower += 1;
			clickUpgradesCount += 1;

		// Плавный рост цены на 15%, но всегда минимум +1
		upgradePrice = Math.max(upgradePrice + 1, Math.floor(upgradePrice * 1.15));

		updateUI();
		saveGame();
	}

	// Кнопка "Улучшить клик"
	if (upgradeClickBtn) {
		upgradeClickBtn.addEventListener('click', buyClickUpgrade);
	}

	// Кнопка "Робот"
	if (autoBotBtn) {
		autoBotBtn.addEventListener('click', buyAutoBot);
	}
});