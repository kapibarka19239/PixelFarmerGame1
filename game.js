// === ИНИЦИАЛИЗАЦИЯ CANVAS И ЭЛЕМЕНТОВ ИНТЕРФЕЙСА ===
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const dialogBox = document.getElementById('dialog');
const transitionOverlay = document.getElementById('transition');
const carrotCountEl = document.getElementById('carrotCount');
const coinCountEl = document.getElementById('coinCount');
const tradeMenu = document.getElementById('tradeMenu');
const skinMenu = document.getElementById('skinMenu');

// === КАСТОМИЗАЦИЯ СКИНА ===
let playerClothesColor = '#1565c0';
let isSkinMenuOpen = false;

// === СОЗДАНИЕ СЧЁТЧИКА ШКУР (ЧТОБЫ НЕ МЕНЯТЬ HTML) ===
const counterContainer = document.getElementById('carrotCounter');
let skinCountEl;
if (counterContainer) {
    const skinLabel = document.createTextNode(' 🐺 ');
    skinCountEl = document.createElement('span');
    skinCountEl.id = 'skinCount';
    skinCountEl.textContent = '0';
    skinCountEl.style.fontWeight = 'bold';
    counterContainer.appendChild(skinLabel);
    counterContainer.appendChild(skinCountEl);
}

canvas.width = 600;
canvas.height = 500;
const keys = {};

// === СОСТОЯНИЕ ИГРЫ ===
let currentMap = 'outdoor';
let isTransitioning = false;
let carrotsCollected = 0;
let coinsCollected = 0;
let isTrading = false;
let tradeMode = 'carrots'; // 'carrots', 'sword' или 'skins'

// === НОВЫЕ ПЕРЕМЕННЫЕ ДЛЯ ШКУР ===
let wolfSkins = 0;
let wolvesKilledTotal = 0;

// === СИСТЕМА ДНЯ И НОЧИ ===
let isNight = false;
let lastTimeSwitch = Date.now();
const DAY_DURATION = 30000; // 30 секунд

// === СИСТЕМА ВОЛКОВ ===
let wolves = [];
let playerHits = 0;
const WOLF_SPAWN_INTERVAL = 3000;
let lastWolfSpawn = 0;
const MAX_WOLVES = 5;
const WOLF_SPEED = 1.5;
const WOLF_SIZE = 25;
const WOLF_ATTACK_COOLDOWN = 1000;
let lastWolfAttack = 0;

// === АТАКА ИГРОКА ===
let isAttacking = false;
let attackTimer = 0;
const ATTACK_DURATION = 200;
const ATTACK_RANGE = 60;

const player = {
    x: 300, y: 300,
    size: 30,
    speed: 3,
    dir: 's',
    spawnX: 300, spawnY: 300,
    hasSword: false,
    hasArmor: false
};

// === ФУНКЦИЯ ПОЛУЧЕНИЯ МАКС. ЗДОРОВЬЯ ===
function getMaxHealth() {
    return player.hasArmor ? 20 : 10;
}

// === КОНФИГУРАЦИЯ КАРТ И ОБЪЕКТОВ ===
const outdoorBuildings = [
    { id: 'house1', x: 50, y: 50, w: 100, h: 80, color: '#795548', doorX: 90, doorY: 130, interiorMap: 'house1' },
    { id: 'house2', x: 400, y: 100, w: 120, h: 90, color: '#a1887f', doorX: 450, doorY: 190, interiorMap: 'house2' },
    { id: 'house3', x: 200, y: 350, w: 110, h: 90, color: '#2196f3', doorX: 245, doorY: 440, interiorMap: 'house3' }
];

const outdoorVeggies = [];

function spawnVeg(array, x, y) {
    array.push({ x, y, size: 15, active: true, lastGathered: 0 });
}

function spawnOutdoorVeg() {
    outdoorVeggies.length = 0;
    spawnVeg(outdoorVeggies, 200, 100);
    spawnVeg(outdoorVeggies, 230, 100);
    spawnVeg(outdoorVeggies, 200, 130);
    spawnVeg(outdoorVeggies, 230, 130);
    spawnVeg(outdoorVeggies, 450, 350);
    spawnVeg(outdoorVeggies, 480, 350);
}

spawnOutdoorVeg();

// === ТОРГОВЕЦ ===
const trader = {
    x: 500, y: 200,
    size: 30,
    name: "Торговец",
    msg: "Привет! Обменяю 5 морковок на 1 монету!",
    isTrader: true
};

// === NPC НА УЛИЦЕ ===
const outdoorNpcs = [
    { x: 170, y: 80, size: 30, name: "Староста", msg: "Прекрасный день для фермерства, не так ли?", clothesColor: '#1565c0' },
    { x: 350, y: 400, size: 30, name: "Сосед", msg: "Мои морковки растут быстрее твоих!", clothesColor: '#1565c0' },
    trader,
    { x: 100, y: 250, size: 30, name: "Тёмный странник", msg: "Я пришёл из далёких земель...", clothesColor: '#000000' },
    { x: 500, y: 350, size: 30, name: "Ночной охотник", msg: "Осторожно в лесу после заката.", clothesColor: '#1a1a1a', isHunter: true },
    { x: 250, y: 450, size: 30, name: "Теневой торговец", msg: "У меня есть редкие товары...", clothesColor: '#0d0d0d' }
];

// === ИНТЕРЬЕРЫ ДОМОВ ===
const house1Furniture = [
    { x: 20, y: 20, w: 150, h: 20, color: '#5d4037' },
    { x: 400, y: 300, w: 40, h: 60, color: '#3e2723' }
];

const house1Npcs = [
    { x: 250, y: 250, size: 30, name: "Староста (дома)", msg: "Заходи, заходи! У меня есть отличные семена." }
];

const house1Exit = { x: 280, y: 460, w: 40, h: 20, targetMap: 'outdoor', targetX: 90, targetY: 160 };

const house2Furniture = [
    { x: 100, y: 100, w: 200, h: 20, color: '#8d6e63' },
    { x: 50, y: 300, w: 60, h: 60, color: '#4e342e' }
];

const house2Npcs = [
    { x: 300, y: 200, size: 30, name: "Сосед (дома)", msg: "Тишина... самое то для отдыха." }
];

const house2Exit = { x: 280, y: 460, w: 40, h: 20, targetMap: 'outdoor', targetX: 450, targetY: 220 };

// === ИНТЕРЬЕР СИНЕГО ДОМА (HOUSE3) ===
const house3Furniture = [];
const house3Npcs = [];
const house3Exit = { x: 280, y: 460, w: 40, h: 20, targetMap: 'outdoor', targetX: 245, targetY: 470 };

const house3Chest = {
    x: 300, y: 200, w: 40, h: 30, color: '#5d4037',
    storedCarrots: 0,
    showCounterUntil: 0
};

// === ЗОНЫ ДЛЯ ВЫХОДА ИЗ ДЕРЕВНИ ===
const villageExit = {
    x: 280, y: 10, w: 40, h: 30,
    targetMap: 'forest',
    targetX: 300, targetY: 450
};

const forestReturn = {
    x: 280, y: 450, w: 40, h: 30,
    targetMap: 'outdoor',
    targetX: 300, targetY: 50
};

// === ОБРАБОТЧИКИ СОБЫТИЙ (INPUT) ===
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

// === АТАКА ПО ПРОБЕЛУ ===
window.addEventListener('keydown', e => {
    if (e.code === 'Space' && !isTransitioning && !isTrading && player.hasSword && currentMap === 'outdoor' && isNight) {
        if (!isAttacking) {
            isAttacking = true;
            attackTimer = Date.now();
            for (let i = wolves.length - 1; i >= 0; i--) {
                let wolf = wolves[i];
                let dist = Math.hypot((player.x + 15) - (wolf.x + 12), (player.y + 15) - (wolf.y + 12));
                if (dist < ATTACK_RANGE) {
                    wolves.splice(i, 1);
                    wolvesKilledTotal++;
                    if (wolvesKilledTotal % 5 === 0) {
                        wolfSkins++;
                        if (skinCountEl) skinCountEl.textContent = wolfSkins;
                        console.log("Выпала шкура волка!");
                    }
                    console.log("Волк повержен!");
                }
            }
        }
    }
});

// === ЛОГИКА СБОРА МОРКОВИ (ПКМ) И ЗАБРАТЬ ИЗ СУНДУКА ===
canvas.oncontextmenu = (e) => {
    e.preventDefault();
    if (isTransitioning || isTrading) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    if (currentMap === 'house3') {
        if (clickX >= house3Chest.x && clickX <= house3Chest.x + house3Chest.w &&
            clickY >= house3Chest.y && clickY <= house3Chest.y + house3Chest.h) {
            if (house3Chest.storedCarrots > 0 && carrotsCollected < 10) {
                let amount = 1;
                if (!e.shiftKey) {
                    let space = 10 - carrotsCollected;
                    amount = Math.min(space, house3Chest.storedCarrots);
                } else {
                    amount = Math.min(1, house3Chest.storedCarrots);
                    if (carrotsCollected + amount > 10) amount = 0;
                }
                if (amount > 0) {
                    house3Chest.storedCarrots -= amount;
                    carrotsCollected += amount;
                    carrotCountEl.textContent = carrotsCollected;
                    house3Chest.showCounterUntil = Date.now() + 2000;
                    console.log(`Взято ${amount} морковок из сундука.`);
                    saveGame();
                }
            } else if (carrotsCollected >= 10) {
                console.log("Инвентарь полон!");
            }
            return;
        }
    }
    
    let veggiesToCheck = (currentMap === 'outdoor') ? outdoorVeggies : [];
    veggiesToCheck.forEach(v => {
        if (v.active) {
            let dist = Math.hypot((player.x + 15) - (v.x + 7), (player.y + 15) - (v.y + 7));
            if (dist < 40) {
                if (carrotsCollected < 10) {
                    v.active = false;
                    v.lastGathered = Date.now();
                    carrotsCollected++;
                    carrotCountEl.textContent = carrotsCollected;
                    saveGame();
                } else {
                    console.log("Инвентарь полон!");
                }
            }
        }
    });
};

// === ОБРАБОТКА КЛИКА ЛКМ (ДЛЯ СУНДУКА - СОХРАНЕНИЕ) ===
canvas.addEventListener('click', (e) => {
    if (isTransitioning || isTrading) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    if (currentMap === 'house3') {
        if (clickX >= house3Chest.x && clickX <= house3Chest.x + house3Chest.w &&
            clickY >= house3Chest.y && clickY <= house3Chest.y + house3Chest.h) {
            let amountToStore = carrotsCollected;
            if (e.shiftKey) {
                if (carrotsCollected > 0) {
                    amountToStore = 1;
                } else {
                    amountToStore = 0;
                }
            }
            if (amountToStore > 0) {
                house3Chest.storedCarrots += amountToStore;
                carrotsCollected -= amountToStore;
                carrotCountEl.textContent = carrotsCollected;
                house3Chest.showCounterUntil = Date.now() + 2000;
                console.log(`Сохранено ${amountToStore} морковок в сундук.`);
                saveGame();
            }
        }
    }
});

// === ОБРАБОТКА КЛИКОВ В МЕНЮ ТОРГОВЛИ ===
function closeTradeMenu() {
    if (tradeMenu) tradeMenu.style.display = 'none';
    isTrading = false;
}

// === ФУНКЦИЯ ИЗМЕНЕНИЯ ЦВЕТА ОДЕЖДЫ ===
function changeSkinColor(color) {
    playerClothesColor = color;
    saveGame();
    console.log(`Цвет одежды изменён на: ${color}`);
}

// === ФУНКЦИЯ ЗАКРЫТИЯ МЕНЮ СКИНОВ ===
function closeSkinMenu() {
    if (skinMenu) skinMenu.style.display = 'none';
    isSkinMenuOpen = false;
}

// === НОВАЯ ФУНКЦИЯ: ПОКУПКА ДОСПЕХА ===
function buyArmor() {
    if (coinsCollected >= 5 && wolfSkins >= 3 && !player.hasArmor) {
        coinsCollected -= 5;
        wolfSkins -= 3;
        player.hasArmor = true;
        coinCountEl.textContent = coinsCollected;
        if (skinCountEl) skinCountEl.textContent = wolfSkins;
        alert("Доспех куплен! Здоровье увеличено до 20.");
        closeTradeMenu();
        saveGame();
    } else {
        if (player.hasArmor) {
            alert("У вас уже есть доспех!");
        } else {
            alert("Недостаточно ресурсов! Нужно 5 монет и 3 шкуры.");
        }
    }
}

// === ОБМЕН МОРКОВИ НА МОНЕТЫ ===
function exchangeCarrots() {
    if (tradeMode === 'carrots') {
        if (carrotsCollected >= 5) {
            carrotsCollected -= 5;
            coinsCollected += 1;
            carrotCountEl.textContent = carrotsCollected;
            coinCountEl.textContent = coinsCollected;
            console.log("Обменяно 5 морковок на 1 монету!");
            saveGame();
        } else {
            console.log("Недостаточно морковок!");
            alert("Нужно минимум 5 морковок!");
        }
    } else if (tradeMode === 'sword') {
        if (coinsCollected >= 10) {
            if (!player.hasSword) {
                coinsCollected -= 10;
                player.hasSword = true;
                coinCountEl.textContent = coinsCollected;
                console.log("Куплен меч!");
                closeTradeMenu();
                saveGame();
            } else {
                alert("У вас уже есть меч!");
            }
        } else {
            console.log("Недостаточно монет!");
            alert("Нужно минимум 10 монет!");
        }
    }
}

// === НОВАЯ ФУНКЦИЯ: ОБМЕН ШКУР НА МОНЕТЫ ===
function exchangeSkins() {
    if (tradeMode === 'skins') {
        if (wolfSkins >= 1) {
            wolfSkins -= 1;
            coinsCollected += 5;
            if (skinCountEl) skinCountEl.textContent = wolfSkins;
            coinCountEl.textContent = coinsCollected;
            console.log("Обменяно 1 шкура на 5 монет!");
            saveGame();
        } else {
            console.log("Недостаточно шкур!");
            alert("Нужно минимум 1 шкура волка!");
        }
    }
}

// === НОВАЯ ФУНКЦИЯ: ПОКУПКА МЕЧА У НОЧНОГО ОХОТНИКА ===
function buySwordFromHunter() {
    if (coinsCollected >= 10 && !player.hasSword) {
        coinsCollected -= 10;
        player.hasSword = true;
        coinCountEl.textContent = coinsCollected;
        alert("Меч куплен у Ночного охотника! Теперь вы можете сражаться с волками (Пробел ночью).");
        closeTradeMenu();
        saveGame();
    } else {
        if (player.hasSword) {
            alert("У вас уже есть меч!");
        } else {
            alert("Недостаточно монет! Нужно 10 монет.");
        }
    }
}

// === ОБНОВЛЕНИЕ МЕНЮ ТОРГОВЛИ ===
function updateTradeMenuUI() {
    if (!tradeMenu) return;
    if (tradeMode === 'carrots') {
        tradeMenu.innerHTML = `<h3>🏪 Лавка Торговца</h3> Курс: 5 🥕 = 1 🪙<br> У вас: <span id="carrotCount">${carrotsCollected}</span> 🥕<br>` +
            `<button onclick="exchangeCarrots()">Обменять</button><br>` +
            `<button onclick="buyArmor()">Купить доспех (5🪙+3🐺)</button>` +
            `<button onclick="closeTradeMenu()">Закрыть (Q)</button>`;
    } else if (tradeMode === 'sword') {
        tradeMenu.innerHTML = `<h3>🏪 Лавка Охотника</h3> Курс: 10 🪙 = 🗡️<br> У вас: <span id="coinCount">${coinsCollected}</span> 🪙<br>` +
            `<button onclick="exchangeCarrots()">Купить меч</button>` +
            `<button onclick="closeTradeMenu()">Закрыть (Q)</button>`;
    } else if (tradeMode === 'skins') {
        tradeMenu.innerHTML = `<h3>🏪 Лавка Ночного охотника</h3>` +
            `Курс: 1 🐺 = 5 🪙 | ️ = 10 <br>` +
            `У вас: <span id="skinCount">${wolfSkins}</span> 🐺 | <span id="coinCount">${coinsCollected}</span> 🪙<br>` +
            `<button onclick="exchangeSkins()">Обменять шкуру</button>` +
            `<button onclick="buySwordFromHunter()">Купить меч (10🪙)</button>` +
            `<button onclick="closeTradeMenu()">Закрыть (Q)</button>`;
    }
}

// === ОБРАБОТКА ДЕЙСТВИЙ ПО КЛАВИШЕ 'Q' (ТОРГОВЛЯ), 'I' (СКИНЫ) И 'E' (ДВЕРИ/NPC) ===
window.addEventListener('keypress', e => {
    // === ТОРГОВЛЯ ПО КЛАВИШЕ 'Q' ===
    if (e.code === 'KeyQ' && !isTransitioning) {
        if (currentMap === 'outdoor' && !isTrading) {
            let distTrader = Math.hypot((player.x + 15) - (trader.x + 15), (player.y + 15) - (trader.y + 15));
            let hunter = outdoorNpcs.find(n => n.isHunter);
            let distHunter = hunter ? Math.hypot((player.x + 15) - (hunter.x + 15), (player.y + 15) - (hunter.y + 15)) : 999;
            if (distTrader < 50) {
                tradeMode = 'carrots';
                updateTradeMenuUI();
                if (tradeMenu) tradeMenu.style.display = 'block';
                isTrading = true;
                return;
            } else if (distHunter < 50) {
                tradeMode = 'skins';
                updateTradeMenuUI();
                if (tradeMenu) tradeMenu.style.display = 'block';
                isTrading = true;
                return;
            }
        }
        if (isTrading) {
            closeTradeMenu();
            return;
        }
    }
    
    // === МЕНЮ СКИНОВ ПО КЛАВИШЕ 'I' ===
    if (e.code === 'KeyI' && !isTransitioning && !isTrading) {
        if (!isSkinMenuOpen) {
            if (skinMenu) {
                skinMenu.style.display = 'block';
                isSkinMenuOpen = true;
            }
        } else {
            closeSkinMenu();
        }
        return;
    }
    
    // === ОСТАЛЬНЫЕ ДЕЙСТВИЯ (ДВЕРИ, NPC) ПО КЛАВИШЕ 'E' ===
    if (e.code === 'KeyE' && !isTransitioning && !isTrading) {
        let actionTaken = false;
        if (currentMap === 'outdoor' && checkRectCollision(player, villageExit)) {
            switchMap(villageExit.targetMap, villageExit.targetX, villageExit.targetY);
            actionTaken = true;
        }
        else if (currentMap === 'forest' && checkRectCollision(player, forestReturn)) {
            switchMap(forestReturn.targetMap, forestReturn.targetX, forestReturn.targetY);
            actionTaken = true;
        }
        else if (currentMap === 'house1' && checkRectCollision(player, house1Exit)) {
            switchMap(house1Exit.targetMap, house1Exit.targetX, house1Exit.targetY);
            actionTaken = true;
        } else if (currentMap === 'house2' && checkRectCollision(player, house2Exit)) {
            switchMap(house2Exit.targetMap, house2Exit.targetX, house2Exit.targetY);
            actionTaken = true;
        } else if (currentMap === 'house3' && checkRectCollision(player, house3Exit)) {
            switchMap(house3Exit.targetMap, house3Exit.targetX, house3Exit.targetY);
            actionTaken = true;
        }
        else if (!actionTaken && currentMap === 'outdoor') {
            outdoorBuildings.forEach(b => {
                let doorZone = { x: b.doorX - 20, y: b.doorY - 20, w: 40, h: 40 };
                if (checkRectCollision(player, doorZone)) {
                    switchMap(b.interiorMap, 280, 250);
                    actionTaken = true;
                }
            });
        }
        if (!actionTaken) {
            let talking = false;
            let npcsToCheck = (currentMap === 'outdoor') ? outdoorNpcs.filter(n => !n.isTrader && !n.isHunter) :
                (currentMap === 'house1') ? house1Npcs :
                (currentMap === 'house2') ? house2Npcs : house3Npcs;
            npcsToCheck.forEach(npc => {
                let dist = Math.hypot((player.x + 15) - (npc.x + 15), (player.y + 15) - (npc.y + 15));
                if (dist < 50) {
                    dialogBox.style.display = 'block';
                    dialogBox.innerHTML = `<strong>${npc.name}: </strong> ${npc.msg}`;
                    talking = true;
                }
            });
            if (!talking) dialogBox.style.display = 'none';
        }
    }
});

// === ФУНКЦИИ ИГРЫ ===
function switchMap(newMap, newX, newY) {
    isTransitioning = true;
    transitionOverlay.style.opacity = 1;
    setTimeout(() => {
        currentMap = newMap;
        player.x = newX;
        player.y = newY;
        dialogBox.style.display = 'none';
        closeTradeMenu();
        closeSkinMenu();
        transitionOverlay.style.opacity = 0;
        setTimeout(() => { isTransitioning = false; }, 900);
    }, 900);
}

function checkRectCollision(rect1, rect2) {
    return (rect1.x < rect2.x + (rect2.w || rect2.size) &&
        rect1.x + rect1.size > rect2.x &&
        rect1.y < rect2.y + (rect2.h || rect2.size) &&
        rect1.y + rect1.size > rect2.y);
}

function checkCollision(nx, ny) {
    if (isTrading || isSkinMenuOpen) return false;
    let obstacles = [];
    if (currentMap === 'outdoor') {
        outdoorBuildings.forEach(b => {
            obstacles.push({ x: b.x, y: b.y, w: b.w, h: b.h });
        });
        if (nx < 0 || nx + player.size > canvas.width || ny + player.size > canvas.height) return true;
        if (ny < 0) return true;
    }
    else if (currentMap === 'house1') {
        obstacles = [...house1Furniture];
        obstacles.push({ x: 0, y: 0, w: 600, h: 20 });
        obstacles.push({ x: 0, y: 480, w: 600, h: 20 });
        obstacles.push({ x: 0, y: 0, w: 20, h: 500 });
        obstacles.push({ x: 580, y: 0, w: 20, h: 500 });
    }
    else if (currentMap === 'house2') {
        obstacles = [...house2Furniture];
        obstacles.push({ x: 0, y: 0, w: 600, h: 20 });
        obstacles.push({ x: 0, y: 480, w: 600, h: 20 });
        obstacles.push({ x: 0, y: 0, w: 20, h: 500 });
        obstacles.push({ x: 580, y: 0, w: 20, h: 500 });
    }
    else if (currentMap === 'house3') {
        obstacles.push({ x: house3Chest.x, y: house3Chest.y, w: house3Chest.w, h: house3Chest.h });
        obstacles.push({ x: 0, y: 0, w: 600, h: 20 });
        obstacles.push({ x: 0, y: 480, w: 600, h: 20 });
        obstacles.push({ x: 0, y: 0, w: 20, h: 500 });
        obstacles.push({ x: 580, y: 0, w: 20, h: 500 });
    }
    else if (currentMap === 'forest') {
        if (nx < 0 || nx + player.size > canvas.width || ny < 0 || ny + player.size > canvas.height) return true;
    }
    for (let obs of obstacles) {
        if (nx < obs.x + obs.w && nx + player.size > obs.x &&
            ny < obs.y + obs.h && ny + player.size > obs.y) {
            if (currentMap !== 'outdoor') {
                let exitZone = (currentMap === 'house1') ? house1Exit :
                    (currentMap === 'house2') ? house2Exit : house3Exit;
                if (checkRectCollision({ x: nx, y: ny, size: player.size }, exitZone)) {
                    continue;
                }
            }
            return true;
        }
    }
    return false;
}

// === ФУНКЦИЯ СОЗДАНИЯ ВОЛКА ===
function spawnWolf() {
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
    wolves.push({
        x: x,
        y: y,
        size: WOLF_SIZE,
        speed: WOLF_SPEED,
        lastAttack: 0
    });
}

// === ФУНКЦИЯ АТАКИ ВОЛКА ===
function wolfAttack() {
    if (Date.now() - lastWolfAttack < WOLF_ATTACK_COOLDOWN) return;
    wolves.forEach(wolf => {
        const dist = Math.hypot((player.x + 15) - (wolf.x + 12), (player.y + 15) - (wolf.y + 12));
        if (dist < 30) {
            playerHits++;
            lastWolfAttack = Date.now();
            wolf.lastAttack = Date.now();
            transitionOverlay.style.background = 'rgba(255, 0, 0, 0.3)';
            transitionOverlay.style.opacity = 0.5;
            setTimeout(() => {
                transitionOverlay.style.opacity = 0;
                transitionOverlay.style.background = 'black';
            }, 200);
            if (playerHits >= getMaxHealth()) {
                playerHits = 0;
                wolves = [];
                switchMap('house3', 280, 250);
                console.log("Игрок побеждён! Возрождение в синем доме.");
            }
            console.log(`Удар! Получено урона: ${playerHits}/${getMaxHealth()}`);
        }
    });
}

// === ОБНОВЛЕНИЕ ВОЛКОВ ===
function updateWolves() {
    if (!isNight || currentMap !== 'outdoor') {
        wolves = [];
        return;
    }
    if (Date.now() - lastWolfSpawn > WOLF_SPAWN_INTERVAL) {
        spawnWolf();
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
    wolfAttack();
}

// === ОТРИСОВКА ВОЛКОВ ===
function drawWolves() {
    if (currentMap !== 'outdoor') return;
    wolves.forEach(wolf => {
        ctx.fillStyle = '#424242';
        ctx.fillRect(wolf.x, wolf.y, wolf.size, wolf.size);
        ctx.fillStyle = '#424242';
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
        ctx.fillStyle = '#ff0000';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff0000';
        ctx.fillRect(wolf.x + 5, wolf.y + 8, 4, 4);
        ctx.fillRect(wolf.x + wolf.size - 9, wolf.y + 8, 4, 4);
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#000000';
        ctx.fillRect(wolf.x + wolf.size / 2 - 3, wolf.y + 15, 6, 4);
    });
}

// === ОТРИСОВКА СЧЁТЧИКА УДАРОВ ===
function drawHitCounter() {
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

// === ФУНКЦИЯ СОХРАНЕНИЯ ===
function saveGame() {
    const saveData = {
        carrots: carrotsCollected,
        coins: coinsCollected,
        skins: wolfSkins,
        hasSword: player.hasSword,
        hasArmor: player.hasArmor,
        clothesColor: playerClothesColor,
        x: player.x,
        y: player.y,
        map: currentMap
    };
    localStorage.setItem('rpgSave', JSON.stringify(saveData));
}

// === ЗАГРУЗКА СОХРАНЕНИЯ ===
function loadGame() {
    const saveData = localStorage.getItem('rpgSave');
    if (saveData) {
        const data = JSON.parse(saveData);
        carrotsCollected = data.carrots || 0;
        coinsCollected = data.coins || 0;
        wolfSkins = data.skins || 0;
        player.hasSword = data.hasSword || false;
        player.hasArmor = data.hasArmor || false;
        playerClothesColor = data.clothesColor || '#1565c0';
        player.x = data.x || 300;
        player.y = data.y || 300;
        currentMap = data.map || 'outdoor';
        if (carrotCountEl) carrotCountEl.textContent = carrotsCollected;
        if (coinCountEl) coinCountEl.textContent = coinsCollected;
        if (skinCountEl) skinCountEl.textContent = wolfSkins;
    }
}

loadGame();

function update() {
    if (isTransitioning || isTrading || isSkinMenuOpen) return;
    if (Date.now() - lastTimeSwitch > DAY_DURATION) {
        isNight = !isNight;
        lastTimeSwitch = Date.now();
        if (!isNight) {
            wolves = [];
            playerHits = 0;
        }
    }
    if (isAttacking) {
        if (Date.now() - attackTimer > ATTACK_DURATION) {
            isAttacking = false;
        }
    }
    let nextX = player.x;
    let nextY = player.y;
    if (keys['KeyW']) nextY -= player.speed;
    if (keys['KeyS']) nextY += player.speed;
    if (keys['KeyA']) nextX -= player.speed;
    if (keys['KeyD']) nextX += player.speed;
    if (!checkCollision(nextX, player.y)) player.x = nextX;
    if (!checkCollision(player.x, nextY)) player.y = nextY;
    if (currentMap === 'outdoor') {
        outdoorVeggies.forEach(v => {
            if (!v.active && Date.now() - v.lastGathered > 5000) {
                v.active = true;
            }
        });
    }
    updateWolves();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (currentMap === 'outdoor') {
        outdoorBuildings.forEach(b => {
            ctx.fillStyle = b.color;
            ctx.fillRect(b.x, b.y, b.w, b.h);
            ctx.fillStyle = '#3e2723';
            ctx.beginPath();
            ctx.moveTo(b.x - 10, b.y);
            ctx.lineTo(b.x + b.w / 2, b.y - 20);
            ctx.lineTo(b.x + b.w + 10, b.y);
            ctx.fill();
            ctx.fillStyle = isNight ? '#554400' : '#ffeb3b';
            ctx.fillRect(b.x + 15, b.y + 20, 20, 20);
            ctx.fillStyle = '#4e342e';
            ctx.fillRect(b.doorX - 10, b.doorY - 10, 20, 30);
        });
        outdoorVeggies.forEach(v => {
            if (v.active) {
                ctx.fillStyle = 'orange';
                ctx.fillRect(v.x, v.y, v.size, v.size);
                ctx.fillStyle = 'green';
                ctx.fillRect(v.x + 5, v.y - 5, 5, 7);
            }
        });
        outdoorNpcs.forEach(npc => {
            if (npc.isTrader) {
                drawTrader(npc);
            } else {
                drawNpc(npc);
            }
        });
        drawWolves();
        ctx.fillStyle = '#5d4037';
        ctx.fillRect(villageExit.x, villageExit.y, villageExit.w, villageExit.h);
        ctx.fillStyle = '#fff';
        ctx.font = '10px Courier New';
        ctx.fillText("ВЫХОД", villageExit.x + 2, villageExit.y - 5);
    }
    else if (currentMap === 'forest') {
        ctx.fillStyle = isNight ? '#051406' : '#1b5e20';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = isNight ? '#020a03' : '#0d330e';
        ctx.beginPath();
        ctx.moveTo(100, 100); ctx.lineTo(120, 50); ctx.lineTo(140, 100); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(450, 150); ctx.lineTo(480, 80); ctx.lineTo(510, 150); ctx.fill();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(forestReturn.x, forestReturn.y, forestReturn.w, forestReturn.h);
        ctx.fillStyle = '#fff';
        ctx.font = '12px Courier New';
        ctx.fillText("В ДЕРЕВНЮ", forestReturn.x - 5, forestReturn.y - 5);
    }
    else if (currentMap === 'house1' || currentMap === 'house2' || currentMap === 'house3') {
        ctx.fillStyle = '#d7ccc8';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        let furniture = (currentMap === 'house1') ? house1Furniture :
            (currentMap === 'house2') ? house2Furniture : house3Furniture;
        furniture.forEach(f => {
            ctx.fillStyle = f.color;
            ctx.fillRect(f.x, f.y, f.w, f.h);
            ctx.strokeStyle = '#3e2723';
            ctx.strokeRect(f.x, f.y, f.w, f.h);
        });
        if (currentMap === 'house3') {
            ctx.fillStyle = house3Chest.color;
            ctx.fillRect(house3Chest.x, house3Chest.y, house3Chest.w, house3Chest.h);
            ctx.strokeStyle = '#3e2723';
            ctx.strokeRect(house3Chest.x, house3Chest.y, house3Chest.w, house3Chest.h);
            if (Date.now() < house3Chest.showCounterUntil) {
                ctx.fillStyle = 'white';
                ctx.font = 'bold 16px Courier New';
                ctx.fillText(house3Chest.storedCarrots, house3Chest.x + 10, house3Chest.y - 10);
            }
        }
        let exitZone = (currentMap === 'house1') ? house1Exit :
            (currentMap === 'house2') ? house2Exit : house3Exit;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(exitZone.x, exitZone.y, exitZone.w, exitZone.h);
        ctx.fillStyle = '#fff';
        ctx.font = '12px Courier New';
        ctx.fillText("ВЫХОД", exitZone.x + 2, exitZone.y - 5);
        let indoorNpcs = (currentMap === 'house1') ? house1Npcs :
            (currentMap === 'house2') ? house2Npcs : house3Npcs;
        indoorNpcs.forEach(npc => drawNpc(npc));
    }
    if (isNight && currentMap === 'outdoor') {
        ctx.fillStyle = 'rgba(0, 0, 30, 0.65)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        outdoorBuildings.forEach(b => {
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#ffd54f";
            ctx.fillStyle = '#fff59d';
            ctx.fillRect(b.x + 15, b.y + 20, 20, 20);
            ctx.shadowBlur = 0;
        });
    }
    drawHitCounter();
    ctx.fillStyle = isNight ? '#aaa' : '#fff';
    ctx.font = 'bold 14px Courier New';
    ctx.fillText(isNight ? "Ночь" : "День", 10, 40);
    drawPlayer();
}

function drawTrader(npc) {
    ctx.fillStyle = '#ffd54f';
    ctx.fillRect(npc.x, npc.y, npc.size, npc.size);
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(npc.x, npc.y + 15, npc.size, 15);
    ctx.fillStyle = 'black';
    ctx.fillRect(npc.x + 5, npc.y + 8, 4, 4);
    ctx.fillRect(npc.x + 20, npc.y + 8, 4, 4);
    ctx.fillStyle = '#ffb300';
    ctx.fillRect(npc.x - 5, npc.y + 10, 8, 10);
}

function drawNpc(npc) {
    ctx.fillStyle = '#ffcc80';
    ctx.fillRect(npc.x, npc.y, npc.size, npc.size);
    ctx.fillStyle = npc.clothesColor || '#1565c0';
    ctx.fillRect(npc.x, npc.y + 15, npc.size, 15);
    ctx.fillStyle = 'black';
    ctx.fillRect(npc.x + 5, npc.y + 8, 4, 4);
    ctx.fillRect(npc.x + 20, npc.y + 8, 4, 4);
}

function drawPlayer() {
    ctx.fillStyle = '#ffcc80';
    ctx.fillRect(player.x, player.y, player.size, player.size);
    ctx.fillStyle = playerClothesColor;
    ctx.fillRect(player.x, player.y + 15, player.size, 15);
    ctx.fillStyle = '#ffd54f';
    ctx.fillRect(player.x - 5, player.y, player.size + 10, 5);
    ctx.fillStyle = 'black';
    if (keys['KeyA']) {
        ctx.fillRect(player.x + 5, player.y + 8, 4, 4);
    } else if (keys['KeyD']) {
        ctx.fillRect(player.x + 20, player.y + 8, 4, 4);
    } else {
        ctx.fillRect(player.x + 5, player.y + 8, 4, 4);
        ctx.fillRect(player.x + 20, player.y + 8, 4, 4);
    }
    if (player.hasSword) {
        ctx.fillStyle = '#c0c0c0';
        let swordX = player.x + player.size;
        let swordY = player.y + 15;
        if (isAttacking) {
            ctx.fillRect(swordX, swordY, 25, 4);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fillRect(swordX + 10, swordY - 5, 15, 14);
        } else {
            ctx.fillRect(swordX, swordY, 15, 4);
        }
    }
    if (player.hasArmor) {
        ctx.strokeStyle = '#0000ff';
        ctx.lineWidth = 2;
        ctx.strokeRect(player.x - 2, player.y - 2, player.size + 4, player.size + 4);
        ctx.lineWidth = 1;
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();