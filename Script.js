// 1. DOM

// Ждем загрузки всей страницы
document.addEventListener('DOMContentLoaded', () => {
	const menuScreen = document.getElementById('menu'); // Ссылки на наши экраны
	const gameScreen = document.getElementById('game');
	const aboutScreen = document.getElementById('show-about-modal');

	const startBtn = document.getElementById('start-btn'); // Кнопки
	const backBtn = document.getElementById('back-menu-btn');
	// console.log(startBtn.dataset.lang);

	// let abountBtn = document.querySelector("#about-btn");
	const abountBtn = document.getElementById('about-btn');
	const closeAbout = document.getElementById('close-about');
	console.log(abountBtn);

	// Game Start
	function startGame() {
		menuScreen.classList.add('hidden'); // 1. Убираем "active" у меню (оно исчезает)
		console.log("Игра началась!"); // Для проверки
	}

	// Функция возврата в меню
	function goToMenu() {
		menuScreen.classList.remove('hidden');
	}

	if(startBtn) {
		startBtn.addEventListener('click', startGame); // Слушаем клики по кнопкам
	}

	if(backBtn) {
		backBtn.addEventListener('click', goToMenu);
	}

	if(abountBtn) {
		abountBtn.onclick = () => {
			aboutScreen.classList.remove('hidden');
		};
	}
	
	if(closeAbout) {
		closeAbout.onclick = () => {
			aboutScreen.classList.add('hidden');
		};
	}
});