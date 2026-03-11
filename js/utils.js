// === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===
export function distance(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
}

export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

export function createCounter(containerId, label, initialValue = 0) {
    const container = document.getElementById(containerId);
    if (!container) return null;
    
    const skinLabel = document.createTextNode(label);
    const countEl = document.createElement('span');
    countEl.textContent = initialValue;
    countEl.style.fontWeight = 'bold';
    
    container.appendChild(skinLabel);
    container.appendChild(countEl);
    
    return countEl;
}