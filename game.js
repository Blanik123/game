// Получаем элементы
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');

// Игровые переменные
let gameRunning = false; // Игра начинается на паузе для показа правил
let score = 0;
let totalScore = 0;
let gameSpeed = 4;
let firstLaunch = true;

// Самолёт
const plane = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 100,
    width: 50,
    height: 30,
    speed: 8
};

// Массив облаков
let clouds = [];

// Массив обычных облаков
let normalClouds = [];

// Массив пуль
let bullets = [];

// Массив звёздочек
let stars = [];

// Клавиши
const keys = {
    left: false,
    right: false,
    space: false
};

// Переменная для контроля стрельбы
let lastShotTime = 0;
const shotCooldown = 200; // миллисекунды

// Функции для работы с общим счётом
function loadTotalScore() {
    const saved = localStorage.getItem('planeGameTotalScore');
    return saved ? parseInt(saved) : 0;
}

function saveTotalScore(score) {
    localStorage.setItem('planeGameTotalScore', score.toString());
}

// Загружаем общий счёт при запуске
totalScore = loadTotalScore();

// Обработка нажатий клавиш
document.addEventListener('keydown', (e) => {
    switch(e.code) {
        case 'KeyA':
        case 'ArrowLeft':
            keys.left = true;
            e.preventDefault();
            break;
        case 'KeyD':
        case 'ArrowRight':
            keys.right = true;
            e.preventDefault();
            break;
        case 'Space':
            keys.space = true;
            e.preventDefault();
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch(e.code) {
        case 'KeyA':
        case 'ArrowLeft':
            keys.left = false;
            break;
        case 'KeyD':
        case 'ArrowRight':
            keys.right = false;
            break;
        case 'Space':
            keys.space = false;
            break;
    }
});

// Функция создания грозового облака
function createCloud() {
    const cloud = {
        x: Math.random() * (canvas.width - 60),
        y: -50,
        width: 60,
        height: 45,
        speed: gameSpeed
    };
    clouds.push(cloud);
}

// Функция создания обычного облака
function createNormalCloud() {
    const cloud = {
        x: Math.random() * (canvas.width - 70),
        y: -50,
        width: 70,
        height: 50,
        speed: gameSpeed
    };
    normalClouds.push(cloud);
}

// Функция создания пули
function createBullet() {
    const currentTime = Date.now();
    if (currentTime - lastShotTime > shotCooldown) {
        const bullet = {
            x: plane.x + plane.width / 2 - 2,
            y: plane.y,
            width: 4,
            height: 10,
            speed: 15
        };
        bullets.push(bullet);
        lastShotTime = currentTime;
    }
}

// Функция создания звёздочки
function createStar(x, y) {
    const star = {
        x: x,
        y: y,
        width: 20,
        height: 20,
        speed: gameSpeed,
        collected: false
    };
    stars.push(star);
}

// Функция отрисовки военного самолёта
function drawPlane() {
    ctx.save();
    
    // Основной корпус (улучшенный дизайн)
    ctx.fillStyle = '#606060';
    ctx.fillRect(plane.x + 16, plane.y + 6, 18, 24);
    
    // Градиент для объёма корпуса
    const gradient = ctx.createLinearGradient(plane.x + 16, plane.y + 6, plane.x + 34, plane.y + 6);
    gradient.addColorStop(0, '#707070');
    gradient.addColorStop(0.5, '#606060');
    gradient.addColorStop(1, '#505050');
    ctx.fillStyle = gradient;
    ctx.fillRect(plane.x + 16, plane.y + 6, 18, 24);
    
    // Нос самолёта (более острый и детализированный)
    ctx.fillStyle = '#404040';
    ctx.beginPath();
    ctx.moveTo(plane.x + 25, plane.y);
    ctx.lineTo(plane.x + 16, plane.y + 6);
    ctx.lineTo(plane.x + 20, plane.y + 8);
    ctx.lineTo(plane.x + 25, plane.y + 3);
    ctx.lineTo(plane.x + 30, plane.y + 8);
    ctx.lineTo(plane.x + 34, plane.y + 6);
    ctx.closePath();
    ctx.fill();
    
    // Крылья (современный дизайн)
    const wingGradient = ctx.createLinearGradient(plane.x, plane.y + 14, plane.x + 50, plane.y + 14);
    wingGradient.addColorStop(0, '#708090');
    wingGradient.addColorStop(0.5, '#778899');
    wingGradient.addColorStop(1, '#708090');
    ctx.fillStyle = wingGradient;
    ctx.fillRect(plane.x, plane.y + 14, 50, 8);
    
    // Детали крыльев
    ctx.fillStyle = '#556B7D';
    ctx.fillRect(plane.x + 2, plane.y + 16, 46, 2);
    ctx.fillRect(plane.x + 5, plane.y + 19, 40, 1);
    
    // Современное вооружение
    ctx.fillStyle = '#2F2F2F';
    ctx.fillRect(plane.x + 8, plane.y + 12, 6, 12);
    ctx.fillRect(plane.x + 36, plane.y + 12, 6, 12);
    
    // Детали вооружения
    ctx.fillStyle = '#1F1F1F';
    ctx.fillRect(plane.x + 9, plane.y + 13, 4, 2);
    ctx.fillRect(plane.x + 37, plane.y + 13, 4, 2);
    
    // Хвост и стабилизаторы (улучшенные)
    ctx.fillStyle = '#5A5A5A';
    ctx.fillRect(plane.x + 20, plane.y + 26, 10, 4);
    ctx.fillRect(plane.x + 18, plane.y + 22, 14, 3);
    
    // Вертикальный стабилизатор
    ctx.fillStyle = '#505050';
    ctx.fillRect(plane.x + 23, plane.y + 18, 4, 8);
    
    // Кабина пилота (более реалистичная)
    const cockpitGradient = ctx.createRadialGradient(plane.x + 25, plane.y + 12, 0, plane.x + 25, plane.y + 12, 8);
    cockpitGradient.addColorStop(0, '#4169E1');
    cockpitGradient.addColorStop(0.7, '#1E40AF');
    cockpitGradient.addColorStop(1, '#1E3A8A');
    ctx.fillStyle = cockpitGradient;
    ctx.fillRect(plane.x + 20, plane.y + 8, 10, 8);
    
    // Отражение на кабине
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(plane.x + 21, plane.y + 9, 3, 2);
    
    // Камуфляжные полосы (более реалистичные)
    ctx.fillStyle = '#4A4A4A';
    ctx.fillRect(plane.x + 18, plane.y + 10, 6, 2);
    ctx.fillRect(plane.x + 26, plane.y + 10, 6, 2);
    ctx.fillRect(plane.x + 22, plane.y + 18, 6, 2);
    
    // Звезда (военная маркировка) - более яркая
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 1;
    ctx.beginPath();
    const centerX = plane.x + 6;
    const centerY = plane.y + 17;
    for (let i = 0; i < 5; i++) {
        const angle = (i * 144 - 90) * Math.PI / 180;
        const x = centerX + Math.cos(angle) * 4;
        const y = centerY + Math.sin(angle) * 4;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Двигатели (реактивные сопла)
    ctx.fillStyle = '#2F2F2F';
    ctx.fillRect(plane.x + 12, plane.y + 24, 4, 6);
    ctx.fillRect(plane.x + 34, plane.y + 24, 4, 6);
    
    // Огонь из двигателей
    ctx.fillStyle = '#FF6B35';
    ctx.fillRect(plane.x + 13, plane.y + 28, 2, 3);
    ctx.fillRect(plane.x + 35, plane.y + 28, 2, 3);
    
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(plane.x + 13.5, plane.y + 29, 1, 2);
    ctx.fillRect(plane.x + 35.5, plane.y + 29, 1, 2);
    
    // Антенны и детали
    ctx.strokeStyle = '#808080';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(plane.x + 25, plane.y + 6);
    ctx.lineTo(plane.x + 25, plane.y + 4);
    ctx.stroke();
    
    ctx.restore();
}

// Функция отрисовки пули
function drawBullet(bullet) {
    ctx.save();
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    
    // Добавляем светящийся эффект
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 3;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    
    ctx.restore();
}

// Функция отрисовки звёздочки
function drawStar(star) {
    ctx.save();
    
    const centerX = star.x + star.width / 2;
    const centerY = star.y + star.height / 2;
    
    // Анимация вращения
    const rotation = Date.now() * 0.005;
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);
    
    // Звёздочка
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        const angle = (i * 144) * Math.PI / 180;
        const x = Math.cos(angle) * 8;
        const y = Math.sin(angle) * 8;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Внутренняя звёздочка
    ctx.fillStyle = '#FFFF00';
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        const angle = (i * 144) * Math.PI / 180;
        const x = Math.cos(angle) * 4;
        const y = Math.sin(angle) * 4;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    
    // Светящийся эффект
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 8;
    ctx.fill();
    
    ctx.restore();
}

// Функция отрисовки обычного облака
function drawNormalCloud(cloud) {
    ctx.save();
    
    // Светло-серое обычное облако
    ctx.fillStyle = '#B0C4DE';
    ctx.beginPath();
    
    // Создаём форму облака из кругов
    const centerX = cloud.x + cloud.width / 2;
    const centerY = cloud.y + cloud.height / 2;
    
    ctx.arc(cloud.x + 12, centerY, 12, 0, Math.PI * 2);
    ctx.arc(cloud.x + 28, centerY - 4, 15, 0, Math.PI * 2);
    ctx.arc(cloud.x + 45, centerY, 13, 0, Math.PI * 2);
    ctx.arc(cloud.x + 20, centerY - 8, 10, 0, Math.PI * 2);
    ctx.arc(cloud.x + 37, centerY - 10, 12, 0, Math.PI * 2);
    
    ctx.fill();
    
    // Тень облака
    ctx.fillStyle = '#9FB6CD';
    ctx.beginPath();
    ctx.arc(cloud.x + 15, centerY + 2, 8, 0, Math.PI * 2);
    ctx.arc(cloud.x + 30, centerY + 1, 10, 0, Math.PI * 2);
    ctx.arc(cloud.x + 42, centerY + 2, 9, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

// Функция отрисовки облака (грозы)
function drawCloud(cloud) {
    ctx.save();
    
    // Тёмное грозовое облако
    ctx.fillStyle = '#2F4F4F';
    ctx.beginPath();
    
    // Создаём форму облака из кругов
    const centerX = cloud.x + cloud.width / 2;
    const centerY = cloud.y + cloud.height / 2;
    
    ctx.arc(cloud.x + 15, centerY, 15, 0, Math.PI * 2);
    ctx.arc(cloud.x + 35, centerY - 5, 18, 0, Math.PI * 2);
    ctx.arc(cloud.x + 55, centerY, 16, 0, Math.PI * 2);
    ctx.arc(cloud.x + 25, centerY - 10, 12, 0, Math.PI * 2);
    ctx.arc(cloud.x + 45, centerY - 12, 14, 0, Math.PI * 2);
    
    ctx.fill();
    
    // Молнии
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const lightningX = centerX + Math.sin(Date.now() * 0.01) * 10;
    ctx.moveTo(lightningX, cloud.y + cloud.height);
    ctx.lineTo(lightningX - 5, cloud.y + cloud.height + 15);
    ctx.lineTo(lightningX + 3, cloud.y + cloud.height + 15);
    ctx.lineTo(lightningX - 2, cloud.y + cloud.height + 25);
    
    ctx.stroke();
    
    ctx.restore();
}

// Функция отрисовки фона
function drawBackground() {
    // Облака на заднем плане (обычные белые)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    
    for (let i = 0; i < 5; i++) {
        const x = (i * 200 + Date.now() * 0.02) % (canvas.width + 100) - 50;
        const y = 50 + i * 30;
        
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.arc(x + 25, y, 25, 0, Math.PI * 2);
        ctx.arc(x + 45, y, 20, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Улучшенная функция проверки столкновений с уменьшенным порогом
function checkCollision(rect1, rect2) {
    // Уменьшаем зону столкновения для более точного попадания
    const margin = 3;
    return rect1.x + margin < rect2.x + rect2.width - margin &&
           rect1.x + rect1.width - margin > rect2.x + margin &&
           rect1.y + margin < rect2.y + rect2.height - margin &&
           rect1.y + rect1.height - margin > rect2.y + margin;
}

// Функция обновления игры
function update() {
    if (!gameRunning) return;
    
    // Движение самолёта
    if (keys.left && plane.x > 0) {
        plane.x -= plane.speed;
    }
    if (keys.right && plane.x < canvas.width - plane.width) {
        plane.x += plane.speed;
    }
    
    // Стрельба
    if (keys.space) {
        createBullet();
    }
    
    // Создание облаков
    if (Math.random() < 0.015) {
        createCloud();
    }
    
    // Создание обычных облаков
    if (Math.random() < 0.01) {
        createNormalCloud();
    }
    
    // Обновление пуль
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bullets[i].speed;
        
        // Удаление пуль за пределами экрана
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
            continue;
        }
        
        // Проверка столкновения пуль с облаками
        for (let j = clouds.length - 1; j >= 0; j--) {
            if (checkCollision(bullets[i], clouds[j])) {
                // Создаём звёздочку на месте уничтоженного облака
                createStar(clouds[j].x + clouds[j].width / 2 - 10, clouds[j].y + clouds[j].height / 2 - 10);
                
                // Удаляем облако и пулю
                clouds.splice(j, 1);
                bullets.splice(i, 1);
                break;
            }
        }
    }
    
    // Обновление облаков
    for (let i = clouds.length - 1; i >= 0; i--) {
        clouds[i].y += clouds[i].speed;
        
        // Проверка столкновения с самолётом
        if (checkCollision(plane, clouds[i])) {
            gameOver();
            return;
        }
        
        // Удаление облаков за пределами экрана
        if (clouds[i].y > canvas.height) {
            clouds.splice(i, 1);
            score += 1;
            
            // Увеличение скорости игры
            if (score % 100 === 0) {
                gameSpeed += 0.5;
            }
        }
    }
    
    // Обновление обычных облаков
    for (let i = normalClouds.length - 1; i >= 0; i--) {
        normalClouds[i].y += normalClouds[i].speed;
        
        // Проверка столкновения с самолётом (урон)
        if (checkCollision(plane, normalClouds[i])) {
            score -= 5;
            if (score < 0) score = 0;
            normalClouds.splice(i, 1);
            continue;
        }
        
        // Удаление облаков за пределами экрана
        if (normalClouds[i].y > canvas.height) {
            normalClouds.splice(i, 1);
        }
    }

    // Обновление звёздочек
    for (let i = stars.length - 1; i >= 0; i--) {
        // Движение звёздочки вниз
        stars[i].y += stars[i].speed;
        
        // Проверка сбора звёздочки
        if (checkCollision(plane, stars[i]) && !stars[i].collected) {
            stars[i].collected = true;
            score += 15;
            stars.splice(i, 1);
        }
        // Удаление звёздочек, которые упали слишком низко
        else if (stars[i].y > canvas.height) {
            stars.splice(i, 1);
        }
    }
    
    // Обновление счёта
    scoreElement.textContent = score;
    document.getElementById('totalScore').textContent = totalScore;
}

// Функция отрисовки
function draw() {
    // Очистка canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Отрисовка фона
    drawBackground();
    
    // Отрисовка грозовых облаков
    clouds.forEach(cloud => drawCloud(cloud));
    
    // Отрисовка обычных облаков
    normalClouds.forEach(cloud => drawNormalCloud(cloud));
    
    // Отрисовка пуль
    bullets.forEach(bullet => drawBullet(bullet));
    
    // Отрисовка звёздочек
    stars.forEach(star => drawStar(star));
    
    // Отрисовка самолёта
    drawPlane();
}

// Функция окончания игры
function gameOver() {
    gameRunning = false;
    totalScore += score;
    saveTotalScore(totalScore);
    finalScoreElement.textContent = score;
    document.getElementById('totalScore').textContent = totalScore;
    gameOverElement.style.display = 'block';
}

// Функция перезапуска игры
function restartGame() {
    gameRunning = true;
    score = 0;
    gameSpeed = 4;
    plane.x = canvas.width / 2 - 25;
    clouds = [];
    normalClouds = [];
    bullets = [];
    stars = [];
    keys.left = false;
    keys.right = false;
    keys.space = false;
    lastShotTime = 0;
    firstLaunch = false;
    gameOverElement.style.display = 'none';
    scoreElement.textContent = '0';
}

// Главный игровой цикл
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Функции для работы с меню и модальными окнами
function toggleMenu() {
    const menu = document.getElementById('dropdownMenu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

function showRules() {
    document.getElementById('dropdownMenu').style.display = 'none';
    document.getElementById('rulesModal').style.display = 'block';
}

function showInventory() {
    document.getElementById('dropdownMenu').style.display = 'none';
    document.getElementById('inventoryModal').style.display = 'block';
}

function showLeaderboard() {
    document.getElementById('dropdownMenu').style.display = 'none';
    // Обновляем лучший результат
    const bestScore = Math.max(totalScore, localStorage.getItem('bestScore') || 0);
    localStorage.setItem('bestScore', bestScore);
    document.getElementById('bestScore').textContent = bestScore;
    document.getElementById('leaderboardModal').style.display = 'block';
}

function showShop() {
    document.getElementById('dropdownMenu').style.display = 'none';
    document.getElementById('shopModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function startGame() {
    closeModal('rulesModal');
    gameRunning = true;
    firstLaunch = false;
}

function buyPoints(amount) {
    alert(`Покупка ${amount} очков пока недоступна. Функция в разработке!`);
}

// Закрытие меню при клике вне его
document.addEventListener('click', function(event) {
    const menu = document.getElementById('dropdownMenu');
    const menuButton = document.getElementById('menuButton');
    
    if (!menuButton.contains(event.target) && !menu.contains(event.target)) {
        menu.style.display = 'none';
    }
});

// Закрытие модальных окон при клике вне их
window.addEventListener('click', function(event) {
    const modals = ['rulesModal', 'inventoryModal', 'leaderboardModal', 'shopModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (event.target === modal) {
            closeModal(modalId);
        }
    });
});

// Инициализация интерфейса
document.getElementById('totalScore').textContent = totalScore;

// Показ правил при первом запуске
if (firstLaunch) {
    setTimeout(() => {
        showRules();
    }, 500);
}

// Запуск игры
gameLoop();