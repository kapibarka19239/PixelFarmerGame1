// === ДЕТЕКЦИЯ КОЛЛИЗИЙ ===
import { gameState, player } from './state.js';
import { outdoorBuildings, house1Furniture, house2Furniture, house3Chest, house1Exit, house2Exit, house3Exit } from './maps.js';

export function checkRectCollision(rect1, rect2) {
    return (rect1.x < rect2.x + (rect2.w || rect2.size) &&
            rect1.x + rect1.size > rect2.x &&
            rect1.y < rect2.y + (rect2.h || rect2.size) &&
            rect1.y + rect1.size > rect2.y);
}

export function checkCollision(nx, ny) {
    if (gameState.isTrading || gameState.isSkinMenuOpen) return false;
    
    let obstacles = [];
    
    if (gameState.currentMap === 'outdoor') {
        outdoorBuildings.forEach(b => {
            obstacles.push({ x: b.x, y: b.y, w: b.w, h: b.h });
        });
        if (nx < 0 || nx + player.size > 600 || ny + player.size > 500) return true;
        if (ny < 0) return true;
    }
    else if (gameState.currentMap === 'house1') {
        obstacles = [...house1Furniture];
        obstacles.push({ x: 0, y: 0, w: 600, h: 20 }, { x: 0, y: 480, w: 600, h: 20 });
        obstacles.push({ x: 0, y: 0, w: 20, h: 500 }, { x: 580, y: 0, w: 20, h: 500 });
    }
    else if (gameState.currentMap === 'house2') {
        obstacles = [...house2Furniture];
        obstacles.push({ x: 0, y: 0, w: 600, h: 20 }, { x: 0, y: 480, w: 600, h: 20 });
        obstacles.push({ x: 0, y: 0, w: 20, h: 500 }, { x: 580, y: 0, w: 20, h: 500 });
    }
    else if (gameState.currentMap === 'house3') {
        obstacles.push({ x: house3Chest.x, y: house3Chest.y, w: house3Chest.w, h: house3Chest.h });
        obstacles.push({ x: 0, y: 0, w: 600, h: 20 }, { x: 0, y: 480, w: 600, h: 20 });
        obstacles.push({ x: 0, y: 0, w: 20, h: 500 }, { x: 580, y: 0, w: 20, h: 500 });
    }
    else if (gameState.currentMap === 'forest') {
        if (nx < 0 || nx + player.size > 600 || ny < 0 || ny + player.size > 500) return true;
    }
    
    for (let obs of obstacles) {
        if (nx < obs.x + obs.w && nx + player.size > obs.x &&
            ny < obs.y + obs.h && ny + player.size > obs.y) {
            if (gameState.currentMap !== 'outdoor') {
                const exitZone = gameState.currentMap === 'house1' ? house1Exit :
                                gameState.currentMap === 'house2' ? house2Exit : house3Exit;
                if (checkRectCollision({ x: nx, y: ny, size: player.size }, exitZone)) {
                    continue;
                }
            }
            return true;
        }
    }
    return false;
}