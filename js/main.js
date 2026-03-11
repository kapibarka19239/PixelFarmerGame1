// === ТОЧКА ВХОДА И ИГРОВОЙ ЦИКЛ ===
import { CONFIG } from './config.js';
import { gameState, player } from './state.js';
import { spawnOutdoorVeg } from './maps.js';
import { updateWolves } from './enemies.js';
import { updatePlayer } from './player.js';
import { draw } from './render.js';
import { initInput } from './input.js';
import { loadGame } from './save.js';

// === ИНИЦИАЛИЗАЦИЯ CANVAS И ЭЛЕМЕНТОВ ===
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const dialogBox = document.getElementById('dialog');
const transitionOverlay = document.getElementById('transition');
const carrotCountEl = document.getElementById('carrotCount');
const coinCountEl = document.getElementById('coinCount');
const tradeMenu = document.getElementById('tradeMenu');
const skinMenu = document.getElementById('skinMenu');

canvas.width = CONFIG.CANVAS_WIDTH;
canvas.height = CONFIG.CANVAS_HEIGHT;

// === ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ КАРТЫ ===
export function switchMap(newMap, newX, newY) {
    gameState.isTransitioning = true;
    transitionOverlay.style.opacity = 1;
    setTimeout(() => {
        gameState.currentMap = newMap;
        player.x = newX;
        player.y = newY;
        dialogBox.style.display = 'none';
        transitionOverlay.style.opacity = 0;
        setTimeout(() => { gameState.isTransitioning = false; }, 900);
    }, 900);
}

// === ИГРОВОЙ ЦИКЛ ===
function update() {
    if (gameState.isTransitioning || gameState.isTrading || gameState.isSkinMenuOpen) return;
    
    // Смена дня и ночи
    if (Date.now() - gameState.lastTimeSwitch > CONFIG.DAY_DURATION) {
        gameState.isNight = !gameState.isNight;
        gameState.lastTimeSwitch = Date.now();
        if (!gameState.isNight) {
            gameState.playerHits = 0;
        }
    }
    
    // Респавн овощей
    if (gameState.currentMap === 'outdoor') {
        // логика респавна
    }
    
    updateWolves();
    updatePlayer();
}

function loop() {
    update();
    draw(ctx);
    requestAnimationFrame(loop);
}

// === ЗАПУСК ИГРЫ ===
spawnOutdoorVeg();
loadGame();
initInput(canvas, dialogBox, tradeMenu, skinMenu);
loop();