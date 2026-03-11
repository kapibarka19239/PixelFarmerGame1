// === КАРТЫ, ЗДАНИЯ, NPC ===
export const outdoorBuildings = [
    { id: 'house1', x: 50, y: 50, w: 100, h: 80, color: '#795548', 
      doorX: 90, doorY: 130, interiorMap: 'house1' },
    { id: 'house2', x: 400, y: 100, w: 120, h: 90, color: '#a1887f', 
      doorX: 450, doorY: 190, interiorMap: 'house2' },
    { id: 'house3', x: 200, y: 350, w: 110, h: 90, color: '#2196f3', 
      doorX: 245, doorY: 440, interiorMap: 'house3' }
];

export const outdoorVeggies = [];

export function spawnVeg(array, x, y) {
    array.push({ x, y, size: 15, active: true, lastGathered: 0 });
}

export function spawnOutdoorVeg() {
    outdoorVeggies.length = 0;
    spawnVeg(outdoorVeggies, 200, 100);
    spawnVeg(outdoorVeggies, 230, 100);
    spawnVeg(outdoorVeggies, 200, 130);
    spawnVeg(outdoorVeggies, 230, 130);
    spawnVeg(outdoorVeggies, 450, 350);
    spawnVeg(outdoorVeggies, 480, 350);
}

export const trader = {
    x: 500, y: 200, size: 30, name: "Торговец",
    msg: "Привет! Обменяю 5 морковок на 1 монету!",
    isTrader: true
};

export const outdoorNpcs = [
    { x: 170, y: 80, size: 30, name: "Староста", msg: "Прекрасный день!", clothesColor: '#1565c0' },
    { x: 350, y: 400, size: 30, name: "Сосед", msg: "Мои морковки быстрее!", clothesColor: '#1565c0' },
    trader,
    { x: 100, y: 250, size: 30, name: "Тёмный странник", msg: "Я из далёких земель...", clothesColor: '#000000' },
    { x: 500, y: 350, size: 30, name: "Ночной охотник", msg: "Осторожно в лесу!", clothesColor: '#1a1a1a', isHunter: true },
    { x: 250, y: 450, size: 30, name: "Теневой торговец", msg: "Редкие товары...", clothesColor: '#0d0d0d' }
];

// === ИНТЕРЬЕРЫ ===
export const house1Furniture = [
    { x: 20, y: 20, w: 150, h: 20, color: '#5d4037' },
    { x: 400, y: 300, w: 40, h: 60, color: '#3e2723' }
];

export const house1Npcs = [
    { x: 250, y: 250, size: 30, name: "Староста (дома)", msg: "Заходи!" }
];

export const house1Exit = { x: 280, y: 460, w: 40, h: 20, targetMap: 'outdoor', targetX: 90, targetY: 160 };

export const house2Furniture = [
    { x: 100, y: 100, w: 200, h: 20, color: '#8d6e63' },
    { x: 50, y: 300, w: 60, h: 60, color: '#4e342e' }
];

export const house2Npcs = [
    { x: 300, y: 200, size: 30, name: "Сосед (дома)", msg: "Тишина..." }
];

export const house2Exit = { x: 280, y: 460, w: 40, h: 20, targetMap: 'outdoor', targetX: 450, targetY: 220 };

export const house3Furniture = [];
export const house3Npcs = [];
export const house3Exit = { x: 280, y: 460, w: 40, h: 20, targetMap: 'outdoor', targetX: 245, targetY: 470 };

export const house3Chest = {
    x: 300, y: 200, w: 40, h: 30, color: '#5d4037',
    storedCarrots: 0, showCounterUntil: 0
};

// === ЗОНЫ ПЕРЕХОДА ===
export const villageExit = {
    x: 280, y: 10, w: 40, h: 30,
    targetMap: 'forest', targetX: 300, targetY: 450
};

export const forestReturn = {
    x: 280, y: 450, w: 40, h: 30,
    targetMap: 'outdoor', targetX: 300, targetY: 50
};