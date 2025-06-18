// Sistema de tiles para el juego de laberinto
class TileSystem {
    constructor() {
        this.tileSize = 16;
        this.tileset = null;
        this.createTileset();
    }
    
    // Crear tileset procedural
    createTileset() {
        const canvas = document.createElement('canvas');
        canvas.width = 64; // 4 tiles de 16x16
        canvas.height = 16; // 1 fila
        const ctx = canvas.getContext('2d');
        
        // Tile 0: Suelo (gris oscuro)
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(0, 0, 16, 16);
        ctx.fillStyle = '#34495e';
        ctx.fillRect(2, 2, 12, 12);
        
        // Tile 1: Pared (naranja/marrón)
        ctx.fillStyle = '#d35400';
        ctx.fillRect(16, 0, 16, 16);
        ctx.fillStyle = '#e67e22';
        ctx.fillRect(18, 2, 12, 12);
        // Añadir textura de ladrillos
        ctx.strokeStyle = '#c0392b';
        ctx.lineWidth = 1;
        ctx.strokeRect(17, 1, 14, 14);
        ctx.strokeRect(17, 8, 14, 1);
        ctx.strokeRect(24, 1, 1, 7);
        ctx.strokeRect(24, 9, 1, 6);
        
        // Tile 2: Jugador (azul)
        ctx.fillStyle = '#3498db';
        ctx.fillRect(32, 0, 16, 16);
        ctx.fillStyle = '#2980b9';
        ctx.fillRect(34, 2, 12, 12);
        // Añadir detalles
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(36, 4, 3, 3); // Ojo izquierdo
        ctx.fillRect(41, 4, 3, 3); // Ojo derecho
        ctx.fillRect(37, 10, 6, 2); // Sonrisa
        
        // Tile 3: Meta (verde)
        ctx.fillStyle = '#27ae60';
        ctx.fillRect(48, 0, 16, 16);
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(50, 2, 12, 12);
        // Añadir estrella
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        const centerX = 56, centerY = 8;
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const x = centerX + Math.cos(angle) * 4;
            const y = centerY + Math.sin(angle) * 4;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        
        this.tileset = canvas;
    }
    
    // Dibujar tile específico
    drawTile(ctx, tileIndex, x, y, size = this.tileSize) {
        if (!this.tileset) return;
        
        const sourceX = tileIndex * this.tileSize;
        const sourceY = 0;
        
        ctx.drawImage(
            this.tileset,
            sourceX, sourceY, this.tileSize, this.tileSize,
            x, y, size, size
        );
    }
    
    // Dibujar tile con rotación
    drawTileRotated(ctx, tileIndex, x, y, rotation = 0, size = this.tileSize) {
        if (!this.tileset) return;
        
        ctx.save();
        ctx.translate(x + size/2, y + size/2);
        ctx.rotate(rotation);
        
        const sourceX = tileIndex * this.tileSize;
        const sourceY = 0;
        
        ctx.drawImage(
            this.tileset,
            sourceX, sourceY, this.tileSize, this.tileSize,
            -size/2, -size/2, size, size
        );
        
        ctx.restore();
    }
    
    // Crear tile de enemigo dinámicamente
    createEnemyTile(frozen = false) {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        
        if (frozen) {
            // Enemigo congelado (azul claro)
            ctx.fillStyle = '#87ceeb';
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = '#4682b4';
            ctx.fillRect(2, 2, 12, 12);
            // Cristales de hielo
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(4, 4); ctx.lineTo(12, 12);
            ctx.moveTo(12, 4); ctx.lineTo(4, 12);
            ctx.moveTo(8, 2); ctx.lineTo(8, 14);
            ctx.moveTo(2, 8); ctx.lineTo(14, 8);
            ctx.stroke();
        } else {
            // Enemigo normal (rojo)
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = '#c0392b';
            ctx.fillRect(2, 2, 12, 12);
            // Ojos malvados
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(4, 4, 2, 2);
            ctx.fillRect(10, 4, 2, 2);
            ctx.fillStyle = '#000000';
            ctx.fillRect(4, 4, 1, 1);
            ctx.fillRect(10, 4, 1, 1);
            // Boca
            ctx.fillStyle = '#000000';
            ctx.fillRect(6, 10, 4, 2);
        }
        
        return canvas;
    }
    
    // Crear tile de caja de poder
    createPowerBoxTile(type) {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        
        // Base de la caja
        const baseColor = type === 'snowball' ? '#87ceeb' : '#90ee90';
        const glowColor = type === 'snowball' ? '#00bfff' : '#00ff00';
        
        ctx.fillStyle = '#8b4513'; // Madera
        ctx.fillRect(0, 0, 16, 16);
        ctx.fillStyle = '#a0522d';
        ctx.fillRect(2, 2, 12, 12);
        
        // Contenido brillante
        ctx.fillStyle = baseColor;
        ctx.fillRect(4, 4, 8, 8);
        ctx.fillStyle = glowColor;
        ctx.fillRect(5, 5, 6, 6);
        
        // Símbolo según tipo
        ctx.fillStyle = '#ffffff';
        if (type === 'snowball') {
            // Copo de nieve
            ctx.beginPath();
            ctx.moveTo(8, 6); ctx.lineTo(8, 10);
            ctx.moveTo(6, 8); ctx.lineTo(10, 8);
            ctx.moveTo(7, 7); ctx.lineTo(9, 9);
            ctx.moveTo(9, 7); ctx.lineTo(7, 9);
            ctx.stroke();
        } else if (type === 'ally') {
            // Corazón
            ctx.beginPath();
            ctx.arc(7, 7.5, 1.5, 0, Math.PI, true);
            ctx.arc(9, 7.5, 1.5, 0, Math.PI, true);
            ctx.lineTo(8, 10);
            ctx.closePath();
            ctx.fill();
        }
        
        return canvas;
    }
}

// Instancia global del sistema de tiles
window.tileSystem = new TileSystem(); 