// 1. DOM

// Ждем загрузки всей страницы
document.addEventListener('DOMContentLoaded', () => {
	const menuScreen = document.getElementById('menu'); // Ссылки на наши экраны
	const gameScreen = document.getElementById('game');
	const aboutScreen = document.getElementById('about-modal');
	const settingsScreen = document.getElementById('settings');

	const startBtn = document.getElementById('start-btn'); // Кнопки начать игру
	const backBtn = document.getElementById('back-menu-btn'); // В меню

	const abountBtn = document.getElementById('about-btn'); // Об игре
	const closeAbout = document.getElementById('close-about');

	const settingsBtn = document.getElementById('settings-btn'); //настройки
	const closeSetting = document.getElementById('close-settings');

	const THEME_KEY = 'theme'; //тема
	const themeSelect = document.querySelector('.theme-select');

	//Кликер
	const scoreEl = document.getElementById('score');
	const clickPowerEl = document.getElementById('click-power-val');
	const clickObject = document.getElementById('click-object');
	const gameEl = document.getElementById('game'); 

	let coins = 0;
	let clickPower = 1;

	// Game Start
	function startGame() {
		menuScreen.classList.add('hidden'); 
	}

	// Функция возврата в меню
	function goToMenu() {
		menuScreen.classList.remove('hidden');
	}

	if(startBtn) {
		startBtn.addEventListener('click', startGame); // Слушаем клики по кнопкам
	}

	if(backBtn) {
		backBtn.addEventListener('click', goToMenu); //мЕню
	}

	if(abountBtn) {
		abountBtn.onclick = () => {
			aboutScreen.classList.remove('hidden'); //об игре
		};
	}
	
	if(closeAbout) {
		closeAbout.onclick = () => {
			aboutScreen.classList.add('hidden'); // крестик об игре
		};
	}

	if(settingsBtn){
		settingsBtn.onclick = () => {
			settingsScreen.classList.remove('hidden'); //Настройки
		};
	}

	if(closeSetting) {
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

	document.body.classList.remove('light_theme', 'auto', 'dark');   // снимаем старые классы

	if(t === 'light') {
		document.body.classList.add('light_theme');
	} else if(t === 'auto') {
		document.body.classList.add('auto');
	} else document.body.classList.add('dark'); // default = dark
	}

	function setSelectToTheme(theme) {
		if(!themeSelect) return;
		const t = normalizeTheme(theme);
		const options = Array.from(themeSelect.options); // Подбираем option по data-theme (в HTML: dark/light/Avto)
		const wanted = (t === 'auto') ? 'auto' : t; // совпадаем с тем, что в разметке
		const opt = options.find(o => (o.dataset.theme || '').toLowerCase() === wanted);
		if(opt) {
			themeSelect.value = opt.value; // value у option без value = её текст
		}
	}

	// 1) При загрузке — вспомнить тему или поставить тёмную по умолчанию
	const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
	applyTheme(savedTheme);
	setSelectToTheme(savedTheme);

	// 2) При смене select — применить и сохранить
	if (themeSelect) {
	themeSelect.addEventListener('change', () => {
		const selectedOption = themeSelect.options[themeSelect.selectedIndex];
		const selectedTheme = selectedOption?.dataset?.theme || 'dark';

		applyTheme(selectedTheme);
		localStorage.setItem(THEME_KEY, normalizeTheme(selectedTheme));
	});
	}

//---------------КЛИКЕР-------------------------------------

// Обновляет числа на экране
	function updateUI() {
		scoreEl.textContent = coins;
		clickPowerEl.textContent = clickPower;
	}
	// Сохраняем данные в localStorage
	function saveGame() {
		localStorage.setItem('coins', coins);
		localStorage.setItem('clickPower', clickPower);
	}
	// Загружаем данные из localStorage
	function loadGame() {
		const savedCoins = localStorage.getItem('coins');
		const savedClickPower = localStorage.getItem('clickPower');
		if(savedCoins !== null) {
			coins = Number(savedCoins);
		}
		if(savedClickPower !== null) {
			clickPower = Number(savedClickPower);
		}
	}

	// Клик по роботу
	if (clickObject) {
	clickObject.addEventListener('pointerdown', (e) => {
		e.preventDefault();
		coins += clickPower;
		updateUI();
		saveGame();
		createFloatingNumber(e.clientX, e.clientY, clickPower);
	});
	}
	loadGame(); // 1. загружаем сохранение
	updateUI(); // 2. показываем данные на экране
	


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
		el.style.left = (x + randomX) + 'px';
		el.style.top = y + 'px';

		gameEl.appendChild(el);
	setTimeout(() => el.remove(), 900);
	}


});