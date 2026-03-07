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
	const themeSelect = document.querySelector('.theme-select');

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
		{ id: 'temporary', label: 'Временные' },
		{ id: 'instant', label: 'Мгновенные' },
		{ id: 'permanent', label: 'Постоянные' },
		{ id: 'super', label: 'Супер' },
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
			applyGlobalVolume(1);
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
		if (rarity === 'uncommon') return 'Uncommon';
		if (rarity === 'rare') return 'Rare';
		if (rarity === 'ultra') return 'Ultra';
		return 'Common';
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
				text: '✓ Надето',
				className: 'is-equipped',
				disabled: true,
				title: 'Скин уже надет',
			};
		}

		if (isOwned) {
			return {
				text: 'Куплено',
				className: 'is-owned',
				disabled: false,
				title: 'Нажмите, чтобы надеть скин',
			};
		}

		const isLocked = coins < skin.price;

		return {
			text: `Купить за ${skin.price} 💰`,
			className: isLocked ? 'is-locked' : '',
			disabled: isLocked,
			title: isLocked ? 'Недостаточно монет для покупки' : 'Нажмите, чтобы купить скин',
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
						<h3 class="skin-card__name">${skin.name}</h3>
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
		achievementsBtn.addEventListener('click', () => {
			console.log('Нажата кнопка: Достижения');
		});
	}

	if (statsBtn) {
		statsBtn.addEventListener('click', () => {
			console.log('Нажата кнопка: Статистика');
		});
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
		return coinsPerClick;
	}

	function getEffectiveRobotIncome() {
		let income = robotIncomePerSecond;
		income += getBoostLevel('eternal_generator') * 0.5;
		if (isBoostActive('rocket_pulse')) income *= 1.2;
		if (isBoostActive('drone_army')) income *= 3;
		if (isBoostActive('galactic_breakthrough')) income *= 5;
		if (getBoostLevel('space_amplifier') > 0) income *= 1.1;
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
			if (isBoostActive(boost.id)) return { disabled: true, text: 'Активен', meta: 'Активен (таймер)' };
			if (used >= 20) return { disabled: true, text: 'Лимит', meta: 'Осталось: 0/20' };
			if (coins < price) return { disabled: true, text: 'Недостаточно монет', meta: `Осталось: ${20 - used}/20` };
			return { disabled: false, text: `Купить за ${price} 💰`, meta: `Осталось: ${20 - used}/20` };
		}
		if (boost.oneTime && getBoostLevel(boost.id) > 0) return { disabled: true, text: 'Куплено', meta: 'Одноразовый буст' };
		if (boost.category === 'super' && isBoostActive(boost.id)) return { disabled: true, text: 'Активен', meta: 'Активен (таймер)' };
		if (coins < price) return { disabled: true, text: 'Недостаточно монет', meta: `Цена: ${price} 💰` };
		return { disabled: false, text: `Купить за ${price} 💰`, meta: boost.category === 'permanent' ? `Уровень: ${getBoostLevel(boost.id)}` : `Цена: ${price} 💰` };
	}

	function renderBoostTabs() {
		if (!boostsTabs) return;
		boostsTabs.innerHTML = boostCategories.map((cat) => `
			<button type="button" class="boosts-tab ${cat.id === currentBoostCategory ? 'is-active' : ''}" data-boost-category="${cat.id}">${cat.label}</button>
		`).join('');
	}

	function renderActiveBoosts() {
		if (!boostsActiveList) return;
		const now = Date.now();
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
							<div class="boost-active-item__name">${boost.name} — ${seconds}с</div>
							<div class="boost-active-item__time">Осталось ${seconds}с</div>
						</div>
						<div class="boost-progress"><div class="boost-progress__fill" style="width:${Math.max(0, Math.min(100, progress)).toFixed(1)}%"></div></div>
					</div>
				`;
			})
			.filter(Boolean);
		boostsActiveList.innerHTML = items.length ? items.join('') : '<div class="boost-active-item"><div class="boost-active-item__name">Нет активных бустов</div></div>';
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
					<h3 class="boost-card__name">${boost.name}</h3>
					<p class="boost-card__desc">${boost.desc}</p>
					<div class="boost-card__price">${action.meta}</div>
					<div class="boost-card__meta">${boost.category === 'temporary' || boost.category === 'super' ? `Длительность: ${boost.duration}с` : 'Постоянный эффект / моментально'}</div>
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
			showBoostActivation('+500 МОНЕТ');
		}
		if (boost.id === 'super_click') {
			pendingSuperClick = true;
			showBoostActivation('СУПЕР КЛИК x25');
		}
		if (boost.id === 'discount_protocol') {
			pendingDiscount = true;
			showBoostActivation('СКИДКА -50%');
		}
		if (boost.id === 'offline_bonus') {
			const reward = getOfflineBonusReward();
			coins += reward;
			showBoostActivation(`ОФЛАЙН +${reward}`);
		}
	}

	function buyBoost(boostId) {
		const boost = boostById.get(boostId);
		if (!boost) return;
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
			showBoostActivation(boost.id === 'neon_overdrive' ? '×3 КЛИК' : boost.id === 'drone_army' ? 'ДРОНЫ АКТИВНЫ' : 'БУСТ АКТИВЕН');
		}

		if (boost.category === 'super') {
			if (isBoostActive(boost.id)) return;
			coins -= price;
			boostLevels[boost.id] = getBoostLevel(boost.id) + 1;
			closeBoostsModal();
			activateTimedBoost(boost);
			showBoostActivation(boost.id === 'omega_mode' ? 'OMEGA MODE' : 'СУПЕР БУСТ');
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
			showBoostActivation('АПГРЕЙД УСТАНОВЛЕН');
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


	const RESET_BUTTON_IDLE_TEXT = 'Сбросить весь прогресс';
	const RESET_BUTTON_ARMED_TEXT = 'Держите 3 секунды';
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
		setResetLabel(RESET_BUTTON_IDLE_TEXT);
		setResetProgress(0);
	}

	function armResetButton() {
		if (!resetProgressBtn) return;
		clearResetArmTimeout();
		resetArmed = true;
		resetProgressBtn.classList.add('is-armed');
		setResetLabel(RESET_BUTTON_ARMED_TEXT);

		resetArmTimeout = setTimeout(() => {
			resetButtonToIdleState();
		}, RESET_ARM_TIMEOUT_MS);
	}

	function resetGameProgress() {
		stopRobotIncomeTimer();
		try {
			localStorage.clear();
		} catch {
			// localStorage может быть недоступен
		}

		coins = 0;
		clickPower = 1;
		upgradePrice = 85;
		robotPrice = ROBOT_BASE_PRICE;
		robotCount = 0;
		robotIncomePerSecond = 0;
		level = 0;
		levelClicks = 0;
		ownedSkinIds = new Set([DEFAULT_SKIN_ID]);
		selectedSkinId = DEFAULT_SKIN_ID;
		boostLevels = {};
		boostUsageCount = {};
		activeBoosts = {};
		boostTimers.forEach((timer) => clearTimeout(timer));
		boostTimers.clear();
		pendingDiscount = false;
		pendingSuperClick = false;
		boostTimeScale = 1;
		critBoostActive = false;
		brightness = 70;
		applyBrightness(brightness);
		if (brightnessRange) {
			brightnessRange.value = String(brightness);
		}

		applyGlobalVolume(1);
		if (volumeSlider) {
			volumeSlider.value = '100';
		}

		applyTheme('dark');
		setSelectToTheme('dark');

		updateClickObjectSkin();
		renderSkinsGrid();
		updateUI();
		resetButtonToIdleState();
		if (settingsScreen) settingsScreen.classList.add('hidden');
		closeSkinsModal();
		if (menuScreen) menuScreen.classList.remove('hidden');
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
			coins += getEffectiveRobotIncome();
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
	}

	// Загружаем данные из localStorage
	function loadGame() {
		const savedCoins = getStorageItem('coins');
		const savedClickPower = getStorageItem('clickPower');
		const savedUpgradePrice = getStorageItem(CLICK_UPGRADE_PRICE_KEY);
		const savedRobotPrice = getStorageItem(ROBOT_PRICE_KEY);
		const savedRobotCount = getStorageItem(ROBOT_COUNT_KEY);
		const savedRobotIncome = getStorageItem(ROBOT_INCOME_KEY);
		const savedBrightness = getStorageItem(BRIGHTNESS_KEY);
		const savedVolume = getStorageItem(VOLUME_KEY);
		const savedLevel = getStorageItem(LEVEL_KEY);
		const savedLevelClicks = getStorageItem(LEVEL_CLICKS_KEY);
		const savedOwnedSkins = getStorageItem(SKINS_OWNED_KEY);
		const savedSelectedSkin = getStorageItem(SKINS_SELECTED_KEY);
		const savedBoostLevels = getStorageItem(BOOST_LEVELS_KEY);
		const savedBoostUsage = getStorageItem(BOOST_USAGE_KEY);
		const savedActiveBoosts = getStorageItem(BOOST_ACTIVE_KEY);
		const savedPendingDiscount = getStorageItem(BOOST_PENDING_DISCOUNT_KEY);
		const savedPendingSuperClick = getStorageItem(BOOST_PENDING_SUPER_CLICK_KEY);

		if (savedCoins !== null) {
			coins = Math.max(0, toFiniteNumber(savedCoins, 0));
		}
		if (savedClickPower !== null) {
			clickPower = Math.max(1, toFiniteNumber(savedClickPower, 1));
		}
		if (savedUpgradePrice !== null) {
			upgradePrice = Math.max(1, toFiniteNumber(savedUpgradePrice, 85));
		}
		if (savedRobotPrice !== null) {
			robotPrice = Math.max(ROBOT_BASE_PRICE, toFiniteNumber(savedRobotPrice, ROBOT_BASE_PRICE));
		}
		if (savedRobotCount !== null) {
			robotCount = Math.max(0, Math.floor(toFiniteNumber(savedRobotCount, 0)));
		}
		if (savedRobotIncome !== null) {
			robotIncomePerSecond = Math.max(0, Math.floor(toFiniteNumber(savedRobotIncome, 0)));
		} else {
			robotIncomePerSecond = robotCount;
		}

		if (savedBrightness !== null) {
			brightness = clamp(savedBrightness, BR_MIN, BR_MAX);
		} else if (brightnessRange) {
			brightness = clamp(brightnessRange.value || 70, BR_MIN, BR_MAX);
		} else {
			brightness = 70;
		}

		if (savedVolume !== null) {
			applyGlobalVolume(savedVolume);
		}

		if (savedLevel !== null) {
			level = Math.max(0, Math.floor(toFiniteNumber(savedLevel, 0)));
		}
		if (savedLevelClicks !== null) {
			levelClicks = Math.max(0, Math.floor(toFiniteNumber(savedLevelClicks, 0)));
		}
		if (savedOwnedSkins) {
			try {
				const parsed = JSON.parse(savedOwnedSkins);
				if (Array.isArray(parsed)) {
					ownedSkinIds = new Set(
						parsed
							.map((value) => Math.floor(toFiniteNumber(value, -1)))
							.filter((id) => skinById.has(id))
					);
				}
			} catch {
				ownedSkinIds = new Set([DEFAULT_SKIN_ID]);
			}
		}

		ownedSkinIds.add(DEFAULT_SKIN_ID);

		if (savedSelectedSkin !== null) {
			const parsedSelected = Math.floor(toFiniteNumber(savedSelectedSkin, DEFAULT_SKIN_ID));
			if (skinById.has(parsedSelected) && ownedSkinIds.has(parsedSelected)) {
				selectedSkinId = parsedSelected;
			} else {
				selectedSkinId = DEFAULT_SKIN_ID;
			}
		}

		if (savedBoostLevels) {
			try { boostLevels = JSON.parse(savedBoostLevels) || {}; } catch { boostLevels = {}; }
		}
		if (savedBoostUsage) {
			try { boostUsageCount = JSON.parse(savedBoostUsage) || {}; } catch { boostUsageCount = {}; }
		}
		if (savedActiveBoosts) {
			try { activeBoosts = JSON.parse(savedActiveBoosts) || {}; } catch { activeBoosts = {}; }
		}
		pendingDiscount = savedPendingDiscount === '1';
		pendingSuperClick = savedPendingSuperClick === '1';

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
				showBoostActivation('КРИТ x10');
			}
			coins += gainedCoins;

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
	applyBrightness(brightness);
	if (brightnessRange) brightnessRange.value = String(clamp(brightness, BR_MIN, BR_MAX));
	if (volumeSlider) volumeSlider.value = String(Math.round(clamp01(globalVolume) * 100));

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
			robotInfoEl.textContent = `+${robotIncomePerSecond}/сек • ${robotCount} куплено`;
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