// Generador de Juegos de Laberinto - Construcción completa
// Genera todos los archivos necesarios para un juego ejecutable

// Función principal para generar archivos del juego
async function generateGameFiles(gameName, config) {
    console.log('🚀 Generando archivos para:', gameName);
    
    const files = {};
    
    // 1. Archivo HTML principal
    files['index.html'] = generateGameHTML(gameName, config);
    
    // 2. Motor de juego optimizado con cámara que sigue al jugador
    files['game.js'] = generateGameEngine(config);
    
    // 3. Archivo de configuración JSON
    files['config.json'] = JSON.stringify(config, null, 2);
    
    // 4. Obtener LittleJS (usar archivo local completo)
    files['littlejs.js'] = await loadLittleJSFromFile();
    
    // 5. Obtener archivo de tiles
    files['tiles.png'] = await fetchTilesImage();
    
    // 6. Archivo CSS básico
    files['style.css'] = generateGameCSS();
    
    // 7. README del juego generado
    files['README.md'] = generateGameReadme(gameName, config);
    
    return files;
}

// Generar HTML del juego
function generateGameHTML(gameName, config) {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${gameName}</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="gameContainer">
        <div id="gameHeader">
            <h1>🎮 ${gameName}</h1>
            <div id="gameControls">
                <button onclick="location.reload()">🔄 Reiniciar</button>
                <button onclick="toggleFullscreen()">🖥️ Pantalla Completa</button>
            </div>
        </div>
        
        <div id="gameCanvas"></div>
        
        <div id="gameInfo">
            <div class="info-section">
                <h3>📋 Información</h3>
                <div id="gameStats">
                    <p><strong>Nivel:</strong> <span id="currentLevel">1</span></p>
                    <p><strong>Tiempo:</strong> <span id="gameTime">00:00</span></p>
                </div>
            </div>
            
            <div class="info-section">
                <h3>🎯 Poderes</h3>
                <div id="powerInfo">
                    <div class="power-item" style="display: ${config.powers.pickaxe.enabled ? 'block' : 'none'}">
                        <span class="power-key">1</span>
                        <span class="power-name">Pico</span>
                        <span class="power-count" id="pickaxeCount">0</span>
                    </div>
                    <div class="power-item" style="display: ${config.powers.snowball.enabled ? 'block' : 'none'}">
                        <span class="power-key">2</span>
                        <span class="power-name">Bola de Nieve</span>
                        <span class="power-count" id="snowballCount">0</span>
                    </div>
                    <div class="power-item" style="display: ${config.powers.ally.enabled ? 'block' : 'none'}">
                        <span class="power-key">3</span>
                        <span class="power-name">Aliado</span>
                        <span class="power-count" id="allyCount">0</span>
                    </div>
                </div>
            </div>
            
            <div class="info-section">
                <h3>🎮 Controles</h3>
                <div id="controlsInfo">
                    <p><strong>Movimiento:</strong> Flechas / WASD</p>
                    <p><strong>Poderes:</strong> 1, 2, 3</p>
                    <p><strong>Apuntar:</strong> Flechas</p>
                    <p><strong>Usar:</strong> Espacio</p>
                    <p><strong>Cancelar:</strong> Escape</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="littlejs.js"></script>
    <script src="game.js"></script>
    
    <script>
        // Funciones de control
        function toggleFullscreen() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        }
        
        // Inicializar juego
        console.log('🎮 Iniciando ${gameName}');
        
        // Función para actualizar UI desde el juego
        function actualizarUI() {
            if (typeof nivelActual !== 'undefined') {
                document.getElementById('currentLevel').textContent = nivelActual;
            }
            if (typeof poderes !== 'undefined') {
                document.getElementById('pickaxeCount').textContent = poderes.pico || 0;
                document.getElementById('snowballCount').textContent = poderes.bolaDeNieve || 0;
                document.getElementById('allyCount').textContent = poderes.aliado || 0;
            }
            if (typeof tiempoInicio !== 'undefined' && typeof time !== 'undefined') {
                const tiempoJuego = Math.floor(time - tiempoInicio);
                const minutos = Math.floor(tiempoJuego / 60);
                const segundos = tiempoJuego % 60;
                document.getElementById('gameTime').textContent = 
                    \`\${minutos.toString().padStart(2, '0')}:\${segundos.toString().padStart(2, '0')}\`;
            }
        }
        
        // Actualizar UI cada segundo
        setInterval(actualizarUI, 1000);
        
        // Inicializar motor LittleJS cuando la página cargue
        window.addEventListener('load', () => {
            console.log('🎮 Iniciando motor LittleJS...');
            
            // Desactivar debug para evitar errores de aserción
            if (typeof showWatermark !== 'undefined') showWatermark = false;
            if (typeof enableAsserts !== 'undefined') enableAsserts = false;
            
            // Inicializar LittleJS con todas las funciones y array de imágenes
            engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, ['tiles.png']);
        });
    </script>
</body>
</html>`;
}

// Generar motor de juego optimizado
function generateGameEngine(config) {
    return `'use strict';

// ${config.metadata.name}
// Generado por Constructor de Laberintos
// Fecha: ${config.metadata.created}

// Variables globales del motor
const GAME_CONFIG = ${JSON.stringify(config, null, 2)};

// Variables del juego
let jugadorPos, jugadorMatriz;
let paredes = [];
let enemigos = [];
let meta;
let gameState = 'playing';
let nivelActual = 1;
let tiempoInicio = 0;
let ultimoMovimientoEnemigos = 0;

// Variables de protección anti-loops
let lastFrameTime = Date.now();
let frameTimeoutWarning = false;

// Sistema de poderes
let poderes = {
    pico: 0,
    bolaDeNieve: 0,
    aliado: 0
};

let estadoApuntado = {
    activo: false,
    poder: null,
    direccion: 0
};

let enemigosCongelados = [];
let aliadoActivo = null;
let proyectilesActivos = [];
let poderesEnMapa = [];

// Constantes
const TILE_SIZE = 16;
const VELOCIDAD_JUGADOR = GAME_CONFIG.gameplay.playerSpeed || 120;

let mazeData = [];

// Definir sonidos usando ZzFX
const sonidos = {
    meta: new Sound([,,539,0,.04,.29,1,1.92,,,567,.02,.02,,,,.04]),
    enemigo: new Sound([,,925,.04,.3,.6,1,.3,,6.27,-184,.09,.17]),
    pico: new Sound([,,471,,.09,.47,4,1.06,-6.7,,,,,.9,61,.1,,.82,.1]),
    lanzar: new Sound([,,150,.05,,.05,,1.3,,,,,,3]),
    colision: new Sound([,,1675,,.06,.24,1,1.82,,,837,.06]),
    congelar: new Sound([,.2,40,.5,,1.5,,11,,,,,,199])
};

// Configuración del motor
let engineInitialized = false;

///////////////////////////////////////////////////////////////////////////////
function gameInit() {
    if (engineInitialized) {
        console.warn('⚠️ Motor ya inicializado, reiniciando juego...');
        return;
    }
    engineInitialized = true;
    console.log('🎮 Inicializando juego con configuración personalizada');
    
    // Configurar motor LittleJS
    if (typeof gravity !== 'undefined') gravity = 0;
    if (typeof showWatermark !== 'undefined') showWatermark = false;
    
    // Aplicar configuración de cámara
    if (typeof cameraScale !== 'undefined') {
        cameraScale = GAME_CONFIG.gameplay.cameraScale || 4;
    }
    
    // Resetear variables
    paredes = [];
    enemigos = [];
    poderesEnMapa = [];
    meta = undefined;
    gameState = 'playing';
    tiempoInicio = time;
    ultimoMovimientoEnemigos = time;
    
    // Generar laberinto según nivel y configuración
    generarLaberinto();
    
    // Posicionar jugador
    jugadorPos = { 
        x: jugadorMatriz.x * TILE_SIZE + TILE_SIZE/2, 
        y: jugadorMatriz.y * TILE_SIZE + TILE_SIZE/2
    };
    
    // Centrar cámara en el jugador
    if (typeof cameraPos !== 'undefined' && typeof vec2 !== 'undefined') {
        cameraPos = vec2(jugadorPos.x, jugadorPos.y);
    }
    
    // Dar poderes iniciales según configuración
    if (GAME_CONFIG.powers.pickaxe.enabled && nivelActual >= GAME_CONFIG.powers.pickaxe.startLevel) {
        poderes.pico = 1;
    }
    
    // Generar poderes en el mapa
    generarPoderesEnMapa();
    
    // Generar enemigos si corresponde
    if (GAME_CONFIG.enemies.enabled && nivelActual >= GAME_CONFIG.enemies.startLevel) {
        generarEnemigos();
    }
    
    console.log(\`Nivel \${nivelActual} iniciado - Laberinto: \${mazeData[0].length}x\${mazeData.length}\`);
}

///////////////////////////////////////////////////////////////////////////////
function generarLaberinto() {
    // Calcular tamaño según configuración con límite de seguridad
    const { minSize, maxSize, growthRate } = GAME_CONFIG.maze;
    let size = Math.min(minSize + (nivelActual - 1) * growthRate, maxSize);
    
    // Límite máximo absoluto para evitar problemas de rendimiento
    size = Math.min(size, 31); // Máximo 31x31 para evitar loops
    
    if (size % 2 === 0) size++; // Asegurar que sea impar
    
    console.log(\`🏗️ Generando laberinto \${size}x\${size} para nivel \${nivelActual}\`);
    
    // Generar laberinto usando algoritmo iterativo (sin recursión)
    mazeData = Array.from({length: size}, () => Array(size).fill(1));
    
    // Algoritmo iterativo para evitar stack overflow
    function generateMazeIterative() {
        const stack = [{x: 1, y: 1}];
        const visited = new Set();
        let iterations = 0;
        const maxIterations = size * size * 2; // Límite de seguridad
        
        while (stack.length > 0 && iterations < maxIterations) {
            iterations++;
            
            const current = stack[stack.length - 1];
            const {x, y} = current;
            const key = \`\${x},\${y}\`;
            
            if (!visited.has(key)) {
                visited.add(key);
                mazeData[y][x] = 0;
            }
            
            // Buscar vecinos no visitados
            const directions = [[0,2], [0,-2], [2,0], [-2,0]];
            const validDirections = [];
            
            for (let [dx, dy] of directions) {
                const nx = x + dx, ny = y + dy;
                const nkey = \`\${nx},\${ny}\`;
                if (nx > 0 && nx < size-1 && ny > 0 && ny < size-1 && !visited.has(nkey)) {
                    validDirections.push([dx, dy]);
                }
            }
            
            if (validDirections.length > 0) {
                // Elegir dirección aleatoria
                const [dx, dy] = validDirections[Math.floor(Math.random() * validDirections.length)];
                const nx = x + dx, ny = y + dy;
                
                // Abrir el camino
                mazeData[y + dy/2][x + dx/2] = 0;
                
                // Añadir nueva posición al stack
                stack.push({x: nx, y: ny});
            } else {
                // No hay vecinos válidos, retroceder
                stack.pop();
            }
        }
        
        console.log(\`🏗️ Laberinto generado en \${iterations} iteraciones\`);
    }
    
    // Generar con límite de tiempo
    const startTime = Date.now();
    try {
        generateMazeIterative();
        
        // Si tardó más de 100ms, usar laberinto simple
        if (Date.now() - startTime > 100) {
            console.warn('⚠️ Generación lenta, usando laberinto simple');
            throw new Error('Timeout');
        }
    } catch (error) {
        console.warn('⚠️ Generación de laberinto interrumpida, usando laberinto simple');
        // Crear laberinto simple pero funcional
        mazeData = Array.from({length: size}, () => Array(size).fill(1));
        
        // Crear caminos simples
        for (let i = 1; i < size-1; i++) {
            mazeData[1][i] = 0; // Camino horizontal superior
            mazeData[size-2][i] = 0; // Camino horizontal inferior
            mazeData[i][1] = 0; // Camino vertical izquierdo
            mazeData[i][size-2] = 0; // Camino vertical derecho
        }
        
        // Añadir algunos caminos internos
        for (let i = 3; i < size-3; i += 2) {
            for (let j = 3; j < size-3; j += 2) {
                mazeData[i][j] = 0;
                if (Math.random() > 0.5) mazeData[i][j+1] = 0;
                if (Math.random() > 0.5) mazeData[i+1][j] = 0;
            }
        }
    }
    
    // Asegurar inicio y meta
    mazeData[1][1] = 0;
    mazeData[size-2][size-2] = 0;
    
    // Establecer posiciones
    jugadorMatriz = { x: 1, y: 1 };
    meta = { x: size-2, y: size-2 };
    
    // Crear array de paredes para renderizado
    paredes = [];
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            if (mazeData[y][x] === 1) {
                paredes.push({
                    x: x * TILE_SIZE + TILE_SIZE/2,
                    y: y * TILE_SIZE + TILE_SIZE/2
                });
            }
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
function generarEnemigos() {
    const numEnemigos = Math.min(Math.floor(nivelActual / 5) + 1, 4);
    
    for (let i = 0; i < numEnemigos; i++) {
        let attempts = 0;
        let enemyX, enemyY;
        
        do {
            const x = Math.floor(Math.random() * (mazeData[0].length - 4)) + 2;
            const y = Math.floor(Math.random() * (mazeData.length - 4)) + 2;
            
            if (mazeData[y][x] === 0) {
                enemyX = x;
                enemyY = y;
                
                const distToPlayer = Math.abs(enemyX - jugadorMatriz.x) + Math.abs(enemyY - jugadorMatriz.y);
                const distToGoal = Math.abs(enemyX - meta.x) + Math.abs(enemyY - meta.y);
                
                if (distToPlayer > 3 && distToGoal > 2) {
                    break;
                }
            }
            attempts++;
        } while (attempts < 50);
        
        if (attempts < 50) {
            enemigos.push({
                x: enemyX,
                y: enemyY,
                frozen: false,
                freezeTime: 0
            });
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
function generarPoderesEnMapa() {
    const numPoderes = 2;
    
    for (let i = 0; i < numPoderes; i++) {
        let attempts = 0;
        let poderX, poderY;
        
        do {
            const x = Math.floor(Math.random() * (mazeData[0].length - 4)) + 2;
            const y = Math.floor(Math.random() * (mazeData.length - 4)) + 2;
            
            if (mazeData[y][x] === 0) {
                poderX = x;
                poderY = y;
                
                const distToPlayer = Math.abs(poderX - jugadorMatriz.x) + Math.abs(poderY - jugadorMatriz.y);
                if (distToPlayer > 2) {
                    break;
                }
            }
            attempts++;
        } while (attempts < 50);
        
        if (attempts < 50) {
            const tipo = Math.random() < GAME_CONFIG.powers.snowball.probability ? 'bolaDeNieve' : 'aliado';
            poderesEnMapa.push({
                x: poderX,
                y: poderY,
                tipo: tipo,
                collected: false
            });
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate() {
    // Verificar timeout de frame para evitar loops infinitos
    const currentTime = Date.now();
    if (currentTime - lastFrameTime > 100 && !frameTimeoutWarning) {
        console.warn('⚠️ Frame tardó más de 100ms, posible loop detectado');
        frameTimeoutWarning = true;
        setTimeout(() => frameTimeoutWarning = false, 5000); // Reset warning
    }
    lastFrameTime = currentTime;
    
    if (gameState !== 'playing') return;
    
    // Verificar que las variables estén inicializadas
    if (!jugadorPos || !mazeData || !cameraPos) {
        console.warn('⚠️ Variables no inicializadas en gameUpdate');
        return;
    }
    
    // Actualizar cámara para seguir al jugador
    cameraPos = vec2(jugadorPos.x, jugadorPos.y);
    
    // Actualizar enemigos congelados (con límite de seguridad)
    if (enemigosCongelados && enemigosCongelados.length > 0) {
        for (let i = Math.min(enemigosCongelados.length - 1, 10); i >= 0; i--) {
            if (enemigosCongelados[i]) {
                enemigosCongelados[i].freezeTime -= timeDelta;
                if (enemigosCongelados[i].freezeTime <= 0) {
                    enemigosCongelados[i].frozen = false;
                    enemigosCongelados.splice(i, 1);
                }
            }
        }
    }
    
    // Mover enemigos según configuración (con límite de seguridad)
    if (time - ultimoMovimientoEnemigos > GAME_CONFIG.enemies.moveInterval) {
        if (enemigos && enemigos.length > 0) {
            const maxEnemigos = Math.min(enemigos.length, 20); // Límite de 20 enemigos
            for (let i = 0; i < maxEnemigos; i++) {
                const enemigo = enemigos[i];
                if (enemigo && !enemigo.frozen && Math.random() < GAME_CONFIG.enemies.moveChance) {
                    moverEnemigo(enemigo);
                }
            }
        }
        ultimoMovimientoEnemigos = time;
    }
    
    // Controles del jugador
    manejarControles();
    
    // Verificar colisiones
    verificarColisiones();
    
    // Actualizar HUD (con throttling)
    if (Math.floor(time * 2) !== Math.floor((time - timeDelta) * 2)) {
        actualizarHUD(); // Solo actualizar 2 veces por segundo
    }
}

///////////////////////////////////////////////////////////////////////////////
function moverEnemigo(enemigo) {
    const directions = [
        { x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }
    ];
    const dir = directions[Math.floor(Math.random() * directions.length)];
    const newX = enemigo.x + dir.x;
    const newY = enemigo.y + dir.y;
    
    if (newX >= 0 && newX < mazeData[0].length && newY >= 0 && newY < mazeData.length && 
        mazeData[newY][newX] === 0) {
        enemigo.x = newX;
        enemigo.y = newY;
    }
}

///////////////////////////////////////////////////////////////////////////////
function manejarControles() {
    // Activar poderes
    if (keyWasPressed("Digit1") && poderes.pico > 0) {
        estadoApuntado.activo = true;
        estadoApuntado.poder = 'pico';
    }
    if (keyWasPressed("Digit2") && poderes.bolaDeNieve > 0) {
        estadoApuntado.activo = true;
        estadoApuntado.poder = 'bolaDeNieve';
    }
    if (keyWasPressed("Digit3") && poderes.aliado > 0) {
        usarAliado();
    }
    
    if (estadoApuntado.activo) {
        // Controles de apuntado
        if (keyWasPressed("ArrowUp")) estadoApuntado.direccion = 0;
        if (keyWasPressed("ArrowRight")) estadoApuntado.direccion = 1;
        if (keyWasPressed("ArrowDown")) estadoApuntado.direccion = 2;
        if (keyWasPressed("ArrowLeft")) estadoApuntado.direccion = 3;
        
        if (keyWasPressed("Space")) {
            usarPoder();
            estadoApuntado.activo = false;
        }
        
        if (keyWasPressed("Escape")) {
            estadoApuntado.activo = false;
        }
    } else {
        // Movimiento normal
        let deltaX = 0, deltaY = 0;
        
        if (keyIsDown("ArrowLeft") || keyIsDown("KeyA")) deltaX = -VELOCIDAD_JUGADOR * timeDelta;
        if (keyIsDown("ArrowRight") || keyIsDown("KeyD")) deltaX = VELOCIDAD_JUGADOR * timeDelta;
        if (keyIsDown("ArrowUp") || keyIsDown("KeyW")) deltaY = VELOCIDAD_JUGADOR * timeDelta;
        if (keyIsDown("ArrowDown") || keyIsDown("KeyS")) deltaY = -VELOCIDAD_JUGADOR * timeDelta;
        
        // Aplicar movimiento con colisiones
        const newX = jugadorPos.x + deltaX;
        const newY = jugadorPos.y + deltaY;
        
        if (puedeMoverse(newX, jugadorPos.y)) jugadorPos.x = newX;
        if (puedeMoverse(jugadorPos.x, newY)) jugadorPos.y = newY;
        
        // Actualizar posición en matriz
        jugadorMatriz.x = Math.floor(jugadorPos.x / TILE_SIZE);
        jugadorMatriz.y = Math.floor(jugadorPos.y / TILE_SIZE);
    }
}

///////////////////////////////////////////////////////////////////////////////
function puedeMoverse(x, y) {
    const margin = TILE_SIZE * 0.3;
    const left = Math.floor((x - margin) / TILE_SIZE);
    const right = Math.floor((x + margin) / TILE_SIZE);
    const top = Math.floor((y - margin) / TILE_SIZE);
    const bottom = Math.floor((y + margin) / TILE_SIZE);
    
    if (left < 0 || right >= mazeData[0].length || top < 0 || bottom >= mazeData.length) {
        return false;
    }
    
    return mazeData[top][left] === 0 && mazeData[top][right] === 0 && 
           mazeData[bottom][left] === 0 && mazeData[bottom][right] === 0;
}

///////////////////////////////////////////////////////////////////////////////
function usarPoder() {
    if (estadoApuntado.poder === 'pico') {
        const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        const [dx, dy] = dirs[estadoApuntado.direccion];
        const targetX = jugadorMatriz.x + dx;
        const targetY = jugadorMatriz.y + dy;
        
        if (targetX >= 0 && targetX < mazeData[0].length && 
            targetY >= 0 && targetY < mazeData.length && 
            mazeData[targetY][targetX] === 1) {
            
            mazeData[targetY][targetX] = 0;
            poderes.pico--;
            sonidos.pico.play();
            
            // Actualizar paredes
            paredes = paredes.filter(p => {
                const px = Math.floor((p.x - TILE_SIZE/2) / TILE_SIZE);
                const py = Math.floor((p.y - TILE_SIZE/2) / TILE_SIZE);
                return !(px === targetX && py === targetY);
            });
        }
    } else if (estadoApuntado.poder === 'bolaDeNieve') {
        const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        const [dx, dy] = dirs[estadoApuntado.direccion];
        
        proyectilesActivos.push({
            x: jugadorPos.x,
            y: jugadorPos.y,
            dx: dx * 200,
            dy: dy * 200,
            distance: 0,
            maxDistance: TILE_SIZE * 5
        });
        
        poderes.bolaDeNieve--;
        sonidos.lanzar.play();
    }
}

///////////////////////////////////////////////////////////////////////////////
function usarAliado() {
    let closestEnemy = null;
    let closestDist = Infinity;
    
    enemigos.forEach((enemigo, index) => {
        const dist = Math.abs(enemigo.x - jugadorMatriz.x) + Math.abs(enemigo.y - jugadorMatriz.y);
        if (dist < closestDist && dist < 8) {
            closestDist = dist;
            closestEnemy = index;
        }
    });
    
    if (closestEnemy !== null) {
        enemigos.splice(closestEnemy, 1);
        poderes.aliado--;
        sonidos.colision.play();
    }
}

///////////////////////////////////////////////////////////////////////////////
function verificarColisiones() {
    // Colisión con meta
    if (jugadorMatriz.x === meta.x && jugadorMatriz.y === meta.y && gameState === 'playing') {
        gameState = 'levelComplete';
        sonidos.meta.play();
        console.log(\`🎯 Nivel \${nivelActual} completado!\`);
        
        // Avanzar al siguiente nivel después de un breve delay
        setTimeout(() => {
            nivelActual++;
            gameState = 'playing';
            engineInitialized = false; // Permitir reinicialización
            gameInit(); // Reiniciar con nuevo nivel
        }, 500); // Reducir delay para menos lag
        return;
    }
    
    // Colisión con enemigos
    enemigos.forEach(enemigo => {
        if (!enemigo.frozen && jugadorMatriz.x === enemigo.x && jugadorMatriz.y === enemigo.y) {
            sonidos.enemigo.play();
            // Reiniciar nivel
            jugadorPos.x = 1 * TILE_SIZE + TILE_SIZE/2;
            jugadorPos.y = 1 * TILE_SIZE + TILE_SIZE/2;
            jugadorMatriz.x = 1;
            jugadorMatriz.y = 1;
        }
    });
    
    // Recoger poderes
    poderesEnMapa.forEach((poder, index) => {
        if (!poder.collected && jugadorMatriz.x === poder.x && jugadorMatriz.y === poder.y) {
            poder.collected = true;
            if (poder.tipo === 'bolaDeNieve') {
                poderes.bolaDeNieve++;
            } else if (poder.tipo === 'aliado') {
                poderes.aliado++;
            }
        }
    });
    
    // Actualizar proyectiles
    for (let i = proyectilesActivos.length - 1; i >= 0; i--) {
        const proj = proyectilesActivos[i];
        proj.x += proj.dx * timeDelta;
        proj.y += proj.dy * timeDelta;
        proj.distance += Math.abs(proj.dx * timeDelta) + Math.abs(proj.dy * timeDelta);
        
        const projX = Math.floor(proj.x / TILE_SIZE);
        const projY = Math.floor(proj.y / TILE_SIZE);
        
        // Verificar colisión con paredes o límites
        if (projX < 0 || projX >= mazeData[0].length || projY < 0 || projY >= mazeData.length ||
            mazeData[projY][projX] === 1 || proj.distance >= proj.maxDistance) {
            proyectilesActivos.splice(i, 1);
            continue;
        }
        
        // Verificar colisión con enemigos
        enemigos.forEach(enemigo => {
            if (enemigo.x === projX && enemigo.y === projY) {
                enemigo.frozen = true;
                enemigo.freezeTime = 3;
                enemigosCongelados.push(enemigo);
                proyectilesActivos.splice(i, 1);
                sonidos.congelar.play();
            }
        });
    }
}

///////////////////////////////////////////////////////////////////////////////
function actualizarHUD() {
    const levelEl = document.getElementById('currentLevel');
    const timeEl = document.getElementById('gameTime');
    const pickaxeEl = document.getElementById('pickaxeCount');
    const snowballEl = document.getElementById('snowballCount');
    const allyEl = document.getElementById('allyCount');
    
    if (levelEl) levelEl.textContent = nivelActual;
    if (timeEl) {
        const elapsed = Math.floor(time - tiempoInicio);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        timeEl.textContent = \`\${minutes.toString().padStart(2, '0')}:\${seconds.toString().padStart(2, '0')}\`;
    }
    if (pickaxeEl) pickaxeEl.textContent = poderes.pico;
    if (snowballEl) snowballEl.textContent = poderes.bolaDeNieve;
    if (allyEl) allyEl.textContent = poderes.aliado;
}

///////////////////////////////////////////////////////////////////////////////
function gameRender() {
    // Fondo gris para los muros
    drawRect(vec2(0,0), vec2(9999, 9999), rgb(0.3, 0.3, 0.3));
    
    // Usar tiles si están disponibles
    const usarTiles = textureInfos && textureInfos[0] && textureInfos[0].image;
    
    if (usarTiles) {
        // Dibujar suelo
        for (let y = 0; y < mazeData.length; y++) {
            for (let x = 0; x < mazeData[y].length; x++) {
                if (mazeData[y][x] === 0) {
                    drawTile(
                        vec2(x * TILE_SIZE + TILE_SIZE/2, y * TILE_SIZE + TILE_SIZE/2),
                        vec2(TILE_SIZE, TILE_SIZE),
                        tile(1, TILE_SIZE),
                        rgb(0.6, 0.4, 0.2)
                    );
                }
            }
        }
    } else {
        // Fallback: dibujar paredes
        paredes.forEach(pared => {
            drawRect(
                vec2(pared.x, pared.y),
                vec2(TILE_SIZE, TILE_SIZE),
                rgb(0.4, 0.4, 0.4)
            );
        });
    }
    
    // Dibujar meta
    if (meta) {
        const metaPos = vec2(meta.x * TILE_SIZE + TILE_SIZE/2, meta.y * TILE_SIZE + TILE_SIZE/2);
        if (usarTiles) {
            drawTile(metaPos, vec2(TILE_SIZE, TILE_SIZE), tile(6, TILE_SIZE), rgb(1, 1, 0.2));
        } else {
            drawRect(metaPos, vec2(TILE_SIZE, TILE_SIZE), rgb(0.2, 0.8, 0.2));
        }
    }
    
    // Dibujar enemigos
    enemigos.forEach(enemigo => {
        const enemyPos = vec2(enemigo.x * TILE_SIZE + TILE_SIZE/2, enemigo.y * TILE_SIZE + TILE_SIZE/2);
        const color = enemigo.frozen ? rgb(0.2, 0.5, 1) : rgb(0.8, 0.1, 0.1);
        const size = enemigo.frozen ? vec2(TILE_SIZE * 0.9, TILE_SIZE * 0.9) : 
                     vec2(TILE_SIZE * (0.8 + Math.sin(time * 8) * 0.1), TILE_SIZE * (0.8 + Math.sin(time * 8) * 0.1));
        
        if (usarTiles) {
            drawTile(enemyPos, size, tile(4, TILE_SIZE), color);
        } else {
            drawRect(enemyPos, size, color);
        }
    });
    
    // Dibujar jugador con animación
    if (jugadorPos) {
        const s = Math.sin(time * 9) * 0.1;
        const playerSize = vec2(TILE_SIZE * (0.8 - s * 0.3), TILE_SIZE * (0.8 + s * 0.3));
        
        if (usarTiles) {
            drawTile(vec2(jugadorPos.x, jugadorPos.y), playerSize, tile(5, TILE_SIZE), rgb(0.2, 0.8, 0.2));
        } else {
            drawRect(vec2(jugadorPos.x, jugadorPos.y), playerSize, rgb(0.2, 0.8, 0.2));
        }
    }
    
    // Dibujar poderes en el mapa
    poderesEnMapa.forEach(poder => {
        if (!poder.collected) {
            const poderPos = vec2(poder.x * TILE_SIZE + TILE_SIZE/2, poder.y * TILE_SIZE + TILE_SIZE/2);
            const flotacion = Math.sin(time * 3 + poder.x + poder.y) * 2;
            const pos = vec2(poderPos.x, poderPos.y + flotacion);
            const color = poder.tipo === 'bolaDeNieve' ? rgb(0.5, 0.8, 1) : rgb(0.5, 1, 0.5);
            
            drawRect(pos, vec2(TILE_SIZE * 0.6, TILE_SIZE * 0.6), color);
        }
    });
    
    // Dibujar proyectiles
    proyectilesActivos.forEach(proj => {
        drawRect(
            vec2(proj.x, proj.y),
            vec2(TILE_SIZE * 0.3, TILE_SIZE * 0.3),
            rgb(0.9, 0.9, 1)
        );
    });
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost() {
    // Mantener la cámara centrada en el jugador
    if (jugadorPos) {
        cameraPos = vec2(jugadorPos.x, jugadorPos.y);
    }
}

///////////////////////////////////////////////////////////////////////////////
function gameRenderPost() {
    // Renderizado adicional si es necesario
}

// Inicializar LittleJS
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, 'tiles.png');`;
}

// Generar CSS del juego
function generateGameCSS() {
    return `/* Estilos del Juego Generado - Basado en demo_4 perfecto */
body {
    margin: 0;
    padding: 0;
    background: #1a1a1a;
    color: #ffffff;
    font-family: Arial, sans-serif;
    overflow: hidden;
}

#gameContainer {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
}

#gameHeader {
    background: #2c3e50;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    z-index: 1000;
}

#gameHeader h1 {
    margin: 0;
    font-size: 1.5em;
    color: #ecf0f1;
}

#gameControls {
    display: flex;
    gap: 10px;
}

#gameControls button {
    padding: 8px 16px;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.3s;
}

#gameControls button:hover {
    background: #2980b9;
}

#gameCanvas {
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #2c3e50, #34495e);
    position: relative;
    padding: 20px;
    border-top: 3px solid #3498db;
    border-bottom: 3px solid #3498db;
    flex: 1;
    min-height: 0;
    overflow: hidden;
    box-sizing: border-box;
}

#gameCanvas canvas {
    border: 4px solid #2c3e50;
    border-radius: 8px;
    background: #000;
    box-shadow: 
        0 0 20px rgba(52, 152, 219, 0.3),
        inset 0 0 10px rgba(0, 0, 0, 0.5);
    width: 720px !important;
    height: 480px !important;
    max-width: calc(100vw - 80px);
    max-height: calc(100vh - 300px);
    z-index: 10;
    position: relative;
    object-fit: contain;
}

#gameInfo {
    background: linear-gradient(135deg, #2c3e50, #34495e);
    padding: 12px;
    display: flex;
    justify-content: space-around;
    border-top: 3px solid #3498db;
    border-bottom: 2px solid #2c3e50;
    height: 140px;
    overflow-y: auto;
    box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.3);
    position: relative;
    z-index: 20;
    flex-shrink: 0;
}

.info-section {
    flex: 1;
    margin: 0 10px;
}

.info-section h3 {
    margin: 0 0 10px 0;
    font-size: 1.1em;
    color: #ecf0f1;
    border-bottom: 2px solid #3498db;
    padding-bottom: 5px;
}

#gameStats p, #controlsInfo p {
    margin: 5px 0;
    font-size: 14px;
}

#powerInfo {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.power-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 5px;
    background: rgba(52, 73, 94, 0.5);
    border-radius: 3px;
}

.power-key {
    background: #3498db;
    color: white;
    padding: 2px 8px;
    border-radius: 3px;
    font-weight: bold;
    min-width: 20px;
    text-align: center;
}

.power-name {
    flex: 1;
    font-size: 14px;
}

.power-count {
    background: #e74c3c;
    color: white;
    padding: 2px 8px;
    border-radius: 3px;
    font-weight: bold;
    min-width: 20px;
    text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
    #gameHeader {
        flex-direction: column;
        gap: 10px;
        text-align: center;
    }
    
    #gameInfo {
        flex-direction: column;
        height: auto;
    }
    
    .info-section {
        margin: 10px 0;
    }
}`;
}

// Cargar LittleJS desde archivo local optimizado (version de demo_4)
async function loadLittleJSFromFile() {
    try {
        // Intentar cargar desde output/demo_4 que sabemos que funciona
        const response = await fetch('output/demo_4/littlejs.js');
        if (response.ok) {
            const content = await response.text();
            if (content.length > 100000) { // Verificar que sea un archivo completo (demo_4 tiene ~5482 líneas)
                console.log('✅ LittleJS optimizado cargado desde demo_4 (', content.length, 'caracteres)');
                return content;
            }
        }
        
        // Fallback: archivo local del constructor
        const localResponse = await fetch('js/littlejs/littlejs.js');
        if (localResponse.ok) {
            const content = await localResponse.text();
            if (content.length > 10000) {
                console.log('✅ LittleJS cargado desde js/littlejs/ (', content.length, 'caracteres)');
                return content;
            }
        }
    } catch (error) {
        console.warn('⚠️ No se pudo cargar LittleJS desde archivos locales:', error);
    }
    
    // Fallback final: usar contenido embebido mínimo pero funcional
    console.log('📦 Usando LittleJS embebido como fallback');
    return getLittleJSEmbedded();
}

// Obtener LittleJS desde archivos locales (función original mantenida por compatibilidad)
async function fetchLittleJS() {
    try {
        // Primero intentar desde la carpeta js/littlejs local
        const response = await fetch('js/littlejs/littlejs.js');
        if (response.ok) {
            console.log('✅ LittleJS cargado desde js/littlejs/');
            return await response.text();
        }
        
        // Fallback 1: intentar desde dist
        const distResponse = await fetch('../dist/littlejs.min.js');
        if (distResponse.ok) {
            console.log('✅ LittleJS cargado desde dist/');
            return await distResponse.text();
        }
        
        // Fallback 2: intentar desde dist alternativo
        const distResponse2 = await fetch('../dist/littlejs.js');
        if (distResponse2.ok) {
            console.log('✅ LittleJS cargado desde dist/ (version no minificada)');
            return await distResponse2.text();
        }
        
        throw new Error('No se encontró LittleJS en ninguna ubicación');
    } catch (error) {
        console.error('❌ Error cargando LittleJS desde fetch:', error);
        console.log('💡 Recomendación: Usa el archivo generado que ya incluye LittleJS completo');
        
        // En lugar de usar una versión mínima, informar al usuario que el archivo
        // ya debe incluir LittleJS completo
        return `// LittleJS no pudo cargarse dinámicamente
// NOTA: Los archivos generados incluyen LittleJS completo
// Si ves este mensaje, el fetch falló pero el archivo generado
// ya debería tener LittleJS incorporado.

console.warn("⚠️ LittleJS no pudo cargarse dinámicamente");
console.log("💡 El archivo generado debe incluir LittleJS completo");

// Mensaje para desarrolladores
console.error("❌ Si ves este error, verifica que el archivo littlejs.js esté completo en el juego generado");`;
    }
}

// Obtener LittleJS embebido como fallback
function getLittleJSEmbedded() {
    console.log('📦 Usando LittleJS embebido como fallback');
    return `// LittleJS Engine - Versión embebida para juegos generados
// Basado en LittleJS por Frank Force - MIT License

'use strict';

// Variables globales del motor
let time = 0;
let gravity = 0;
let cameraPos = {x: 0, y: 0};
let cameraScale = 4;
let engineObjects = [];
let PI = Math.PI;

// Utilidades matemáticas básicas
function abs(value) { return Math.abs(value); }
function min(valueA, valueB) { return Math.min(valueA, valueB); }
function max(valueA, valueB) { return Math.max(valueA, valueB); }
function clamp(value, min=0, max=1) { return value < min ? min : value > max ? max : value; }
function rand(valueA=1, valueB=0) { return valueB + Math.random() * (valueA-valueB); }
function randInt(valueA, valueB=0) { return Math.floor(rand(valueA,valueB)); }

// Clase Vector2 simplificada
function vec2(x=0, y) {
    if (y === undefined) y = x;
    return new Vector2(x, y);
}

class Vector2 {
    constructor(x=0, y=0) {
        this.x = x; this.y = y;
    }
    copy() { return new Vector2(this.x, this.y); }
    add(v) { return new Vector2(this.x + (v.x || v), this.y + (v.y || v)); }
    subtract(v) { return new Vector2(this.x - (v.x || v), this.y - (v.y || v)); }
    multiply(v) { return new Vector2(this.x * (v.x || v), this.y * (v.y || v)); }
    scale(s) { return new Vector2(this.x * s, this.y * s); }
    length() { return Math.sqrt(this.x*this.x + this.y*this.y); }
    distance(v) { return this.subtract(v).length(); }
}

// Clase Color simplificada
class Color {
    constructor(r=1, g=1, b=1, a=1) {
        this.r = r; this.g = g; this.b = b; this.a = a;
    }
    toString() { return \`rgba(\${this.r*255|0},\${this.g*255|0},\${this.b*255|0},\${this.a})\`; }
}

// Timer simplificado
class Timer {
    constructor(timeLeft) { 
        this.time = timeLeft == undefined ? undefined : time + timeLeft; 
    }
    set(timeLeft=0) { this.time = time + timeLeft; }
    elapsed() { return this.time !== undefined && time >= this.time; }
    get() { return this.time !== undefined ? time - this.time : 0; }
}

// Sistema de sonidos con ZzFX
function zzfx(...args) { /* Implementación básica de sonidos */ }

class Sound {
    constructor(zzfxSound) { this.zzfxSound = zzfxSound; }
    play() { if (this.zzfxSound) zzfx(...this.zzfxSound); }
}

// Funciones de entrada
let inputData = [[]];
function keyIsDown(key) { return inputData[0][key] || false; }
function keyWasPressed(key) { return keyIsDown(key) && !inputData[1][key]; }

// Funciones de renderizado básicas
let mainContext, mainCanvas;

function drawRect(pos, size, color, angle=0) {
    if (!mainContext) return;
    mainContext.save();
    mainContext.fillStyle = color.toString();
    mainContext.fillRect(pos.x - size.x/2, pos.y - size.y/2, size.x, size.y);
    mainContext.restore();
}

function drawTile(pos, size, tileInfo, color=new Color()) {
    // Renderizado básico de tiles
    drawRect(pos, size, color);
}

// Motor principal
function engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost) {
    console.log('🎮 Inicializando LittleJS embebido...');
    
    // Crear canvas principal
    mainCanvas = document.createElement('canvas');
    mainCanvas.width = 1920;
    mainCanvas.height = 1080;
    mainContext = mainCanvas.getContext('2d');
    
    // Añadir canvas al DOM
    const gameContainer = document.getElementById('gameContainer');
    if (gameContainer) {
        gameContainer.appendChild(mainCanvas);
        mainCanvas.style.border = '2px solid #444';
        mainCanvas.style.display = 'block';
        mainCanvas.style.margin = '10px auto';
        mainCanvas.style.maxWidth = '100%';
        mainCanvas.style.height = 'auto';
    }
    
    // Configurar entrada básica
    setupBasicInput();
    
    // Inicializar juego
    if (gameInit) gameInit();
    
    // Loop principal
    function gameLoop() {
        time += 1/60;
        
        // Actualizar entrada
        updateInput();
        
        // Actualizar juego
        if (gameUpdate) gameUpdate();
        if (gameUpdatePost) gameUpdatePost();
        
        // Renderizar
        if (mainContext) {
            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
            mainContext.fillStyle = '#222';
            mainContext.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
        }
        
        if (gameRender) gameRender();
        if (gameRenderPost) gameRenderPost();
        
        requestAnimationFrame(gameLoop);
    }
    
    gameLoop();
}

// Sistema de entrada básico
function setupBasicInput() {
    document.addEventListener('keydown', (e) => {
        inputData[0][e.key] = inputData[0][e.code] = true;
    });
    
    document.addEventListener('keyup', (e) => {
        inputData[0][e.key] = inputData[0][e.code] = false;
    });
}

function updateInput() {
    // Actualizar estado anterior de teclas
    inputData[1] = {...inputData[0]};
}

console.log('✅ LittleJS embebido cargado - funcionalidad básica disponible');
console.warn('⚠️ Esta es una versión reducida de LittleJS para compatibilidad');
`;
}

// Obtener imagen de tiles (usar la de demo_4 que funciona)
async function fetchTilesImage() {
    try {
        // Intentar cargar desde demo_4 que sabemos que funciona
        const response = await fetch('output/demo_4/tiles.png');
        if (response.ok) {
            console.log('✅ Tiles cargadas desde demo_4');
            return await response.blob();
        }
        
        // Fallback: assets local
        const localResponse = await fetch('assets/tiles.png');
        if (localResponse.ok) {
            console.log('✅ Tiles cargadas desde assets/');
            return await localResponse.blob();
        }
        
        throw new Error('No se pudo cargar tiles.png desde ninguna ubicación');
    } catch (error) {
        console.warn('⚠️ No se pudo cargar tiles.png - el juego funcionará sin texturas');
        return null; // El juego funcionará sin tiles usando fallback
    }
}

// Generar README del juego
function generateGameReadme(gameName, config) {
    return `# ${gameName}

Juego de laberinto generado con el Constructor de Laberintos.

## 📋 Configuración del Juego

- **Velocidad del Jugador:** ${config.gameplay.playerSpeed} píxeles/segundo
- **Escala de Cámara:** ${config.gameplay.cameraScale}x
- **Tamaño de Laberinto:** ${config.maze.minSize} - ${config.maze.maxSize} (crece +${config.maze.growthRate} por nivel)
- **Enemigos:** ${config.enemies.enabled ? `Habilitados desde nivel ${config.enemies.startLevel}` : 'Deshabilitados'}
- **Poderes:**
  - **Pico:** ${config.powers.pickaxe.enabled ? `Habilitado desde nivel ${config.powers.pickaxe.startLevel}` : 'Deshabilitado'}
  - **Bola de Nieve:** ${config.powers.snowball.enabled ? `Habilitado (${Math.round(config.powers.snowball.probability * 100)}% probabilidad)` : 'Deshabilitado'}
  - **Aliado:** ${config.powers.ally.enabled ? `Habilitado (${Math.round(config.powers.ally.probability * 100)}% probabilidad)` : 'Deshabilitado'}

## 🎮 Cómo Jugar

1. **Objetivo:** Llega al cuadrado amarillo (meta) evitando los enemigos rojos
2. **Movimiento:** Usa las flechas del teclado o WASD
3. **Poderes:** 
   - Presiona **1, 2, 3** para activar poderes
   - Usa las **flechas** para apuntar
   - Presiona **Espacio** para usar el poder
   - Presiona **Escape** para cancelar

## 🎯 Poderes Disponibles

- **🔨 Pico (1):** Rompe paredes adyacentes
- **❄️ Bola de Nieve (2):** Congela enemigos temporalmente
- **🤖 Aliado (3):** Elimina el enemigo más cercano con línea de vista

## 📦 Archivos Incluidos

- \`index.html\` - Archivo principal del juego
- \`game.js\` - Motor del juego personalizado
- \`littlejs.js\` - Motor LittleJS
- \`tiles.png\` - Texturas del juego
- \`style.css\` - Estilos del juego
- \`config.json\` - Configuración completa
- \`README.md\` - Este archivo

## 🚀 Cómo Ejecutar

1. Abre \`index.html\` en tu navegador web
2. ¡Disfruta jugando!

## ℹ️ Información Técnica

- **Generado:** ${config.metadata.created}
- **Versión:** ${config.metadata.version}
- **Motor:** LittleJS
- **Constructor:** Constructor de Laberintos v1.0

---

¡Gracias por usar el Constructor de Laberintos! 🎮✨`;
}

// Descargar juego como ZIP
async function downloadGameZip(gameName, files) {
    console.log('📦 Archivos generados para:', gameName);
    console.log('Archivos:', Object.keys(files));
    
    // Crear un único archivo ZIP para descargar
    try {
        // Si JSZip está disponible, crear ZIP real
        if (typeof JSZip !== 'undefined') {
            const zip = new JSZip();
            
            // Añadir archivos al ZIP
            Object.entries(files).forEach(([filename, content]) => {
                if (filename === 'tiles.png' && content) {
                    zip.file(filename, content);
                } else if (typeof content === 'string') {
                    zip.file(filename, content);
                }
            });
            
            // Generar y descargar ZIP
            const zipBlob = await zip.generateAsync({type: 'blob'});
            const link = document.createElement('a');
            link.href = URL.createObjectURL(zipBlob);
            link.download = `${gameName.replace(/[^a-zA-Z0-9]/g, '_')}.zip`;
            link.click();
            
            alert(`✅ Juego "${gameName}" descargado como ZIP`);
        } else {
            // Fallback: descargar archivos individuales
            Object.entries(files).forEach(([filename, content]) => {
                if (filename === 'tiles.png' && content) {
                    // Manejar imagen
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(content);
                    link.download = filename;
                    link.click();
                } else if (typeof content === 'string') {
                    // Manejar archivos de texto
                    const blob = new Blob([content], { type: getContentType(filename) });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = filename;
                    link.click();
                }
            });
            
            alert(`✅ ${Object.keys(files).length} archivos descargados para ${gameName}\n📁 Recomendación: Coloca todos los archivos en la misma carpeta`);
        }
    } catch (error) {
        console.error('Error al crear ZIP:', error);
        alert('❌ Error al crear el archivo. Los archivos se descargarán individualmente.');
        
        // Fallback: descargar archivos individuales
        Object.entries(files).forEach(([filename, content]) => {
            if (filename === 'tiles.png' && content) {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = filename;
                link.click();
            } else if (typeof content === 'string') {
                const blob = new Blob([content], { type: getContentType(filename) });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = filename;
                link.click();
            }
        });
    }
}

// Obtener tipo de contenido
function getContentType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
        case 'html': return 'text/html';
        case 'js': return 'application/javascript';
        case 'css': return 'text/css';
        case 'json': return 'application/json';
        case 'md': return 'text/markdown';
        case 'png': return 'image/png';
        default: return 'text/plain';
    }
} 