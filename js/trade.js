// === ТОРГОВЛЯ И МЕНЮ ===
import { gameState, player, carrotsCollected, coinsCollected, wolfSkins } from './state.js';

export function closeTradeMenu() {
    const tradeMenu = document.getElementById('tradeMenu');
    if (tradeMenu) tradeMenu.style.display = 'none';
    gameState.isTrading = false;
}

export function closeSkinMenu() {
    const skinMenu = document.getElementById('skinMenu');
    if (skinMenu) skinMenu.style.display = 'none';
    gameState.isSkinMenuOpen = false;
}

export function changeSkinColor(color) {
    gameState.playerClothesColor = color;
    saveGame();
}

export function exchangeCarrots() {
    if (gameState.tradeMode === 'carrots') {
        if (carrotsCollected >= 5) {
            carrotsCollected -= 5;
            coinsCollected += 1;
            updateUI();
            saveGame();
        } else {
            alert("Нужно минимум 5 морковок!");
        }
    }
}

export function buyArmor() {
    if (coinsCollected >= 5 && wolfSkins >= 3 && !player.hasArmor) {
        coinsCollected -= 5;
        wolfSkins -= 3;
        player.hasArmor = true;
        updateUI();
        alert("Доспех куплен! Здоровье увеличено до 20.");
        closeTradeMenu();
        saveGame();
    } else {
        alert("Недостаточно ресурсов! Нужно 5 монет и 3 шкуры.");
    }
}

export function updateTradeMenuUI() {
    const tradeMenu = document.getElementById('tradeMenu');
    if (!tradeMenu) return;
    
    if (gameState.tradeMode === 'carrots') {
        tradeMenu.innerHTML = `<h3>🏪 Лавка Торговца</h3>
            <p>Курс: 5 🥕 = 1 🪙</p>
            <p>У вас: ${carrotsCollected} 🥕</p>
            <button onclick="exchangeCarrots()">Обменять</button>
            <button onclick="buyArmor()">Купить доспех (5🪙+3🐺)</button>
            <button onclick="closeTradeMenu()">Закрыть (Q)</button>`;
    }
    // ... другие режимы торговли
}

export function updateUI() {
    document.getElementById('carrotCount').textContent = carrotsCollected;
    document.getElementById('coinCount').textContent = coinsCollected;
    document.getElementById('skinCount').textContent = wolfSkins;
}