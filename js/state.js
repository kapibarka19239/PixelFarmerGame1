// === state.js — СОСТОЯНИЕ ИГРЫ ===

// === ЭКСПОРТИРУЕМЫЕ ПЕРЕМЕННЫЕ ===
export let carrotsCollected = 0;
export let coinsCollected = 0;
export let wolfSkins = 0;
export let wolvesKilledTotal = 0;
export let playerHits = 0;
export let playerClothesColor = '#1565c0';
export let currentMap = 'outdoor';
export let isTransitioning = false;
export let isTrading = false;
export let isNight = false;
export let isSkinMenuOpen = false;
export let tradeMode = 'carrots';
export let lastTimeSwitch = Date.now();

// === ИГРОК ===
export const player = {
    x: 300, 
    y: 300,
    size: 30,
    speed: 3,
    dir: 's',
    spawnX: 300, 
    spawnY: 300,
    hasSword: false,
    hasArmor: false
};

// === ФУНКЦИЯ ПОЛУЧЕНИЯ МАКС. ЗДОРОВЬЯ ===
export function getMaxHealth() {
    return player.hasArmor ? 20 : 10;
}

// === ФУНКЦИЯ ОБНОВЛЕНИЯ UI ===
export function updateUI() {
    const carrotEl = document.getElementById('carrotCount');
    const coinEl = document.getElementById('coinCount');
    const skinEl = document.getElementById('skinCount');
    
    if (carrotEl) carrotEl.textContent = carrotsCollected;
    if (coinEl) coinEl.textContent = coinsCollected;
    if (skinEl) skinEl.textContent = wolfSkins;
}

// === СЕТТЕРЫ ДЛЯ ИЗМЕНЕНИЯ ПЕРЕМЕННЫХ ===
export function setCarrots(value) { carrotsCollected = value; updateUI(); }
export function setCoins(value) { coinsCollected = value; updateUI(); }
export function setSkins(value) { wolfSkins = value; updateUI(); }
export function setPlayerHits(value) { playerHits = value; }
export function setCurrentMap(map) { currentMap = map; }
export function setIsTransitioning(value) { isTransitioning = value; }
export function setIsTrading(value) { isTrading = value; }
export function setIsNight(value) { isNight = value; }
export function setTradeMode(mode) { tradeMode = mode; }