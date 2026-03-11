// === ФУНКЦИИ ОТРИСОВКИ ===
import { gameState, player } from './state.js';
import { outdoorBuildings, outdoorVeggies, outdoorNpcs, villageExit, house1Furniture, house2Furniture, house3Furniture, house3Chest, house1Exit, house2Exit, house3Exit, house1Npcs, house2Npcs, house3Npcs, forestReturn } from './maps.js';
import { wolves } from './enemies.js';
import { drawPlayer } from './player.js';
import { getMaxHealth } from './state.js';

export function drawWolves(ctx) {
    if (gameState.currentMap !== 'outdoor') return;
    wolves.forEach(wolf => {
        ctx.fillStyle = '#424242';
        ctx.fillRect(wolf.x, wolf.y, wolf.size, wolf.size);
        ctx.fillStyle = '#ff0000';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff0000';
        ctx.fillRect(wolf.x + 5, wolf.y + 8, 4, 4);
        ctx.fillRect(wolf.x + wolf.size - 9, wolf.y + 8, 4, 4);
        ctx.shadowBlur = 0;
    });
}

export function drawHitCounter(ctx) {
    if (gameState.playerHits > 0 && gameState.currentMap === 'outdoor' && gameState.isNight) {
        ctx.fillStyle = '#ff0000';
        ctx.font = 'bold 16px Courier New';
        ctx.fillText(`Удары: ${gameState.playerHits}/${getMaxHealth()}`, 480, 40);
        ctx.fillStyle = '#333';
        ctx.fillRect(480, 50, 100, 10);
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(480, 50, 100 * (1 - gameState.playerHits / getMaxHealth()), 10);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(480, 50, 100, 10);
    }
}

export function drawTrader(ctx, npc) {
    ctx.fillStyle = '#ffd54f';
    ctx.fillRect(npc.x, npc.y, npc.size, npc.size);
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(npc.x, npc.y + 15, npc.size, 15);
    ctx.fillStyle = 'black';
    ctx.fillRect(npc.x + 5, npc.y + 8, 4, 4);
    ctx.fillRect(npc.x + 20, npc.y + 8, 4, 4);
}

export function drawNpc(ctx, npc) {
    ctx.fillStyle = '#ffcc80';
    ctx.fillRect(npc.x, npc.y, npc.size, npc.size);
    ctx.fillStyle = npc.clothesColor || '#1565c0';
    ctx.fillRect(npc.x, npc.y + 15, npc.size, 15);
    ctx.fillStyle = 'black';
    ctx.fillRect(npc.x + 5, npc.y + 8, 4, 4);
    ctx.fillRect(npc.x + 20, npc.y + 8, 4, 4);
}

export function draw(ctx) {
    ctx.clearRect(0, 0, 600, 500);
    
    if (gameState.currentMap === 'outdoor') {
        outdoorBuildings.forEach(b => {
            ctx.fillStyle = b.color;
            ctx.fillRect(b.x, b.y, b.w, b.h);
            ctx.fillStyle = '#3e2723';
            ctx.beginPath();
            ctx.moveTo(b.x - 10, b.y);
            ctx.lineTo(b.x + b.w / 2, b.y - 20);
            ctx.lineTo(b.x + b.w + 10, b.y);
            ctx.fill();
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
            if (npc.isTrader) drawTrader(ctx, npc);
            else drawNpc(ctx, npc);
        });
        
        drawWolves(ctx);
        
        ctx.fillStyle = '#5d4037';
        ctx.fillRect(villageExit.x, villageExit.y, villageExit.w, villageExit.h);
        ctx.fillStyle = '#fff';
        ctx.font = '10px Courier New';
        ctx.fillText("ВЫХОД", villageExit.x + 2, villageExit.y - 5);
    }
    else if (gameState.currentMap === 'forest') {
        ctx.fillStyle = gameState.isNight ? '#051406' : '#1b5e20';
        ctx.fillRect(0, 0, 600, 500);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(forestReturn.x, forestReturn.y, forestReturn.w, forestReturn.h);
    }
    else if (['house1', 'house2', 'house3'].includes(gameState.currentMap)) {
        ctx.fillStyle = '#d7ccc8';
        ctx.fillRect(0, 0, 600, 500);
        
        let furniture = gameState.currentMap === 'house1' ? house1Furniture :
                       gameState.currentMap === 'house2' ? house2Furniture : house3Furniture;
        furniture.forEach(f => {
            ctx.fillStyle = f.color;
            ctx.fillRect(f.x, f.y, f.w, f.h);
            ctx.strokeStyle = '#3e2723';
            ctx.strokeRect(f.x, f.y, f.w, f.h);
        });
        
        if (gameState.currentMap === 'house3') {
            ctx.fillStyle = house3Chest.color;
            ctx.fillRect(house3Chest.x, house3Chest.y, house3Chest.w, house3Chest.h);
            ctx.strokeStyle = '#3e2723';
            ctx.strokeRect(house3Chest.x, house3Chest.y, house3Chest.w, house3Chest.h);
        }
    }
    
    if (gameState.isNight && gameState.currentMap === 'outdoor') {
        ctx.fillStyle = 'rgba(0, 0, 30, 0.65)';
        ctx.fillRect(0, 0, 600, 500);
    }
    
    drawHitCounter(ctx);
    ctx.fillStyle = gameState.isNight ? '#aaa' : '#fff';
    ctx.font = 'bold 14px Courier New';
    ctx.fillText(gameState.isNight ? "Ночь" : "День", 10, 40);
    
    drawPlayer(ctx);
}