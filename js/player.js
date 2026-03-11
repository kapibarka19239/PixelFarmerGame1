// === ИГРОК: ДВИЖЕНИЕ И ОТРИСОВКА ===
import { CONFIG } from './config.js';
import { gameState, player } from './state.js';
import { checkCollision } from './collision.js';

export let isAttacking = false;
export let attackTimer = 0;
export const keys = {};

export function updatePlayer() {
    if (gameState.isTransitioning || gameState.isTrading || gameState.isSkinMenuOpen) return;
    
    if (isAttacking && Date.now() - attackTimer > CONFIG.ATTACK_DURATION) {
        isAttacking = false;
    }
    
    let nextX = player.x;
    let nextY = player.y;
    
    if (keys['KeyW']) nextY -= player.speed;
    if (keys['KeyS']) nextY += player.speed;
    if (keys['KeyA']) nextX -= player.speed;
    if (keys['KeyD']) nextX += player.speed;
    
    if (!checkCollision(nextX, player.y)) player.x = nextX;
    if (!checkCollision(player.x, nextY)) player.y = nextY;
}

export function drawPlayer(ctx) {
    ctx.fillStyle = '#ffcc80';
    ctx.fillRect(player.x, player.y, player.size, player.size);
    
    ctx.fillStyle = gameState.playerClothesColor;
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