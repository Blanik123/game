// Получаем элементы
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');

// Игровые переменные
let gameRunning = true;
let score = 0;
let gameSpeed = 2;

// Самолёт
const plane = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 100,
    width: 50,
    height: 30,
    speed: 5
};

// Массив облаков
let clouds = [];

// Клавиши
const keys = {
    left: false,
    right: false
};

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
    }
});

// Функция создания облака
function createCloud() {
    const cloud = {
        x: Math.random() * (canvas.width - 80),
        y: -50,
        width: 80,
        height: 60,
        speed: gameSpeed
    };
    clouds.push(cloud);
}

// Функция отрисовки самолёта
function drawPlane() {
    ctx.save();
    
    // Корпус самолёта
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(plane.x + 20, plane.y + 10, 10, 20);
    
    // Крылья
    ctx.fillStyle = '#A0A0A0';
    ctx.fillRect(plane.x + 5, plane.y + 15, 40, 8);
    
    // Нос самолёта
    ctx.fillStyle = '#808080';
    ctx.beginPath();
    ctx.moveTo(plane.x + 25, plane.y);
    ctx.lineTo(plane.x + 20, plane.y + 10);
    ctx.lineTo(plane.x + 30, plane.y + 10);
    ctx.closePath();
    ctx.fill();
    
    // Хвост
    ctx.fillStyle = '#606060';
    ctx.fillRect(plane.x + 22, plane.y + 25, 6, 5);
    
    // Окна
    ctx.fillStyle = '#4169E1';
    ctx.fillRect(plane.x + 23, plane.y + 12, 4, 3);
    
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

// Функция проверки столкновений
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
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
    
    // Создание облаков
    if (Math.random() < 0.02) {
        createCloud();
    }
    
    // Обновление облаков
    for (let i = clouds.length - 1; i >= 0; i--) {
        clouds[i].y += clouds[i].speed;
        
        // Проверка столкновения
        if (checkCollision(plane, clouds[i])) {
            gameOver();
            return;
        }
        
        // Удаление облаков за пределами экрана
        if (clouds[i].y > canvas.height) {
            clouds.splice(i, 1);
            score += 10;
            
            // Увеличение скорости игры
            if (score % 100 === 0) {
                gameSpeed += 0.5;
            }
        }
    }
    
    // Обновление счёта
    scoreElement.textContent = score;
}

// Функция отрисовки
function draw() {
    // Очистка canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Отрисовка фона
    drawBackground();
    
    // Отрисовка облаков
    clouds.forEach(cloud => drawCloud(cloud));
    
    // Отрисовка самолёта
    drawPlane();
}

// Функция окончания игры
function gameOver() {
    gameRunning = false;
    finalScoreElement.textContent = score;
    gameOverElement.style.display = 'block';
}

// Функция перезапуска игры
function restartGame() {
    gameRunning = true;
    score = 0;
    gameSpeed = 2;
    plane.x = canvas.width / 2 - 25;
    clouds = [];
    keys.left = false;
    keys.right = false;
    gameOverElement.style.display = 'none';
    scoreElement.textContent = '0';
}

// Главный игровой цикл
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Запуск игры
gameLoop();