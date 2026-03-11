// === СОХРАНЕНИЕ И ЗАГРУЗКА ===
import { gameState, player } from './state.js';
import { carrotsCollected, coinsCollected, wolfSkins } from './state.js';

export function saveGame() {
    const saveData = {
        carrots: carrotsCollected,
        coins: coinsCollected,
        skins: wolfSkins,
        hasSword: player.hasSword,
        hasArmor: player.hasArmor,
        clothesColor: gameState.playerClothesColor,
        x: player.x,
        y: player.y,
        map: gameState.currentMap
    };
    localStorage.setItem('rpgSave', JSON.stringify(saveData));
}

export function loadGame() {
    const saveData = localStorage.getItem('rpgSave');
    if (saveData) {
        const data = JSON.parse(saveData);
        carrotsCollected = data.carrots || 0;
        coinsCollected = data.coins || 0;
        wolfSkins = data.skins || 0;
        player.hasSword = data.hasSword || false;
        player.hasArmor = data.hasArmor || false;
        gameState.playerClothesColor = data.clothesColor || '#1565c0';
        player.x = data.x || 300;
        player.y = data.y || 300;
        gameState.currentMap = data.map || 'outdoor';
    }
}