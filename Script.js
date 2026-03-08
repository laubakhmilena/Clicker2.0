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

	const settingsBtn = document.getElementById('settings-btn'); // настройки
	const closeSetting = document.getElementById('close-settings');
	const closeSkinsBtn = document.getElementById('close-skins');
	const resetProgressBtn = document.getElementById('reset-progress-btn');
	const resetProgressLabel = resetProgressBtn ? resetProgressBtn.querySelector('.settings-restart-label') : null;
	const resetProgressOverlay = resetProgressBtn ? resetProgressBtn.querySelector('.settings-restart-progress') : null;

	const THEME_KEY = 'theme'; // тема
	const LANGUAGE_KEY = 'language'; // язык интерфейса
	const themeSelect = document.querySelector('.theme-select');
	const languageSelect = document.getElementById('language-select');

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
		{ id: 1, nameKey: 'skins.names.1', icon: '🤖', price: 0, rarity: 'common' },
		{ id: 2, nameKey: 'skins.names.2', icon: '🔧', price: 800, rarity: 'common' },
		{ id: 3, nameKey: 'skins.names.3', icon: '🛡️', price: 1600, rarity: 'common' },
		{ id: 4, nameKey: 'skins.names.4', icon: '🪐', price: 3500, rarity: 'common' },
		{ id: 5, nameKey: 'skins.names.5', icon: '🌟', price: 6000, rarity: 'uncommon' },
		{ id: 6, nameKey: 'skins.names.6', icon: '🔥', price: 8500, rarity: 'uncommon' },
		{ id: 7, nameKey: 'skins.names.7', icon: '❄️', price: 11000, rarity: 'uncommon' },
		{ id: 8, nameKey: 'skins.names.8', icon: '🪖', price: 14000, rarity: 'uncommon' },
		{ id: 9, nameKey: 'skins.names.9', icon: '🥷', price: 22000, rarity: 'rare' },
		{ id: 10, nameKey: 'skins.names.10', icon: '⚡', price: 29000, rarity: 'rare' },
		{ id: 11, nameKey: 'skins.names.11', icon: '🌌', price: 39000, rarity: 'rare' },
		{ id: 12, nameKey: 'skins.names.12', icon: '💎', price: 49000, rarity: 'rare' },
		{ id: 13, nameKey: 'skins.names.13', icon: '🐉', price: 78000, rarity: 'ultra' },
		{ id: 14, nameKey: 'skins.names.14', icon: '👑', price: 115000, rarity: 'ultra' },
		{ id: 15, nameKey: 'skins.names.15', icon: '👻', price: 155000, rarity: 'ultra' },
		{ id: 16, nameKey: 'skins.names.16', icon: '☄️', price: 780000, rarity: 'ultra' },
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
		{ id: 'temporary', labelKey: 'boosts.categories.temporary' },
		{ id: 'instant', labelKey: 'boosts.categories.instant' },
		{ id: 'permanent', labelKey: 'boosts.categories.permanent' },
		{ id: 'super', labelKey: 'boosts.categories.super' },
	];

	const boosts = [
		{ id: 'neon_overdrive', category: 'temporary', rarity: 'rare', icon: '⚡', nameKey: 'boosts.names.neon_overdrive', descKey: 'boosts.desc.neon_overdrive', price: 900, duration: 45 },
		{ id: 'rocket_pulse', category: 'temporary', rarity: 'rare', icon: '🚀', nameKey: 'boosts.names.rocket_pulse', descKey: 'boosts.desc.rocket_pulse', price: 1400, duration: 60 },
		{ id: 'drone_army', category: 'temporary', rarity: 'epic', icon: '🤖', nameKey: 'boosts.names.drone_army', descKey: 'boosts.desc.drone_army', price: 1800, duration: 90 },
		{ id: 'golden_storm', category: 'temporary', rarity: 'rare', icon: '🌟', nameKey: 'boosts.names.golden_storm', descKey: 'boosts.desc.golden_storm', price: 1200, duration: 40 },
		{ id: 'coin_burst', category: 'instant', rarity: 'common', icon: '💰', nameKey: 'boosts.names.coin_burst', descKey: 'boosts.desc.coin_burst', price: 400, priceGrowth: 1.28 },
		{ id: 'super_click', category: 'instant', rarity: 'rare', icon: '🔨', nameKey: 'boosts.names.super_click', descKey: 'boosts.desc.super_click', price: 750, priceGrowth: 1.3 },
		{ id: 'discount_protocol', category: 'instant', rarity: 'common', icon: '🛒', nameKey: 'boosts.names.discount_protocol', descKey: 'boosts.desc.discount_protocol', price: 600, priceGrowth: 1.25 },
		{ id: 'offline_bonus', category: 'instant', rarity: 'rare', icon: '⏳', nameKey: 'boosts.names.offline_bonus', descKey: 'boosts.desc.offline_bonus', price: 850, priceGrowth: 1.35 },
		{ id: 'processor_plus', category: 'permanent', rarity: 'rare', icon: '📈', nameKey: 'boosts.names.processor_plus', descKey: 'boosts.desc.processor_plus', price: 3000, priceGrowth: 1.35 },
		{ id: 'eternal_generator', category: 'permanent', rarity: 'epic', icon: '🔋', nameKey: 'boosts.names.eternal_generator', descKey: 'boosts.desc.eternal_generator', price: 5000, priceGrowth: 1.35 },
		{ id: 'evolution_module', category: 'permanent', rarity: 'epic', icon: '🧬', nameKey: 'boosts.names.evolution_module', descKey: 'boosts.desc.evolution_module', price: 12000, oneTime: true },
		{ id: 'space_amplifier', category: 'permanent', rarity: 'epic', icon: '🌌', nameKey: 'boosts.names.space_amplifier', descKey: 'boosts.desc.space_amplifier', price: 25000, oneTime: true },
		{ id: 'critical_overload', category: 'super', rarity: 'epic', icon: '💥', nameKey: 'boosts.names.critical_overload', descKey: 'boosts.desc.critical_overload', price: 1700, duration: 75 },
		{ id: 'time_freeze', category: 'super', rarity: 'rare', icon: '❄', nameKey: 'boosts.names.time_freeze', descKey: 'boosts.desc.time_freeze', price: 1500, duration: 30 },
		{ id: 'galactic_breakthrough', category: 'super', rarity: 'epic', icon: '🌠', nameKey: 'boosts.names.galactic_breakthrough', descKey: 'boosts.desc.galactic_breakthrough', price: 8000, duration: 15 },
		{ id: 'omega_mode', category: 'super', rarity: 'epic', icon: '🌀', nameKey: 'boosts.names.omega_mode', descKey: 'boosts.desc.omega_mode', price: 12000, duration: 20 },
	];
		const boostById = new Map(boosts.map((boost) => [boost.id, boost]));

		const ACHIEVEMENTS_STATE_KEY = 'achievementsState';
		const ACHIEVEMENTS_BUTTON_UNLOCKED_KEY = 'achievementsButtonUnlocked';
		const ACHIEVEMENTS_COUNTERS_KEY = 'achievementsCounters';

	// Локализация. Единый источник истинны по языку и всем строкам интерфейса.
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
			welcome: 'Кликай, улучшай и собирай скины!', 'start-btn': 'Начать игру', 'about-btn': 'Об игре', 'settings-btn': 'Настройки',
			gold: 'Золото', 'power-label': 'Сила клика', 'back-menu-btn': 'В меню', restart: 'Сбросить весь прогресс',
			'shop-title':'МАГАЗИН','upgrade-click':'Улучшить клик','robot-title':'Робот',skins:'Скины',boosts:'Бусты',achievements:'Достижения',stats:'Статистика','active-boosts':'Активные бусты',
			'level-template':'LVL {n}','robot-info':'+{income}/сек • {count} куплено','buy-for':'Купить за {price} 💰','done-summary':'Выполнено {done} / {total} • {percent}%',
			'skins.button.equipped':'✓ Надето','skins.button.owned':'Куплено','skins.title.equipped':'Скин уже надет','skins.title.wear':'Нажмите, чтобы надеть скин','skins.title.no-coins':'Недостаточно монет для покупки','skins.title.buy':'Нажмите, чтобы купить скин',
			'rarity.common':'Common','rarity.uncommon':'Uncommon','rarity.rare':'Rare','rarity.ultra':'Ultra',
			'boosts.categories.temporary':'Временные','boosts.categories.instant':'Мгновенные','boosts.categories.permanent':'Постоянные','boosts.categories.super':'Супер',
			'boost.active':'Активен','boost.active.timer':'Активен (таймер)','boost.limit':'Лимит','boost.remaining':'Осталось: {left}/20','boost.not-enough':'Недостаточно монет','boost.purchased':'Куплено','boost.one-time':'Одноразовый буст','boost.price':'Цена: {price} 💰','boost.level':'Уровень: {level}','boost.duration':'Длительность: {seconds}с','boost.permanent':'Постоянный эффект / моментально','boost.none':'Нет активных бустов','boost.left':'Осталось {seconds}с',
			'ach.status.locked':'Недоступно','ach.status.done':'Выполнено','ach.status.progress':'В процессе','ach.claimed':'Получено','ach.claim':'Забрать награду','ach.reward':'+{reward} монет{bonus}',
			'stats.none':'Нет','stats.yes':'Да','stats.section.basic':'Основное','stats.section.upgrades':'Прокачка','stats.section.robots':'Роботы','stats.section.skins':'Скины','stats.section.boosts':'Бусты','stats.section.achievements':'Достижения',
			'theme.dark':'Темная','theme.light':'Светлая','theme.auto':'Авто','reset-hold':'Держите 3 секунды',
			'stats.coins-current':'Монеты сейчас','stats.total-coins':'Всего заработано монет','stats.total-clicks':'Всего кликов','stats.click-base':'Базовая сила клика','stats.click-effective':'Эффективная сила клика','stats.level':'Текущий уровень','stats.level-progress':'Прогресс уровня','stats.level-remaining':'До следующего уровня','stats.click-upgrades':'Куплено улучшений клика','stats.robots-count':'Роботов куплено','stats.robots-base':'Базовый доход роботов в секунду','stats.robots-effective':'Эффективный доход роботов в секунду','stats.skins-bought':'Куплено скинов','stats.skins-owned':'Открыто скинов','stats.skins-selected':'Выбранный скин','stats.boosts-upgraded':'Улучшено бустов','stats.boosts-used':'Всего использовано бустов','stats.boosts-types':'Разных типов использовано','stats.boosts-active':'Активно сейчас','stats.boosts-combo':'Лучшее комбо бустов','stats.boosts-time':'Суммарное время бустов (сек)','stats.ach-unlocked':'Открыто достижений','stats.ach-claimed':'Получено наград','stats.ach-system':'Система достижений'
		},
		en: {
			gamename: 'Robo Clicker','about-title':' — a space adventure!','inginer':'You are the chief engineer of a secret lab of the future!',
			klik:'✨Click: earn gold with your own hands!','Upgrade':'⚙️Upgrade: increase click power and buy automatic robots.','Skin':'🎭Skins: unlock unique heroes for achievements.','Level':'🏆Levels: prove you are the best by raising your engineer level.',
			young:'Created specially for young inventors!','Go':'LET\'S GO!',settings:'Settings',language:'🌍 Language',sound:'🔊 Sound',brightness:'☀️ Brightness',theme:'🌗 Theme',
			welcome:'Click, upgrade and collect skins!','start-btn':'Start game','about-btn':'About','settings-btn':'Settings',gold:'Gold','power-label':'Click power','back-menu-btn':'Back to menu',restart:'Reset all progress',
			'shop-title':'SHOP','upgrade-click':'Upgrade click','robot-title':'Robot',skins:'Skins',boosts:'Boosts',achievements:'Achievements',stats:'Statistics','active-boosts':'Active boosts',
			'level-template':'LVL {n}','robot-info':'+{income}/sec • {count} bought','buy-for':'Buy for {price} 💰','done-summary':'Completed {done} / {total} • {percent}%',
			'skins.button.equipped':'✓ Equipped','skins.button.owned':'Owned','skins.title.equipped':'Skin is already equipped','skins.title.wear':'Click to equip skin','skins.title.no-coins':'Not enough coins to buy','skins.title.buy':'Click to buy skin',
			'rarity.common':'Common','rarity.uncommon':'Uncommon','rarity.rare':'Rare','rarity.ultra':'Ultra',
			'boosts.categories.temporary':'Temporary','boosts.categories.instant':'Instant','boosts.categories.permanent':'Permanent','boosts.categories.super':'Super',
			'boost.active':'Active','boost.active.timer':'Active (timer)','boost.limit':'Limit','boost.remaining':'Left: {left}/20','boost.not-enough':'Not enough coins','boost.purchased':'Bought','boost.one-time':'One-time boost','boost.price':'Price: {price} 💰','boost.level':'Level: {level}','boost.duration':'Duration: {seconds}s','boost.permanent':'Permanent effect / instant','boost.none':'No active boosts','boost.left':'{seconds}s left',
			'ach.status.locked':'Locked','ach.status.done':'Done','ach.status.progress':'In progress','ach.claimed':'Claimed','ach.claim':'Claim reward','ach.reward':'+{reward} coins{bonus}',
			'stats.none':'No','stats.yes':'Yes','stats.section.basic':'Basics','stats.section.upgrades':'Upgrades','stats.section.robots':'Robots','stats.section.skins':'Skins','stats.section.boosts':'Boosts','stats.section.achievements':'Achievements',
			'theme.dark':'Dark','theme.light':'Light','theme.auto':'Auto','reset-hold':'Hold for 3 seconds',
			'stats.coins-current':'Coins now','stats.total-coins':'Total coins earned','stats.total-clicks':'Total clicks','stats.click-base':'Base click power','stats.click-effective':'Effective click power','stats.level':'Current level','stats.level-progress':'Level progress','stats.level-remaining':'To next level','stats.click-upgrades':'Click upgrades bought','stats.robots-count':'Robots bought','stats.robots-base':'Base robot income per second','stats.robots-effective':'Effective robot income per second','stats.skins-bought':'Skins bought','stats.skins-owned':'Skins unlocked','stats.skins-selected':'Selected skin','stats.boosts-upgraded':'Boosts upgraded','stats.boosts-used':'Total boosts used','stats.boosts-types':'Different types used','stats.boosts-active':'Active now','stats.boosts-combo':'Best boost combo','stats.boosts-time':'Total boost time (sec)','stats.ach-unlocked':'Achievements unlocked','stats.ach-claimed':'Rewards claimed','stats.ach-system':'Achievement system'
		}
	};

	// Переводы для карточек и больших массивов данных (скины/бусты/достижения).
	skins.forEach((skin) => {
		TRANSLATIONS.ru[skin.nameKey] = {
			1:'Классический Робот',2:'Рабочий Механик',3:'Стальной Защитник',4:'Лунный Разведчик',5:'Неоновый Курьер',6:'Огненный Прототип',7:'Ледяной Страж',8:'Камуфляжный Тактик',9:'Кибер-Ниндзя',10:'Электро-Воин',11:'Космический Рейдер',12:'Хромовый Фантом',13:'Драконий Мех',14:'Галактический Император',15:'Призрачный Протокол',16:'Абсолютный Омега'}[skin.id];
		TRANSLATIONS.en[skin.nameKey] = {
			1:'Classic Robot',2:'Worker Mechanic',3:'Steel Defender',4:'Moon Scout',5:'Neon Courier',6:'Fire Prototype',7:'Ice Guardian',8:'Camouflage Tactician',9:'Cyber Ninja',10:'Electro Warrior',11:'Space Raider',12:'Chrome Phantom',13:'Dragon Mech',14:'Galactic Emperor',15:'Ghost Protocol',16:'Absolute Omega'}[skin.id];
	});

	const boostRu = {
		neon_overdrive:['Неоновый разгон','x3 к силе клика на 45 секунд'],rocket_pulse:['Ракетный импульс','x2.5 к клику и +20% дохода роботов'],drone_army:['Армия дронов','x3 доход роботов на 90 секунд'],golden_storm:['Золотой шторм','+150% монет за клик на 40 секунд'],coin_burst:['Монетный взрыв','Сразу +500 монет'],super_click:['Супер клик','Следующий клик x25'],discount_protocol:['Скидочный протокол','Следующая покупка апгрейда -50%'],offline_bonus:['Офлайн бонус','Начисляет 50% офлайн дохода'],processor_plus:['Улучшенный процессор','+1 к силе клика'],eternal_generator:['Вечный генератор','+0.5 дохода роботов'],evolution_module:['Модуль эволюции','+5% к силе клика за уровень'],space_amplifier:['Космический усилитель','+10% ко всем доходам'],critical_overload:['Критический перегруз','30% шанс x10 за клик'],time_freeze:['Заморозка времени','Таймеры x0.5 на 30 секунд'],galactic_breakthrough:['Галактический прорыв','Клики x10 и роботы x5'],omega_mode:['Омега режим','Клики x20 на 20 секунд']
	};
	const boostEn = {
		neon_overdrive:['Neon Overdrive','x3 click power for 45 seconds'],rocket_pulse:['Rocket Pulse','x2.5 click and +20% robot income'],drone_army:['Drone Army','x3 robot income for 90 seconds'],golden_storm:['Golden Storm','+150% coins per click for 40 seconds'],coin_burst:['Coin Burst','Instantly +500 coins'],super_click:['Super Click','Next click x25'],discount_protocol:['Discount Protocol','Next upgrade purchase -50%'],offline_bonus:['Offline Bonus','Grants 50% offline income'],processor_plus:['Enhanced Processor','+1 click power'],eternal_generator:['Eternal Generator','+0.5 robot income'],evolution_module:['Evolution Module','+5% click power per level'],space_amplifier:['Space Amplifier','+10% to all income'],critical_overload:['Critical Overload','30% chance for x10 click'],time_freeze:['Time Freeze','Timers x0.5 for 30 seconds'],galactic_breakthrough:['Galactic Breakthrough','Clicks x10 and robots x5'],omega_mode:['Omega Mode','Clicks x20 for 20 seconds']
	};
	boosts.forEach((boost) => {
		const ru = boostRu[boost.id];
		const en = boostEn[boost.id];
		if (ru) { TRANSLATIONS.ru[boost.nameKey] = ru[0]; TRANSLATIONS.ru[boost.descKey] = ru[1]; }
		if (en) { TRANSLATIONS.en[boost.nameKey] = en[0]; TRANSLATIONS.en[boost.descKey] = en[1]; }
	});

	let currentLanguage = 'ru';
	function normalizeLanguage(language) {
		const lang = String(language || '').toLowerCase().trim();
		return lang === 'en' ? 'en' : 'ru';
	}

	function t(key, params = {}) {
		const langPack = TRANSLATIONS[currentLanguage] || TRANSLATIONS.ru;
		const fallbackPack = TRANSLATIONS.ru;
		const raw = (langPack && langPack[key]) ?? fallbackPack[key] ?? key;
		return String(raw).replace(/\{(\w+)\}/g, (_, token) => (params[token] ?? `{${token}}`));
	}

		const TOTAL_CLICKS_KEY = 'totalClicks';
		const TOTAL_COINS_EARNED_KEY = 'totalCoinsEarned';
		const CLICK_UPGRADES_COUNT_KEY = 'clickUpgradesCount';
		const SKINS_BOUGHT_COUNT_KEY = 'skinsBoughtCount';

		const achievements = [
  { id: 1, nameKey: 'achievements.names.1', icon: "👋", descKey: 'achievements.desc.1', type: "clicks", goal: 1, reward: 50, bonus: null, unlocked: false, claimed: false },
  { id: 2, nameKey: 'achievements.names.2', icon: "🤖", descKey: 'achievements.desc.2', type: "robots", goal: 1, reward: 150, bonus: null, unlocked: false, claimed: false },
  { id: 3, nameKey: 'achievements.names.3', icon: "⚙️", descKey: 'achievements.desc.3', type: "clickUpgrades", goal: 1, reward: 100, bonus: null, unlocked: false, claimed: false },
  { id: 4, nameKey: 'achievements.names.4', icon: "🌟", descKey: 'achievements.desc.4', type: "level", goal: 3, reward: 300, bonus: null, unlocked: false, claimed: false },
  { id: 5, nameKey: 'achievements.names.5', icon: "📡", descKey: 'achievements.desc.5', type: "totalCoins", goal: 100, reward: 200, bonus: null, unlocked: false, claimed: false },
  { id: 6, nameKey: 'achievements.names.6', icon: "🔧", descKey: 'achievements.desc.6', type: "robots", goal: 3, reward: 400, bonus: null, unlocked: false, claimed: false },
  { id: 7, nameKey: 'achievements.names.7', icon: "🛠️", descKey: 'achievements.desc.7', type: "clickUpgrades", goal: 5, reward: 250, bonus: null, unlocked: false, claimed: false },
  { id: 8, nameKey: 'achievements.names.8', icon: "📊", descKey: 'achievements.desc.8', type: "clicks", goal: 500, reward: 350, bonus: null, unlocked: false, claimed: false },
  { id: 9, nameKey: 'achievements.names.9', icon: "🪐", descKey: 'achievements.desc.9', type: "level", goal: 5, reward: 500, bonus: null, unlocked: false, claimed: false },
  { id: 10, nameKey: 'achievements.names.10', icon: "🚀", descKey: 'achievements.desc.10', type: "totalCoins", goal: 1000, reward: 600, bonus: null, unlocked: false, claimed: false },

  { id: 11, nameKey: 'achievements.names.11', icon: "👆", descKey: 'achievements.desc.11', type: "clicks", goal: 500, reward: 400, bonus: null, unlocked: false, claimed: false },
  { id: 12, nameKey: 'achievements.names.12', icon: "💥", descKey: 'achievements.desc.12', type: "clicks", goal: 2500, reward: 900, bonus: null, unlocked: false, claimed: false },
  { id: 13, nameKey: 'achievements.names.13', icon: "🔥", descKey: 'achievements.desc.13', type: "clicks", goal: 10000, reward: 2000, bonus: null, unlocked: false, claimed: false },
  { id: 14, nameKey: 'achievements.names.14', icon: "⚡", descKey: 'achievements.desc.14', type: "clicks", goal: 25000, reward: 4500, bonus: null, unlocked: false, claimed: false },
  { id: 15, nameKey: 'achievements.names.15', icon: "🏆", descKey: 'achievements.desc.15', type: "clicks", goal: 50000, reward: 8000, bonus: null, unlocked: false, claimed: false },
  { id: 16, nameKey: 'achievements.names.16', icon: "🌌", descKey: 'achievements.desc.16', type: "clicks", goal: 100000, reward: 15000, bonus: null, unlocked: false, claimed: false },
  { id: 17, nameKey: 'achievements.names.17', icon: "☄️", descKey: 'achievements.desc.17', type: "clicks", goal: 250000, reward: 25000, bonus: "скин", unlocked: false, claimed: false },
  { id: 18, nameKey: 'achievements.names.18', icon: "💣", descKey: 'achievements.desc.18', type: "clicks", goal: 500000, reward: 40000, bonus: null, unlocked: false, claimed: false },
  { id: 19, nameKey: 'achievements.names.19', icon: "🧨", descKey: 'achievements.desc.19', type: "clicks", goal: 1000000, reward: 70000, bonus: null, unlocked: false, claimed: false },
  { id: 20, nameKey: 'achievements.names.20', icon: "👑", descKey: 'achievements.desc.20', type: "clicks", goal: 2500000, reward: 120000, bonus: "+2% навсегда", unlocked: false, claimed: false },

  { id: 21, nameKey: 'achievements.names.21', icon: "💰", descKey: 'achievements.desc.21', type: "totalCoins", goal: 10000, reward: 800, bonus: null, unlocked: false, claimed: false },
  { id: 22, nameKey: 'achievements.names.22', icon: "🪙", descKey: 'achievements.desc.22', type: "totalCoins", goal: 50000, reward: 2000, bonus: null, unlocked: false, claimed: false },
  { id: 23, nameKey: 'achievements.names.23', icon: "🏦", descKey: 'achievements.desc.23', type: "totalCoins", goal: 250000, reward: 5000, bonus: null, unlocked: false, claimed: false },
  { id: 24, nameKey: 'achievements.names.24', icon: "🌠", descKey: 'achievements.desc.24', type: "totalCoins", goal: 1000000, reward: 12000, bonus: null, unlocked: false, claimed: false },
  { id: 25, nameKey: 'achievements.names.25', icon: "💎", descKey: 'achievements.desc.25', type: "totalCoins", goal: 5000000, reward: 25000, bonus: null, unlocked: false, claimed: false },
  { id: 26, nameKey: 'achievements.names.26', icon: "🪐", descKey: 'achievements.desc.26', type: "totalCoins", goal: 10000000, reward: 40000, bonus: null, unlocked: false, claimed: false },
  { id: 27, nameKey: 'achievements.names.27', icon: "🌌", descKey: 'achievements.desc.27', type: "totalCoins", goal: 25000000, reward: 70000, bonus: "+3% навсегда", unlocked: false, claimed: false },
  { id: 28, nameKey: 'achievements.names.28', icon: "☄️", descKey: 'achievements.desc.28', type: "totalCoins", goal: 50000000, reward: 100000, bonus: null, unlocked: false, claimed: false },
  { id: 29, nameKey: 'achievements.names.29', icon: "👑", descKey: 'achievements.desc.29', type: "totalCoins", goal: 100000000, reward: 150000, bonus: null, unlocked: false, claimed: false },
  { id: 30, nameKey: 'achievements.names.30', icon: "🏆", descKey: 'achievements.desc.30', type: "totalCoins", goal: 250000000, reward: 250000, bonus: "секретный скин", unlocked: false, claimed: false },

  { id: 31, nameKey: 'achievements.names.31', icon: "🛠️", descKey: 'achievements.desc.31', type: "robots", goal: 10, reward: 600, bonus: null, unlocked: false, claimed: false },
  { id: 32, nameKey: 'achievements.names.32', icon: "🤖", descKey: 'achievements.desc.32', type: "robots", goal: 25, reward: 1500, bonus: null, unlocked: false, claimed: false },
  { id: 33, nameKey: 'achievements.names.33', icon: "🏭", descKey: 'achievements.desc.33', type: "robots", goal: 50, reward: 3500, bonus: null, unlocked: false, claimed: false },
  { id: 34, nameKey: 'achievements.names.34', icon: "🚀", descKey: 'achievements.desc.34', type: "robots", goal: 100, reward: 7000, bonus: null, unlocked: false, claimed: false },
  { id: 35, nameKey: 'achievements.names.35', icon: "🌌", descKey: 'achievements.desc.35', type: "robots", goal: 200, reward: 15000, bonus: null, unlocked: false, claimed: false },
  { id: 36, nameKey: 'achievements.names.36', icon: "🪐", descKey: 'achievements.desc.36', type: "robots", goal: 300, reward: 25000, bonus: null, unlocked: false, claimed: false },
  { id: 37, nameKey: 'achievements.names.37', icon: "👾", descKey: 'achievements.desc.37', type: "robots", goal: 500, reward: 40000, bonus: null, unlocked: false, claimed: false },
  { id: 38, nameKey: 'achievements.names.38', icon: "⚙️", descKey: 'achievements.desc.38', type: "robots", goal: 750, reward: 60000, bonus: null, unlocked: false, claimed: false },
  { id: 39, nameKey: 'achievements.names.39', icon: "🏆", descKey: 'achievements.desc.39', type: "robots", goal: 1000, reward: 90000, bonus: null, unlocked: false, claimed: false },
  { id: 40, nameKey: 'achievements.names.40', icon: "👑", descKey: 'achievements.desc.40', type: "robots", goal: 2000, reward: 150000, bonus: "+5% роботы", unlocked: false, claimed: false },

  { id: 41, nameKey: 'achievements.names.41', icon: "📈", descKey: 'achievements.desc.41', type: "clickUpgrades", goal: 20, reward: 800, bonus: null, unlocked: false, claimed: false },
  { id: 42, nameKey: 'achievements.names.42', icon: "🔧", descKey: 'achievements.desc.42', type: "clickPower", goal: 20, reward: 1200, bonus: null, unlocked: false, claimed: false },
  { id: 43, nameKey: 'achievements.names.43', icon: "⚡", descKey: 'achievements.desc.43', type: "clickPower", goal: 50, reward: 3000, bonus: null, unlocked: false, claimed: false },
  { id: 44, nameKey: 'achievements.names.44', icon: "🔥", descKey: 'achievements.desc.44', type: "clickPower", goal: 100, reward: 6000, bonus: null, unlocked: false, claimed: false },
  { id: 45, nameKey: 'achievements.names.45', icon: "🌟", descKey: 'achievements.desc.45', type: "clickUpgrades", goal: 100, reward: 12000, bonus: null, unlocked: false, claimed: false },
  { id: 46, nameKey: 'achievements.names.46', icon: "🧬", descKey: 'achievements.desc.46', type: "clickPower", goal: 200, reward: 20000, bonus: null, unlocked: false, claimed: false },
  { id: 47, nameKey: 'achievements.names.47', icon: "💎", descKey: 'achievements.desc.47', type: "clickPower", goal: 300, reward: 35000, bonus: null, unlocked: false, claimed: false },
  { id: 48, nameKey: 'achievements.names.48', icon: "☄️", descKey: 'achievements.desc.48', type: "clickPower", goal: 500, reward: 55000, bonus: null, unlocked: false, claimed: false },
  { id: 49, nameKey: 'achievements.names.49', icon: "👑", descKey: 'achievements.desc.49', type: "clickUpgrades", goal: 250, reward: 80000, bonus: null, unlocked: false, claimed: false },
  { id: 50, nameKey: 'achievements.names.50', icon: "🏆", descKey: 'achievements.desc.50', type: "clickPower", goal: 1000, reward: 120000, bonus: "+4% навсегда", unlocked: false, claimed: false },

  { id: 51, nameKey: 'achievements.names.51', icon: "👕", descKey: 'achievements.desc.51', type: "skins", goal: 1, reward: 300, bonus: null, unlocked: false, claimed: false },
  { id: 52, nameKey: 'achievements.names.52', icon: "🎨", descKey: 'achievements.desc.52', type: "skins", goal: 4, reward: 1000, bonus: null, unlocked: false, claimed: false },
  { id: 53, nameKey: 'achievements.names.53', icon: "🌟", descKey: 'achievements.desc.53', type: "skins", goal: 8, reward: 3000, bonus: null, unlocked: false, claimed: false },
  { id: 54, nameKey: 'achievements.names.54', icon: "🥷", descKey: 'achievements.desc.54', type: "skins", goal: 12, reward: 7000, bonus: null, unlocked: false, claimed: false },
  { id: 55, nameKey: 'achievements.names.55', icon: "💎", descKey: 'achievements.desc.55', type: "skins", goal: 16, reward: 25000, bonus: "секретный скин", unlocked: false, claimed: false },
  { id: 56, nameKey: 'achievements.names.56', icon: "🌌", descKey: 'achievements.desc.56', type: "skinsEquipped", goal: 10, reward: 12000, bonus: null, unlocked: false, claimed: false },
  { id: 57, nameKey: 'achievements.names.57', icon: "👑", descKey: 'achievements.desc.57', type: "skins", goal: 4, reward: 40000, bonus: null, unlocked: false, claimed: false },
  { id: 58, nameKey: 'achievements.names.58', icon: "🏆", descKey: 'achievements.desc.58', type: "skinsBought", goal: 50, reward: 18000, bonus: null, unlocked: false, claimed: false },
  { id: 59, nameKey: 'achievements.names.59', icon: "🔥", descKey: 'achievements.desc.59', type: "skinsEquipped", goal: 5, reward: 8000, bonus: null, unlocked: false, claimed: false },
  { id: 60, nameKey: 'achievements.names.60', icon: "☄️", descKey: 'achievements.desc.60', type: "skins", goal: 16, reward: 100000, bonus: "вечный бонус", unlocked: false, claimed: false },

  { id: 61, nameKey: 'achievements.names.61', icon: "⚡", descKey: 'achievements.desc.61', type: "boosts", goal: 5, reward: 500, bonus: null, unlocked: false, claimed: false },
  { id: 62, nameKey: 'achievements.names.62', icon: "🚀", descKey: 'achievements.desc.62', type: "boosts", goal: 25, reward: 1500, bonus: null, unlocked: false, claimed: false },
  { id: 63, nameKey: 'achievements.names.63', icon: "💥", descKey: 'achievements.desc.63', type: "boosts", goal: 100, reward: 4000, bonus: null, unlocked: false, claimed: false },
  { id: 64, nameKey: 'achievements.names.64', icon: "🌟", descKey: 'achievements.desc.64', type: "boostCombo", goal: 3, reward: 2500, bonus: null, unlocked: false, claimed: false },
  { id: 65, nameKey: 'achievements.names.65', icon: "⏳", descKey: 'achievements.desc.65', type: "boostTime", goal: 300, reward: 6000, bonus: null, unlocked: false, claimed: false },
  { id: 66, nameKey: 'achievements.names.66', icon: "🔥", descKey: 'achievements.desc.66', type: "boosts", goal: 10, reward: 8000, bonus: null, unlocked: false, claimed: false },
  { id: 67, nameKey: 'achievements.names.67', icon: "🧨", descKey: 'achievements.desc.67', type: "boosts", goal: 500, reward: 15000, bonus: null, unlocked: false, claimed: false },
  { id: 68, nameKey: 'achievements.names.68', icon: "👑", descKey: 'achievements.desc.68', type: "boostTypes", goal: 3, reward: 10000, bonus: null, unlocked: false, claimed: false },
  { id: 69, nameKey: 'achievements.names.69', icon: "🏆", descKey: 'achievements.desc.69', type: "boosts", goal: 1000, reward: 25000, bonus: null, unlocked: false, claimed: false },
  { id: 70, nameKey: 'achievements.names.70', icon: "☄️", descKey: 'achievements.desc.70', type: "boosts", goal: 2500, reward: 50000, bonus: "+5% навсегда", unlocked: false, claimed: false },

  { id: 71, nameKey: 'achievements.names.71', icon: "🏅", descKey: 'achievements.desc.71', type: "level", goal: 20, reward: 8000, bonus: null, unlocked: false, claimed: false },
  { id: 72, nameKey: 'achievements.names.72', icon: "🌌", descKey: 'achievements.desc.72', type: "level", goal: 30, reward: 15000, bonus: null, unlocked: false, claimed: false },
  { id: 73, nameKey: 'achievements.names.73', icon: "👑", descKey: 'achievements.desc.73', type: "level", goal: 40, reward: 30000, bonus: null, unlocked: false, claimed: false },
  { id: 74, nameKey: 'achievements.names.74', icon: "☄️", descKey: 'achievements.desc.74', type: "level", goal: 50, reward: 50000, bonus: "+5% навсегда", unlocked: false, claimed: false },
  { id: 75, nameKey: 'achievements.names.75', icon: "🏆", descKey: 'achievements.desc.75', type: "achievements", goal: 79, reward: 100000, bonus: null, unlocked: false, claimed: false },
  { id: 76, nameKey: 'achievements.names.76', icon: "🔥", descKey: 'achievements.desc.76', type: "totalCoins", goal: 10000000, reward: 40000, bonus: null, unlocked: false, claimed: false },
  { id: 77, nameKey: 'achievements.names.77', icon: "🧬", descKey: 'achievements.desc.77', type: "clickPower", goal: 500, reward: 60000, bonus: null, unlocked: false, claimed: false },
  { id: 78, nameKey: 'achievements.names.78', icon: "🌠", descKey: 'achievements.desc.78', type: "skins", goal: 16, reward: 35000, bonus: null, unlocked: false, claimed: false },
  { id: 79, nameKey: 'achievements.names.79', icon: "💥", descKey: 'achievements.desc.79', type: "clicks", goal: 5000000, reward: 80000, bonus: null, unlocked: false, claimed: false },
  { id: 80, nameKey: 'achievements.names.80', icon: "🏆", descKey: 'achievements.desc.80', type: "totalCoins", goal: 500000000, reward: 200000, bonus: "секретный ультра-скин", unlocked: false, claimed: false }
];

		let totalClicks = 0;
		let totalCoinsEarned = 0;
		let clickUpgradesCount = 0;
		let skinsBoughtCount = 0;
		// Базовые стартовые значения, которые НЕ должны давать прогресс достижений.
		const ACHIEVEMENT_BASE_LEVEL = 0;
		const ACHIEVEMENT_BASE_ROBOTS = 0;
		const ACHIEVEMENT_BASE_CLICK_UPGRADES = 0;
		const ACHIEVEMENT_BASE_SKINS = 1; // стартовый скин по умолчанию
		let achievementsButtonUnlocked = false;
		let permanentCoinBonusMultiplier = 1;
		let permanentRobotBonusMultiplier = 1;
		const boostTypesUsed = new Set();
		const achievementCounters = { boostComboBest: 0, boostTime: 0 };
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

		function updatePermanentBonusesFromAchievements() {
			permanentCoinBonusMultiplier = 1;
			permanentRobotBonusMultiplier = 1;
			achievements.forEach((achievement) => {
				if (!achievement.claimed || !achievement.bonus) return;
				if (achievement.bonus.includes('% навсегда')) {
					const pct = toFiniteNumber(achievement.bonus.replace(/[^0-9.]/g, ''), 0);
					if (pct > 0) permanentCoinBonusMultiplier *= (1 + (pct / 100));
				}
				if (bonusText.includes('% роботы') || bonusText.includes('% robots')) {
					const pct = toFiniteNumber(achievement.bonus.replace(/[^0-9.]/g, ''), 0);
					if (pct > 0) permanentRobotBonusMultiplier *= (1 + (pct / 100));
				}
			});
		}

		function getAchievementProgressValue(achievement) {
			// Единый принцип: стартовые значения по умолчанию не считаются достижением.
			// Для этого вычитаем базовые значения и не уходим в минус.
			const purchasedRobots = Math.max(0, robotCount - ACHIEVEMENT_BASE_ROBOTS);
			const purchasedClickUpgrades = Math.max(0, clickUpgradesCount - ACHIEVEMENT_BASE_CLICK_UPGRADES);
			const ownedSkinsWithoutDefault = Math.max(0, ownedSkinIds.size - ACHIEVEMENT_BASE_SKINS);

			switch (achievement.type) {
				case 'clicks': return totalClicks;
				case 'totalCoins': return totalCoinsEarned;
				case 'robots': return purchasedRobots;
				case 'clickUpgrades': return purchasedClickUpgrades;
				case 'clickPower': return Math.floor(getEffectiveClickPower());
				case 'level': return Math.max(0, level - ACHIEVEMENT_BASE_LEVEL);
				case 'skins': return ownedSkinsWithoutDefault;
				case 'skinsEquipped': return ownedSkinsWithoutDefault;
				case 'skinsBought': return skinsBoughtCount;
				case 'boosts': return Object.values(boostUsageCount).reduce((sum, n) => sum + Math.max(0, Math.floor(toFiniteNumber(n, 0))), 0);
				case 'boostCombo': return achievementCounters.boostComboBest;
				case 'boostTime': return Math.floor(achievementCounters.boostTime);
				case 'boostTypes': return boostTypesUsed.size;
				case 'achievements': return achievements.filter((item) => item.id !== 75 && item.claimed).length;
				default: return 0;
			}
		}

		function checkSpecialAchievementCompletion(achievement) {
			if (achievement.id === 75) return achievements.filter((item) => item.id !== 75 && item.unlocked).length >= 79;
			if (achievement.id === 76) return totalCoinsEarned >= 10000000 && Math.max(0, robotCount - ACHIEVEMENT_BASE_ROBOTS) >= 500;
			if (achievement.id === 77) return getEffectiveClickPower() >= 500 && level >= 45;
			if (achievement.id === 78) return Math.max(0, ownedSkinIds.size - ACHIEVEMENT_BASE_SKINS) >= 16 && level >= 35;
			if (achievement.id === 79) return totalClicks >= 5000000 && Math.max(0, robotCount - ACHIEVEMENT_BASE_ROBOTS) >= 1000;
			if (achievement.id === 80) return totalCoinsEarned >= 500000000 && achievements.filter((item) => item.id < 80 && item.unlocked).length === 79;
			return null;
		}

		function applyAchievementReward(achievement) {
			if (achievement.claimed) return;
			achievement.claimed = true;
			coins += Math.max(0, toFiniteNumber(achievement.reward, 0));
			// Реально применяем только бонусы с процентами (клики/роботы). Остальные бонусы отображаются в карточке.
			updatePermanentBonusesFromAchievements();
		}

		function updateAchievementsState() {
			achievements.forEach((achievement) => {
				const special = checkSpecialAchievementCompletion(achievement);
				const isDone = special === null ? getAchievementProgressValue(achievement) >= achievement.goal : special;
				achievement.unlocked = Boolean(isDone);
			});
		}

		function claimAchievementRewardById(achievementId) {
			const parsedId = Number(achievementId);
			const achievement = achievements.find((item) => item.id === parsedId);
			if (!achievement) return;
			updateAchievementsState();
			if (!achievement.unlocked || achievement.claimed) return;
			applyAchievementReward(achievement);
			updateUI();
			saveGame();
			renderAchievements();
		}

		function renderAchievements() {
			if (!achievementsList) return;
			updateAchievementsState();
			const doneCount = achievements.filter((item) => item.unlocked).length;
			const percent = safePercent(doneCount, achievements.length);
			if (achievementsSummary) {
				achievementsSummary.textContent = t('done-summary', { done: doneCount, total: achievements.length, percent: percent.toFixed(1) });
			}
			if (achievementsOverallFill) {
				achievementsOverallFill.style.width = `${percent.toFixed(1)}%`;
			}

			const prepared = achievements.map((item) => {
				const current = getAchievementProgressValue(item);
				const itemPercent = safePercent(current, item.goal);
				return { item, current, itemPercent };
			}).sort((a, b) => {
				if (a.item.unlocked !== b.item.unlocked) return a.item.unlocked ? -1 : 1;
				if (!a.item.unlocked && !b.item.unlocked && b.itemPercent !== a.itemPercent) return b.itemPercent - a.itemPercent;
				return a.item.id - b.item.id;
			});

			achievementsList.textContent = '';

			prepared.forEach(({ item, current, itemPercent }) => {
				let statusText = t('ach.status.locked');
				let statusClass = 'achievement-card__status--locked';
				if (item.unlocked) {
					statusText = t('ach.status.done');
					statusClass = 'achievement-card__status--done';
				} else if (current > 0) {
					statusText = t('ach.status.progress');
					statusClass = 'achievement-card__status--progress';
				}

				const claimButtonText = item.claimed ? t('ach.claimed') : t('ach.claim');
				const claimDisabled = item.claimed || !item.unlocked;
				const claimClass = item.claimed
					? 'achievement-card__claim-btn is-claimed'
					: item.unlocked
						? 'achievement-card__claim-btn is-ready'
						: 'achievement-card__claim-btn is-locked';
				const bonusText = item.bonusKey ? t(item.bonusKey) : item.bonus;
				const rewardText = t('ach.reward', { reward: item.reward, bonus: bonusText ? ` + ${bonusText}` : '' });

				const card = document.createElement('article');
				card.className = `achievement-card ${item.unlocked ? 'achievement-card--done' : current > 0 ? '' : 'achievement-card--locked'}`;

				const iconEl = document.createElement('div');
				iconEl.className = 'achievement-card__icon';
				iconEl.textContent = item.icon;

				const mainEl = document.createElement('div');
				mainEl.className = 'achievement-card__main';

				const topLineEl = document.createElement('div');
				topLineEl.className = 'achievement-card__topline';

				const nameEl = document.createElement('h3');
				nameEl.className = 'achievement-card__name';
				nameEl.textContent = `${t(item.nameKey)} — `;

				const statusEl = document.createElement('span');
				statusEl.className = `achievement-card__status ${statusClass}`;
				statusEl.textContent = statusText;
				nameEl.appendChild(statusEl);

				const controlsEl = document.createElement('div');
				controlsEl.className = 'achievement-card__controls';

				const claimBtnEl = document.createElement('button');
				claimBtnEl.type = 'button';
				claimBtnEl.className = claimClass;
				claimBtnEl.dataset.achievementId = String(item.id);
				claimBtnEl.textContent = claimButtonText;
				claimBtnEl.disabled = claimDisabled;

				const rewardEl = document.createElement('div');
				rewardEl.className = 'achievement-card__reward';
				rewardEl.textContent = rewardText;

				controlsEl.appendChild(claimBtnEl);
				controlsEl.appendChild(rewardEl);

				topLineEl.appendChild(nameEl);
				topLineEl.appendChild(controlsEl);

				const descEl = document.createElement('p');
				descEl.className = 'achievement-card__desc';
				descEl.textContent = t(item.descKey);

				const progressEl = document.createElement('div');
				progressEl.className = 'achievement-card__progress';
				const progressFillEl = document.createElement('div');
				progressFillEl.className = 'achievement-card__progress-fill';
				progressFillEl.style.width = `${itemPercent.toFixed(1)}%`;
				progressEl.appendChild(progressFillEl);

				mainEl.appendChild(topLineEl);
				mainEl.appendChild(descEl);

				card.appendChild(iconEl);
				card.appendChild(mainEl);
				card.appendChild(progressEl);

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


	// Централизованное обновление всех текстов по текущему языку.
	function updateLocalizedUI() {
		document.querySelectorAll('[data-lang]').forEach((el) => {
			const key = el.dataset.lang;
			if (!key) return;
			el.textContent = t(key);
		});
		if (levelTextEl) {
			levelTextEl.dataset.langTemplate = t('level-template');
		}
		if (themeSelect) {
			Array.from(themeSelect.options).forEach((opt) => {
				const k = `theme.${normalizeTheme(opt.dataset.theme)}`;
				opt.textContent = t(k);
			});
		}
		const statTitles = {
			'stats-basic-title':'stats.section.basic','stats-upgrade-title':'stats.section.upgrades','stats-robots-title':'stats.section.robots','stats-skins-title':'stats.section.skins','stats-boosts-title':'stats.section.boosts','stats-achievements-title':'stats.section.achievements'
		};
		Object.entries(statTitles).forEach(([id,key])=>{ const el=document.getElementById(id); if(el) el.textContent=t(key); });
		const statsLabelKeys = ['stats.coins-current','stats.total-coins','stats.total-clicks','stats.click-base','stats.click-effective','stats.level','stats.level-progress','stats.level-remaining','stats.click-upgrades','stats.robots-count','stats.robots-base','stats.robots-effective','stats.skins-bought','stats.skins-owned','stats.skins-selected','stats.boosts-upgraded','stats.boosts-used','stats.boosts-types','stats.boosts-active','stats.boosts-combo','stats.boosts-time','stats.ach-unlocked','stats.ach-claimed','stats.ach-system'];
		document.querySelectorAll('#stats-modal .stats-item__label').forEach((el, idx) => {
			const key = statsLabelKeys[idx];
			if (key) el.textContent = t(key);
		});
		renderSkinsGrid();
		renderBoostsUI();
		renderAchievements();
		renderStatistics();
		updateLevelUI();
		updateClickUpgradeUI();
		updateRobotUpgradeUI();
		setResetLabel(resetArmed ? RESET_BUTTON_ARMED_TEXT : RESET_BUTTON_IDLE_TEXT);
	}

	function applyLanguage(language, options = {}) {
		const { save = true } = options;
		currentLanguage = normalizeLanguage(language);
		if (languageSelect) languageSelect.value = currentLanguage;
		if (save) setStorageItem(LANGUAGE_KEY, currentLanguage);
		updateLocalizedUI();
	}

	if (languageSelect) {
		languageSelect.addEventListener('change', () => {
			applyLanguage(languageSelect.value, { save: true });
		});
	}

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
		return t(`rarity.${rarity}`);
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
				text: t('skins.button.equipped'),
				className: 'is-equipped',
				disabled: true,
				title: t('skins.title.equipped'),
			};
		}

		if (isOwned) {
			return {
				text: t('skins.button.owned'),
				className: 'is-owned',
				disabled: false,
				title: t('skins.title.wear'),
			};
		}

		const isLocked = coins < skin.price;

		return {
			text: t('buy-for', { price: skin.price }),
			className: isLocked ? 'is-locked' : '',
			disabled: isLocked,
			title: isLocked ? t('skins.title.no-coins') : t('skins.title.buy'),
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
						<h3 class="skin-card__name">${t(skin.nameKey)}</h3>
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
				if (!achievementId) return;
				claimAchievementRewardById(achievementId);
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
		return selectedSkin ? t(selectedSkin.nameKey) : '—';
	}

	function renderStatistics() {
		if (!statsModal) return;

		const levelRequiredClicks = requiredClicksForLevel(level);
		const safeLevelClicks = Math.max(0, Math.floor(toFiniteNumber(levelClicks, 0)));
		const levelRemainingClicks = Math.max(0, levelRequiredClicks - safeLevelClicks);
		const unlockedAchievementsCount = achievements.filter((item) => item.unlocked === true).length;
		const claimedAchievementsCount = achievements.filter((item) => item.claimed === true).length;

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
		if (statsEls.achievementsSystem) statsEls.achievementsSystem.textContent = achievementsButtonUnlocked ? 'Да' : 'Нет';
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
			if (isBoostActive(boost.id)) return { disabled: true, text: t('boost.active'), meta: t('boost.active.timer') };
			if (used >= 20) return { disabled: true, text: t('boost.limit'), meta: t('boost.remaining', { left: 0 }) };
			if (coins < price) return { disabled: true, text: t('boost.not-enough'), meta: t('boost.remaining', { left: 20 - used }) };
			return { disabled: false, text: t('buy-for', { price }), meta: t('boost.remaining', { left: 20 - used }) };
		}
		if (boost.oneTime && getBoostLevel(boost.id) > 0) return { disabled: true, text: t('skins.button.owned'), meta: 'Одноразовый буст' };
		if (boost.category === 'super' && isBoostActive(boost.id)) return { disabled: true, text: t('boost.active'), meta: t('boost.active.timer') };
		if (coins < price) return { disabled: true, text: t('boost.not-enough'), meta: t('boost.price', { price }) };
		return { disabled: false, text: t('buy-for', { price }), meta: boost.category === 'permanent' ? t('boost.level', { level: getBoostLevel(boost.id) }) : t('boost.price', { price }) };
	}

	function renderBoostTabs() {
		if (!boostsTabs) return;
		boostsTabs.innerHTML = boostCategories.map((cat) => `
			<button type="button" class="boosts-tab ${cat.id === currentBoostCategory ? 'is-active' : ''}" data-boost-category="${cat.id}">${t(cat.labelKey)}</button>
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
							<div class="boost-active-item__name">${t(boost.nameKey)} — ${seconds}${currentLanguage === 'en' ? 's' : 'с'}</div>
							<div class="boost-active-item__time">${t('boost.left', { seconds })}</div>
						</div>
						<div class="boost-progress"><div class="boost-progress__fill" style="width:${Math.max(0, Math.min(100, progress)).toFixed(1)}%"></div></div>
					</div>
				`;
			})
			.filter(Boolean);
		boostsActiveList.innerHTML = items.length ? items.join('') : `<div class="boost-active-item"><div class="boost-active-item__name">${t('boost.none')}</div></div>`;
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
					<h3 class="boost-card__name">${t(boost.nameKey)}</h3>
					<p class="boost-card__desc">${t(boost.descKey)}</p>
					<div class="boost-card__price">${action.meta}</div>
					<div class="boost-card__meta">${boost.category === 'temporary' || boost.category === 'super' ? t('boost.duration', { seconds: boost.duration }) : t('boost.permanent')}</div>
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
			showBoostActivation(boost.id === 'neon_overdrive' ? (currentLanguage === 'en' ? '×3 CLICK' : '×3 КЛИК') : boost.id === 'drone_army' ? (currentLanguage === 'en' ? 'DRONES ACTIVE' : 'ДРОНЫ АКТИВНЫ') : (currentLanguage === 'en' ? 'BOOST ACTIVE' : 'БУСТ АКТИВЕН'));
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


	const RESET_BUTTON_IDLE_TEXT = 'reset';
	const RESET_BUTTON_ARMED_TEXT = 'reset-hold';
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
		setResetLabel(t(RESET_BUTTON_IDLE_TEXT));
		setResetProgress(0);
	}

	function armResetButton() {
		if (!resetProgressBtn) return;
		clearResetArmTimeout();
		resetArmed = true;
		resetProgressBtn.classList.add('is-armed');
		setResetLabel(t(RESET_BUTTON_ARMED_TEXT));

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
			language: 'ru',
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
		achievements.forEach((item) => {
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
			languageValue = 'ru',
			save = false,
		} = options;

		applyBrightness(brightnessValue, { syncSlider: true, syncState: true });
		applyGlobalVolume(volumeValue);
		applyTheme(themeValue);
		setSelectToTheme(themeValue);
		applyLanguage(languageValue, { save });

		if (save) {
			setStorageItem(BRIGHTNESS_KEY, brightness);
			setStorageItem(VOLUME_KEY, globalVolume);
			setStorageItem(THEME_KEY, normalizeTheme(themeValue));
			setStorageItem(LANGUAGE_KEY, normalizeLanguage(languageValue));
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

		if (Array.isArray(state.achievementsState)) {
			const byId = new Map(state.achievementsState.map((it) => [Number(it.id), it]));
			achievements.forEach((achievement) => {
				const saved = byId.get(achievement.id);
				if (!saved) return;
				achievement.unlocked = Boolean(saved.unlocked);
				achievement.claimed = Boolean(saved.claimed);
			});
		}
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
			languageValue: currentLanguage,
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
			setStorageItem(ACHIEVEMENTS_STATE_KEY, JSON.stringify(achievements.map((item) => ({ id: item.id, unlocked: item.unlocked, claimed: item.claimed }))));
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
		const savedLanguage = getStorageItem(LANGUAGE_KEY);
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
				if (Array.isArray(parsedState)) loadedState.achievementsState = parsedState;
			} catch {
				// игнор
			}
		}

		loadedState.brightness = savedBrightness !== null
			? clamp(savedBrightness, BR_MIN, BR_MAX)
			: initialState.brightness;
		loadedState.volume = savedVolume !== null ? clamp01(savedVolume) : initialState.volume;
		loadedState.theme = savedTheme !== null ? normalizeTheme(savedTheme) : initialState.theme;
		loadedState.language = savedLanguage !== null ? normalizeLanguage(savedLanguage) : initialState.language;

		stopAllTransientProcesses();
		applyGameState(loadedState);
		applyInterfaceSettings({
			brightnessValue: loadedState.brightness,
			volumeValue: loadedState.volume,
			themeValue: loadedState.theme,
			languageValue: loadedState.language,
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
		languageValue: getStorageItem(LANGUAGE_KEY) || 'ru',
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
		const template = levelTextEl.dataset.langTemplate || t('level-template');
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
			robotInfoEl.textContent = t('robot-info', { income: robotIncomePerSecond, count: robotCount });
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
