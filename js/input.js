// === ОБРАБОТКА ВВОДА ===
import { keys, isAttacking, attackTimer } from './player.js';
import { gameState, player, wolfSkins, wolvesKilledTotal } from './state.js';
import { CONFIG } from './config.js';
import { wolves } from './enemies.js';
import { switchMap } from './main.js';
import { closeTradeMenu, updateTradeMenuUI } from './trade.js';
import { checkRectCollision } from './collision.js';
import { outdoorNpcs, villageExit, forestReturn, house1Exit, house2Exit, house3Exit, outdoorBuildings, house1Npcs, house2Npcs, house3Npcs } from './maps.js';

export function initInput(canvas, dialogBox, tradeMenu, skinMenu) {
    window.addEventListener('keydown', e => keys[e.code] = true);
    window.addEventListener('keyup', e => keys[e.code] = false);
    
    // Атака по пробелу
    window.addEventListener('keydown', e => {
        if (e.code === 'Space' && !gameState.isTransitioning && !gameState.isTrading && 
            player.hasSword && gameState.currentMap === 'outdoor' && gameState.isNight) {
            if (!isAttacking) {
                isAttacking = true;
                attackTimer = Date.now();
                for (let i = wolves.length - 1; i >= 0; i--) {
                    let wolf = wolves[i];
                    let dist = Math.hypot((player.x + 15) - (wolf.x + 12), (player.y + 15) - (wolf.y + 12));
                    if (dist < CONFIG.ATTACK_RANGE) {
                        wolves.splice(i, 1);
                        wolvesKilledTotal++;
                        if (wolvesKilledTotal % 5 === 0) {
                            wolfSkins++;
                            console.log("Выпала шкура волка!");
                        }
                    }
                }
            }
        }
    });
    
    // Клавиши Q, I, E
    window.addEventListener('keypress', e => {
        if (e.code === 'KeyQ' && !gameState.isTransitioning) {
            // Торговля
            if (gameState.currentMap === 'outdoor' && !gameState.isTrading) {
                let trader = outdoorNpcs.find(n => n.isTrader);
                let hunter = outdoorNpcs.find(n => n.isHunter);
                let distTrader = trader ? Math.hypot((player.x + 15) - (trader.x + 15), (player.y + 15) - (trader.y + 15)) : 999;
                let distHunter = hunter ? Math.hypot((player.x + 15) - (hunter.x + 15), (player.y + 15) - (hunter.y + 15)) : 999;
                
                if (distTrader < 50) {
                    gameState.tradeMode = 'carrots';
                    updateTradeMenuUI();
                    tradeMenu.style.display = 'block';
                    gameState.isTrading = true;
                    return;
                } else if (distHunter < 50) {
                    gameState.tradeMode = 'skins';
                    updateTradeMenuUI();
                    tradeMenu.style.display = 'block';
                    gameState.isTrading = true;
                    return;
                }
            }
            if (gameState.isTrading) {
                closeTradeMenu();
                return;
            }
        }
        
        if (e.code === 'KeyI' && !gameState.isTransitioning && !gameState.isTrading) {
            if (!gameState.isSkinMenuOpen) {
                skinMenu.style.display = 'block';
                gameState.isSkinMenuOpen = true;
            } else {
                skinMenu.style.display = 'none';
                gameState.isSkinMenuOpen = false;
            }
            return;
        }
        
        if (e.code === 'KeyE' && !gameState.isTransitioning && !gameState.isTrading) {
            // Двери и NPC
            let actionTaken = false;
            if (gameState.currentMap === 'outdoor' && checkRectCollision(player, villageExit)) {
                switchMap(villageExit.targetMap, villageExit.targetX, villageExit.targetY);
                actionTaken = true;
            }
            // ... остальные проверки дверей
            if (!actionTaken) {
                // Диалоги с NPC
                let talking = false;
                let npcsToCheck = gameState.currentMap === 'outdoor' ? 
                    outdoorNpcs.filter(n => !n.isTrader && !n.isHunter) :
                    gameState.currentMap === 'house1' ? house1Npcs :
                    gameState.currentMap === 'house2' ? house2Npcs : house3Npcs;
                
                npcsToCheck.forEach(npc => {
                    let dist = Math.hypot((player.x + 15) - (npc.x + 15), (player.y + 15) - (npc.y + 15));
                    if (dist < 50) {
                        dialogBox.style.display = 'block';
                        dialogBox.innerHTML = `<strong>${npc.name}:</strong> ${npc.msg}`;
                        talking = true;
                    }
                });
                if (!talking) dialogBox.style.display = 'none';
            }
        }
    });
}