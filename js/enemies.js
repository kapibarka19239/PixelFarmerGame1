// === enemies.js — СИСТЕМА ВОЛКОВ ===
import { 
    isNight, 
    currentMap, 
    player, 
    playerHits, 
    setPlayerHits,
    getMaxHealth 
} from './state.js';

// === КОНСТАНТЫ ===
const WOLF_SPAWN_INTERVAL = 3000;
const MAX_WOLVES = 5;
const WOLF_SPEED = 1.5;
const WOLF_SIZE = 25;
const WOLF_ATTACK_COOLDOWN = 1000;
const ATTACK_RANGE = 60;

// === СОСТОЯНИЕ ВОЛКОВ ===
export let wolves = [];
let lastWolfSpawn = 0;
let lastWolfAttack = 0;
export let wolvesKilledTotal = 0;
export let wolfSkins = 0;

// === ЭКСПОРТ ДЛЯ ДОСТУПА ИЗ ДРУГИХ ФАЙЛОВ ===
export function getWolves() { return wolves; }
export function setWolves(value) { wolves = value; }
export function getWolfSkins() { return wolfSkins; }
export function setWolfSkins(value) { wolfSkins = value; }
export function getWolvesKilledTotal() { return wolvesKilledTotal; }

// === СОЗДАНИЕ ВОЛКА ===
export function spawnWolf(canvas) {
    if (!isNight || currentMap !== 'outdoor') return;
    if (wolves.length >= MAX_WOLVES) return;
    
    const side = Math.floor(Math.random() * 4);
    let x, y;
    switch (side) {
        case 0: x = Math.random() * canvas.width; y = -30; break;
        case 1: x = canvas.width + 30; y = Math.random() * canvas.height; break;
        case 2: x = Math.random() * canvas.width; y = canvas.height + 30; break;
        case 3: x = -30; y = Math.random() * canvas.height; break;
    }
    
    wolves.push({ x, y, size: WOLF_SIZE, speed: WOLF_SPEED, lastAttack: 0 });
}

// === АТАКА ВОЛКА ===
export function wolfAttack(transitionOverlay, switchMap) {
    if (Date.now() - lastWolfAttack < WOLF_ATTACK_COOLDOWN) return;
    
    wolves.forEach(wolf => {
        const dist = Math.hypot(
            (player.x + 15) - (wolf.x + 12), 
            (player.y + 15) - (wolf.y + 12)
        );
        
        if (dist < 30) {
            setPlayerHits(playerHits + 1);
            lastWolfAttack = Date.now();
            wolf.lastAttack = Date.now();
            
            if (transitionOverlay) {
                transitionOverlay.style.background = 'rgba(255, 0, 0, 0.3)';
                transitionOverlay.style.opacity = 0.5;
                setTimeout(() => {
                    transitionOverlay.style.opacity = 0;
                    transitionOverlay.style.background = 'black';
                }, 200);
            }
            
            if (playerHits >= getMaxHealth()) {
                setPlayerHits(0);
                wolves = [];
                if (switchMap) switchMap('house3', 280, 250);
            }
        }
    });
}

// === ОБНОВЛЕНИЕ ВОЛКОВ ===
export function updateWolves(canvas, transitionOverlay, switchMap) {
    if (!isNight || currentMap !== 'outdoor') {
        wolves = [];
        return;
    }
    
    if (Date.now() - lastWolfSpawn > WOLF_SPAWN_INTERVAL) {
        spawnWolf(canvas);
        lastWolfSpawn = Date.now();
    }
    
    wolves.forEach(wolf => {
        const dx = player.x - wolf.x;
        const dy = player.y - wolf.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 0) {
            wolf.x += (dx / dist) * wolf.speed;
            wolf.y += (dy / dist) * wolf.speed;
        }
    });
    
    wolfAttack(transitionOverlay, switchMap);
}

// === ОТРИСОВКА ВОЛКОВ ===
export function drawWolves(ctx) {
    if (currentMap !== 'outdoor') return;
    
    wolves.forEach(wolf => {
        ctx.fillStyle = '#424242';
        ctx.fillRect(wolf.x, wolf.y, wolf.size, wolf.size);
        
        // Уши
        ctx.beginPath();
        ctx.moveTo(wolf.x, wolf.y);
        ctx.lineTo(wolf.x + 5, wolf.y - 8);
        ctx.lineTo(wolf.x + 10, wolf.y);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(wolf.x + wolf.size - 10, wolf.y);
        ctx.lineTo(wolf.x + wolf.size - 5, wolf.y - 8);
        ctx.lineTo(wolf.x + wolf.size, wolf.y);
        ctx.fill();
        
        // Глаза
        ctx.fillStyle = '#ff0000';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff0000';
        ctx.fillRect(wolf.x + 5, wolf.y + 8, 4, 4);
        ctx.fillRect(wolf.x + wolf.size - 9, wolf.y + 8, 4, 4);
        ctx.shadowBlur = 0;
        
        // Нос
        ctx.fillStyle = '#000000';
        ctx.fillRect(wolf.x + wolf.size / 2 - 3, wolf.y + 15, 6, 4);
    });
}

// === АТАКА ИГРОКА ===
export function handlePlayerAttack() {
    for (let i = wolves.length - 1; i >= 0; i--) {
        let wolf = wolves[i];
        let dist = Math.hypot(
            (player.x + 15) - (wolf.x + 12), 
            (player.y + 15) - (wolf.y + 12)
        );
        
        if (dist < ATTACK_RANGE) {
            wolves.splice(i, 1);
            wolvesKilledTotal++;
            
            if (wolvesKilledTotal % 5 === 0) {
                wolfSkins++;
                const skinCountEl = document.getElementById('skinCount');
                if (skinCountEl) skinCountEl.textContent = wolfSkins;
            }
        }
    }
}

// === СЧЁТЧИК УДАРОВ ===
export function drawHitCounter(ctx, canvas) {
    if (playerHits > 0 && currentMap === 'outdoor' && isNight) {
        ctx.fillStyle = '#ff0000';
        ctx.font = 'bold 16px Courier New';
        ctx.fillText(`Удары: ${playerHits}/${getMaxHealth()}`, canvas.width - 120, 40);
        
        ctx.fillStyle = '#333';
        ctx.fillRect(canvas.width - 120, 50, 100, 10);
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(canvas.width - 120, 50, 100 * (1 - playerHits / getMaxHealth()), 10);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(canvas.width - 120, 50, 100, 10);
    }
}