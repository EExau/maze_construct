// Motor de Juego Configurable para Laberintos
// Basado en la configuración generada por el constructor

let gameConfig = {};
let gameState = {
    level: 1,
    totalTime: 0,
    levelTime: 0,
    powers: {
        pickaxe: 0,
        snowball: 0,
        ally: 0
    }
};

// Sonidos del juego (como en maze original)
let sonidos = {};

// Función para inicializar sonidos
function initSounds() {
    try {
        // Intentar usar la librería de sonidos si está disponible
        if (typeof initMazeSounds === 'function') {
            const success = initMazeSounds();
            if (success) {
                console.log('🔊 Usando librería maze_sounds.js');
                return;
            }
        }
        
        // Verificar si la clase Sound está disponible (en LittleJS real)
        if (typeof Sound !== 'undefined') {
            // Esperar interacción del usuario antes de crear sonidos
            if (typeof audioContext !== 'undefined' && audioContext.state === 'suspended') {
                console.log('🔊 Esperando interacción del usuario para activar audio...');
                
                // Mostrar mensaje de activación de audio
                const audioStatus = document.getElementById('audioStatus');
                if (audioStatus) {
                    audioStatus.style.display = 'block';
                }
                
                // Crear función para activar audio en la primera interacción
                const activateAudio = () => {
                    audioContext.resume().then(() => {
                        initActualSounds();
                        console.log('🔊 Audio activado por interacción del usuario');
                        
                        // Ocultar mensaje de activación
                        if (audioStatus) {
                            audioStatus.style.display = 'none';
                        }
                    }).catch(error => {
                        console.warn('⚠️ Error al activar audio:', error);
                        initFallbackSounds();
                        
                        // Ocultar mensaje aunque haya error
                        if (audioStatus) {
                            audioStatus.style.display = 'none';
                        }
                    });
                    
                    // Remover listeners después de la primera activación
                    document.removeEventListener('click', activateAudio);
                    document.removeEventListener('keydown', activateAudio);
                    document.removeEventListener('touchstart', activateAudio);
                };
                
                // Agregar listeners para activar audio
                document.addEventListener('click', activateAudio);
                document.addEventListener('keydown', activateAudio);
                document.addEventListener('touchstart', activateAudio);
                
                // Inicializar sonidos fallback mientras tanto
                initFallbackSounds();
            } else {
                // Contexto de audio ya está activo
                initActualSounds();
            }
        } else {
            // LittleJS no disponible, usar modo simulado
            initFallbackSounds();
        }
    } catch (error) {
        console.error('❌ Error al inicializar sonidos:', error);
        initFallbackSounds();
    }
}

// Función para inicializar sonidos reales de LittleJS
function initActualSounds() {
    try {
        // Verificar que LittleJS esté completamente cargado
        if (typeof zzfx === 'undefined') {
            console.warn('⚠️ ZzFX no disponible, usando fallback');
            initFallbackSounds();
            return;
        }
        
        // Verificar configuración de sonido
        if (typeof soundEnable !== 'undefined') {
            console.log('🔊 soundEnable:', soundEnable);
            if (!soundEnable) {
                console.warn('⚠️ soundEnable está deshabilitado, habilitando...');
                soundEnable = true;
            }
        }
        
        if (typeof soundVolume !== 'undefined') {
            console.log('🔊 soundVolume:', soundVolume);
            if (soundVolume === 0) {
                console.warn('⚠️ soundVolume está en 0, ajustando...');
                soundVolume = 1;
            }
        }
        
        sonidos = {
            meta: new Sound([,,539,0,.04,.29,1,1.92,,,567,.02,.02,,,,.04]), // ✨ Llegar a la meta
            enemigo: new Sound([,,925,.04,.3,.6,1,.3,,6.27,-184,.09,.17]), // 🥊 Enemigo toca al jugador
            pico: new Sound([,,471,,.09,.47,4,1.06,-6.7,,,,,.9,61,.1,,.82,.1]), // ⚡ Usar pico
            lanzar: new Sound([,,150,.05,,.05,,1.3,,,,,,3]), // 🏌️ Lanzar bola/aliado
            colision: new Sound([,,1675,,.06,.24,1,1.82,,,837,.06]), // 💰 Aliado elimina enemigo
            congelar: new Sound([,.2,40,.5,,1.5,,11,,,,,,199]) // 🌊 Enemigo congelado
        };
        
        // Probar un sonido de prueba silencioso para activar el contexto
        if (typeof audioContext !== 'undefined') {
            console.log('🔊 Estado del contexto de audio:', audioContext.state);
            if (audioContext.state === 'suspended') {
                console.log('🔊 Intentando reanudar contexto de audio...');
                audioContext.resume().then(() => {
                    console.log('🔊 Contexto de audio reanudado');
                }).catch(err => {
                    console.warn('⚠️ Error al reanudar contexto:', err);
                });
            }
        }
        
        console.log('🔊 Sonidos LittleJS inicializados correctamente');
    } catch (error) {
        console.warn('⚠️ Error al crear sonidos LittleJS:', error);
        initFallbackSounds();
    }
}

// Función para inicializar sonidos fallback
function initFallbackSounds() {
    // Intentar crear sonidos básicos con Web Audio API
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        try {
            const ctx = typeof AudioContext !== 'undefined' ? 
                new AudioContext() : new webkitAudioContext();
            
            sonidos = {
                meta: createBasicSound(ctx, 539, 0.3),
                enemigo: createBasicSound(ctx, 925, 0.2),
                pico: createBasicSound(ctx, 471, 0.4),
                lanzar: createBasicSound(ctx, 150, 0.3),
                colision: createBasicSound(ctx, 1675, 0.2),
                congelar: createBasicSound(ctx, 40, 0.5)
            };
            console.log('🔊 Sonidos básicos Web Audio inicializados');
            return;
        } catch (error) {
            console.warn('⚠️ Error al crear sonidos Web Audio:', error);
        }
    }
    
    // Fallback completo - arrays de parámetros ZzFX
    sonidos = {
        meta: [,,539,0,.04,.29,1,1.92,,,567,.02,.02,,,,.04],
        enemigo: [,,925,.04,.3,.6,1,.3,,6.27,-184,.09,.17],
        pico: [,,471,,.09,.47,4,1.06,-6.7,,,,,.9,61,.1,,.82,.1],
        lanzar: [,,150,.05,,.05,,1.3,,,,,,3],
        colision: [,,1675,,.06,.24,1,1.82,,,837,.06],
        congelar: [,.2,40,.5,,1.5,,11,,,,,,199]
    };
    console.log('🔊 Sonidos inicializados en modo simulado');
}

// Función para crear sonidos básicos con Web Audio API
function createBasicSound(audioContext, frequency, duration) {
    return {
        play: function() {
            try {
                if (audioContext.state === 'suspended') {
                    audioContext.resume();
                }
                
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
                oscillator.type = 'square';
                
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + duration);
                
                console.log(`🔊 Sonido básico reproducido: ${frequency}Hz`);
            } catch (error) {
                console.warn('⚠️ Error al reproducir sonido básico:', error);
            }
        }
    };
}

// Función para reproducir sonidos
function playSound(sound) {
    try {
        // Si tenemos la librería de sonidos, usarla
        if (typeof playMazeSound === 'function') {
            // Convertir referencia de sonido a nombre
            const soundName = getSoundName(sound);
            if (soundName) {
                playMazeSound(soundName);
                return;
            }
        }
        
        // Verificar si el contexto de audio está disponible y activo
        if (typeof audioContext !== 'undefined' && audioContext.state === 'suspended') {
            console.log('🔇 Audio suspendido - intentando reanudar...');
            audioContext.resume().then(() => {
                console.log('🔊 Contexto reanudado, reintentando sonido...');
                playSound(sound); // Reintentar
            });
            return;
        }
        
        // Intentar ZzFX directo primero (más confiable)
        if (typeof zzfx === 'function') {
            const soundName = getSoundName(sound);
            if (soundName) {
                const params = getZzFXParams(soundName);
                if (params) {
                    console.log('🔊 Usando ZzFX directo para:', soundName);
                    zzfx(...params);
                    return; // Éxito, salir
                }
            }
        }
        
        if (sound && typeof sound.play === 'function') {
            // LittleJS real - verificar que el sonido esté listo
            if (sound.sampleChannels && sound.sampleChannels.length > 0) {
                sound.play();
                console.log('🔊 Reproduciendo sonido LittleJS');
            } else {
                console.log('🔇 Sonido LittleJS no está listo');
            }
        } else if (Array.isArray(sound)) {
            // Intentar usar ZzFX directo con array de parámetros
            if (typeof zzfx === 'function') {
                console.log('🔊 Reproduciendo array con ZzFX:', sound.slice(0, 3), '...');
                zzfx(...sound);
            } else {
                console.log('🔊 Reproduciendo sonido simulado:', sound.slice(0, 3), '...');
            }
        } else if (sound === null || sound === undefined) {
            console.log('🔇 Sonido no disponible');
        } else {
            console.log('🔊 Tipo de sonido desconocido:', typeof sound);
        }
    } catch (error) {
        console.warn('⚠️ Error al reproducir sonido:', error.message);
        // Intentar fallback con Web Audio básico
        tryBasicWebAudio();
    }
}

// Función para intentar reproducir con ZzFX directo
function playDirectZzFX(sound) {
    try {
        if (typeof zzfx === 'function') {
            // Obtener parámetros ZzFX del objeto Sound
            const soundName = getSoundName(sound);
            const params = getZzFXParams(soundName);
            if (params) {
                console.log('🔊 Reproduciendo ZzFX directo para:', soundName, params.slice(0, 5));
                zzfx(...params);
                return true;
            }
        }
        return false;
    } catch (error) {
        console.warn('⚠️ Error en ZzFX directo:', error);
        return false;
    }
}

// Función para obtener parámetros ZzFX por nombre
function getZzFXParams(soundName) {
    const params = {
        meta: [,,539,0,.04,.29,1,1.92,,,567,.02,.02,,,,.04],
        enemigo: [,,925,.04,.3,.6,1,.3,,6.27,-184,.09,.17],
        pico: [,,471,,.09,.47,4,1.06,-6.7,,,,,.9,61,.1,,.82,.1],
        lanzar: [,,150,.05,,.05,,1.3,,,,,,3],
        colision: [,,1675,,.06,.24,1,1.82,,,837,.06],
        congelar: [,.2,40,.5,,1.5,,11,,,,,,199]
    };
    return params[soundName];
}

// Función de fallback con Web Audio básico
function tryBasicWebAudio() {
    try {
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            const ctx = typeof AudioContext !== 'undefined' ? 
                new AudioContext() : new webkitAudioContext();
            
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            oscillator.frequency.setValueAtTime(440, ctx.currentTime);
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
            
            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.2);
            
            console.log('🔊 Sonido básico Web Audio reproducido');
        }
    } catch (error) {
        console.warn('⚠️ Error en Web Audio básico:', error);
    }
}

// Función auxiliar para obtener el nombre del sonido
function getSoundName(sound) {
    if (sound === sonidos.meta) return 'meta';
    if (sound === sonidos.enemigo) return 'enemigo';
    if (sound === sonidos.pico) return 'pico';
    if (sound === sonidos.lanzar) return 'lanzar';
    if (sound === sonidos.colision) return 'colision';
    if (sound === sonidos.congelar) return 'congelar';
    return null;
}

// Función principal para inicializar el juego con configuración
function initMazeGame(config) {
    gameConfig = config;
    console.log('🎮 Inicializando juego con configuración:', config);
    
    // Aplicar configuración básica
    if (config.gameplay) {
        console.log('⚙️ Aplicando configuración de gameplay:', config.gameplay);
        // Aquí se aplicarían las configuraciones al motor LittleJS
        // Por ejemplo: playerSpeed, cameraScale, etc.
    }
    
    // Configurar laberinto
    if (config.maze) {
        console.log('🧩 Configurando generación de laberinto:', config.maze);
        // Aquí se configurarían los parámetros del generador de laberintos
    }
    
    // Configurar poderes
    if (config.powers) {
        console.log('🎯 Configurando sistema de poderes:', config.powers);
        updatePowerDisplay();
    }
    
    // Configurar enemigos
    if (config.enemies) {
        console.log('👾 Configurando sistema de enemigos:', config.enemies);
    }
    
    // Configurar complejidad
    if (config.complexity) {
        console.log('🧩 Configurando complejidad del laberinto:', config.complexity);
    }
    
    // Inicializar motor LittleJS (simulado)
    initGameEngine();
}

// Simulación de inicialización del motor
function initGameEngine() {
    console.log('🚀 Motor de juego inicializado');
    
    // Crear canvas simulado
    const canvas = document.createElement('canvas');
    canvas.width = 1000; // Aumentado para mejor visibilidad
    canvas.height = 750;
    canvas.style.background = '#2c3e50';
    canvas.style.border = '2px solid #34495e';
    canvas.style.borderRadius = '10px';
    
    const gameCanvas = document.getElementById('gameCanvas');
    if (gameCanvas) {
        gameCanvas.appendChild(canvas);
    }
    
    // Inicializar juego simple
    initSimpleGame(canvas);
    
    // Iniciar loop de actualización
    startGameLoop();
}

// Juego simple funcional
let player = { x: 0, y: 0, size: 12, speed: 2 };
let goal = { x: 0, y: 0, size: 12 };
let mazeData = [];
let walls = [];
let keys = {};
let gameWon = false;
let TILE_SIZE = 24; // Aumentado de 16 a 24 para mejor visibilidad
let mazeSize = 9;

// Nuevos sistemas del juego
let enemies = [];
let powerBoxes = [];
let aimingMode = false;
let aimDirection = { x: 0, y: -1 }; // Arriba por defecto
let lastEnemyMove = 0;

function initSimpleGame(canvas) {
    const ctx = canvas.getContext('2d');
    
    // Inicializar sonidos
    initSounds();
    
    // Calcular tamaño del laberinto según configuración y nivel
    calculateMazeSize();
    
    // Generar laberinto dinámico
    generateMaze();
    
    // Aplicar configuración de velocidad
    if (gameConfig.gameplay && gameConfig.gameplay.playerSpeed) {
        player.speed = gameConfig.gameplay.playerSpeed / 60; // Convertir a píxeles por frame
    }
    
    // Event listeners para controles (solo una vez)
    if (!window.gameControlsAdded) {
        document.addEventListener('keydown', (e) => {
            if (!keys[e.key]) {
                keysPressed[e.key] = true; // Tecla recién presionada
            }
            keys[e.key] = true;
            
            // Prevenir acciones por defecto para teclas especiales
            if (['1', '2', '3', ' ', 'Escape'].includes(e.key)) {
                e.preventDefault();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            keys[e.key] = false;
            keysPressed[e.key] = false;
        });
        window.gameControlsAdded = true;
    }
    
    // Dibujar juego inicial
    drawGame(ctx, canvas);
}

// Calcular tamaño del laberinto según configuración
function calculateMazeSize() {
    if (gameConfig.maze) {
        const { minSize, maxSize, growthRate } = gameConfig.maze;
        const calculatedSize = minSize + (gameState.level - 1) * growthRate;
        mazeSize = Math.min(calculatedSize, maxSize);
    } else {
        mazeSize = 9; // Tamaño por defecto
    }
    
    // Asegurar que sea impar para el algoritmo de generación
    if (mazeSize % 2 === 0) mazeSize++;
    
    console.log(`🧩 Generando laberinto ${mazeSize}x${mazeSize} para nivel ${gameState.level}`);
}

// Generar laberinto usando algoritmo DFS (similar al juego original)
function generateMaze() {
    // Inicializar matriz con paredes
    mazeData = Array.from({length: mazeSize}, () => Array(mazeSize).fill(1));
    
    // Algoritmo DFS simplificado
    function carve(x, y) {
        mazeData[y][x] = 0;
        
        const directions = [[0,2], [0,-2], [2,0], [-2,0]];
        // Mezclar direcciones aleatoriamente
        for (let i = directions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [directions[i], directions[j]] = [directions[j], directions[i]];
        }
        
        for (let [dx, dy] of directions) {
            const nx = x + dx, ny = y + dy;
            if (nx > 0 && nx < mazeSize-1 && ny > 0 && ny < mazeSize-1 && mazeData[ny][nx] === 1) {
                mazeData[y + dy/2][x + dx/2] = 0; // Conectar
                carve(nx, ny);
            }
        }
    }
    
    // Comenzar desde posición impar
    carve(1, 1);
    
    // Asegurar que inicio y meta sean libres
    mazeData[1][1] = 0; // Inicio
    mazeData[mazeSize-2][mazeSize-2] = 0; // Meta
    
    // Convertir matriz a paredes para renderizado
    walls = [];
    const offsetX = (1000 - mazeSize * TILE_SIZE) / 2;
    const offsetY = (750 - mazeSize * TILE_SIZE) / 2;
    
    for (let y = 0; y < mazeSize; y++) {
        for (let x = 0; x < mazeSize; x++) {
            if (mazeData[y][x] === 1) {
                walls.push({
                    x: offsetX + x * TILE_SIZE,
                    y: offsetY + y * TILE_SIZE,
                    w: TILE_SIZE,
                    h: TILE_SIZE
                });
            }
        }
    }
    
    // Posicionar jugador y meta
    const mazeOffsetX = (1000 - mazeSize * TILE_SIZE) / 2;
    const mazeOffsetY = (750 - mazeSize * TILE_SIZE) / 2;
    
    player.x = mazeOffsetX + 1 * TILE_SIZE + (TILE_SIZE - player.size) / 2;
    player.y = mazeOffsetY + 1 * TILE_SIZE + (TILE_SIZE - player.size) / 2;
    
    goal.x = mazeOffsetX + (mazeSize-2) * TILE_SIZE + (TILE_SIZE - goal.size) / 2;
    goal.y = mazeOffsetY + (mazeSize-2) * TILE_SIZE + (TILE_SIZE - goal.size) / 2;
    
    // Generar enemigos si corresponde
    generateEnemies(mazeOffsetX, mazeOffsetY);
    
    // Generar cajas de poder
    generatePowerBoxes(mazeOffsetX, mazeOffsetY);
}

// Generar enemigos según configuración  
function generateEnemies(offsetX, offsetY) {
    enemies = [];
    
    if (!gameConfig.enemies || !gameConfig.enemies.enabled) return;
    if (gameState.level < gameConfig.enemies.startLevel) return;
    
    // Número de enemigos basado en el nivel
    const numEnemies = Math.min(Math.floor(gameState.level / 5) + 1, 4);
    
    for (let i = 0; i < numEnemies; i++) {
        let attempts = 0;
        let enemyX, enemyY;
        
        // Buscar posición libre para el enemigo
        do {
            const gridX = Math.floor(Math.random() * (mazeSize - 4)) + 2;
            const gridY = Math.floor(Math.random() * (mazeSize - 4)) + 2;
            
            if (mazeData[gridY] && mazeData[gridY][gridX] === 0) {
                enemyX = offsetX + gridX * TILE_SIZE + (TILE_SIZE - 10) / 2;
                enemyY = offsetY + gridY * TILE_SIZE + (TILE_SIZE - 10) / 2;
                
                // Verificar que no esté muy cerca del jugador o meta
                const distToPlayer = Math.abs(enemyX - player.x) + Math.abs(enemyY - player.y);
                const distToGoal = Math.abs(enemyX - goal.x) + Math.abs(enemyY - goal.y);
                
                if (distToPlayer > TILE_SIZE * 3 && distToGoal > TILE_SIZE * 2) {
                    break;
                }
            }
            attempts++;
        } while (attempts < 50);
        
        if (attempts < 50) {
            enemies.push({
                x: enemyX,
                y: enemyY,
                size: 10,
                gridX: Math.floor((enemyX - offsetX) / TILE_SIZE),
                gridY: Math.floor((enemyY - offsetY) / TILE_SIZE),
                frozen: false,
                freezeTime: 0
            });
        }
    }
    
    console.log(`👾 Generados ${enemies.length} enemigos para nivel ${gameState.level}`);
}

// Generar cajas de poder
function generatePowerBoxes(offsetX, offsetY) {
    powerBoxes = [];
    
    // 2 cajas por nivel
    for (let i = 0; i < 2; i++) {
        let attempts = 0;
        let boxX, boxY;
        
        do {
            const gridX = Math.floor(Math.random() * (mazeSize - 4)) + 2;
            const gridY = Math.floor(Math.random() * (mazeSize - 4)) + 2;
            
            if (mazeData[gridY] && mazeData[gridY][gridX] === 0) {
                boxX = offsetX + gridX * TILE_SIZE + (TILE_SIZE - 8) / 2;
                boxY = offsetY + gridY * TILE_SIZE + (TILE_SIZE - 8) / 2;
                
                // Verificar que no esté muy cerca del jugador, meta o enemigos
                const distToPlayer = Math.abs(boxX - player.x) + Math.abs(boxY - player.y);
                const distToGoal = Math.abs(boxX - goal.x) + Math.abs(boxY - goal.y);
                
                if (distToPlayer > TILE_SIZE * 2 && distToGoal > TILE_SIZE * 2) {
                    break;
                }
            }
            attempts++;
        } while (attempts < 50);
        
        if (attempts < 50) {
            // 80% Snowball, 20% Ally según configuración
            const powerType = Math.random() < 0.8 ? 'snowball' : 'ally';
            
            powerBoxes.push({
                x: boxX,
                y: boxY,
                size: 8,
                type: powerType,
                collected: false
            });
        }
    }
}

function drawGame(ctx, canvas) {
    // Limpiar canvas
    ctx.fillStyle = '#34495e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar información de configuración
    ctx.fillStyle = '#ecf0f1';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    let y = 20;
    
    ctx.fillText('🎮 JUEGO DEMO FUNCIONAL', 10, y);
    y += 20;
    
    if (gameConfig.gameplay) {
        ctx.fillText(`Velocidad: ${gameConfig.gameplay.playerSpeed}`, 10, y);
        y += 15;
        ctx.fillText(`Escala Cámara: ${gameConfig.gameplay.cameraScale}`, 10, y);
        y += 15;
    }
    
    if (gameConfig.maze) {
        ctx.fillText(`Tamaño Laberinto: ${gameConfig.maze.minSize}-${gameConfig.maze.maxSize}`, 10, y);
        y += 15;
        ctx.fillText(`Tamaño Actual: ${mazeSize}x${mazeSize}`, 10, y);
        y += 15;
    }
    
    if (gameConfig.enemies && gameConfig.enemies.enabled) {
        ctx.fillText(`Enemigos: Nivel ${gameConfig.enemies.startLevel}+`, 10, y);
        y += 15;
    } else {
        ctx.fillText('Enemigos: Deshabilitados', 10, y);
        y += 15;
    }
    
    // Mostrar información de progresión
    if (gameConfig.progression) {
        if (gameConfig.progression.endLevelEnabled) {
            ctx.fillText(`Progresión: Hasta nivel ${gameConfig.progression.endLevel}`, 10, y);
        } else {
            ctx.fillText('Progresión: Modo infinito', 10, y);
        }
    }
    
    // Dibujar controles
    ctx.fillStyle = '#95a5a6';
    ctx.font = '12px Arial';
    ctx.fillText('WASD/Flechas: mover | 1,2,3: poderes | Recoge cajas de poder', 10, canvas.height - 40);
    ctx.fillText('Llega al cuadrado verde | Evita enemigos rojos', 10, canvas.height - 25);
    ctx.fillText(`Enemigos: ${enemies.length} | Cajas: ${powerBoxes.filter(b => !b.collected).length}`, 10, canvas.height - 10);
    
    // Dibujar laberinto centrado
    const mazeOffsetX = (canvas.width - mazeSize * TILE_SIZE) / 2;
    const mazeOffsetY = (canvas.height - mazeSize * TILE_SIZE) / 2;
    
    // Cargar imagen de tiles si no está cargada
    if (!window.tilesImage) {
        window.tilesImage = new Image();
        window.tilesImage.src = 'assets/tiles.png';
    }
    
    if (window.tilesImage && window.tilesImage.complete) {
        // Dibujar con tiles reales (16x16 cada tile)
        for (let y = 0; y < mazeSize; y++) {
            for (let x = 0; x < mazeSize; x++) {
                const tileX = mazeOffsetX + x * TILE_SIZE;
                const tileY = mazeOffsetY + y * TILE_SIZE;
                
                if (mazeData[y] && mazeData[y][x] === 1) {
                    // Pared (tile 1) - color gris
                    ctx.save();
                    ctx.fillStyle = '#888888';
                    ctx.fillRect(tileX, tileY, TILE_SIZE, TILE_SIZE);
                    ctx.globalCompositeOperation = 'multiply';
                    ctx.drawImage(window.tilesImage, 16, 0, 16, 16, tileX, tileY, TILE_SIZE, TILE_SIZE);
                    ctx.restore();
                } else {
                    // Suelo (tile 0) - color café claro y forma cuadrada
                    ctx.save();
                    ctx.fillStyle = '#d2b48c'; // Color café claro
                    ctx.fillRect(tileX, tileY, TILE_SIZE, TILE_SIZE);
                    ctx.globalCompositeOperation = 'multiply';
                    ctx.drawImage(window.tilesImage, 0, 0, 16, 16, tileX, tileY, TILE_SIZE, TILE_SIZE);
                    ctx.restore();
                }
            }
        }
    } else {
        // Fallback mientras carga
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(mazeOffsetX, mazeOffsetY, mazeSize * TILE_SIZE, mazeSize * TILE_SIZE);
        
        ctx.fillStyle = '#8b4513';
        walls.forEach(wall => {
            ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
        });
    }
    
    // Dibujar objetivo (meta) - tile 7 amarillo
    if (window.tilesImage && window.tilesImage.complete) {
        // Tile 7 (posición 96, 0 en el tileset) con tinte amarillo
        ctx.save();
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(goal.x, goal.y, goal.size, goal.size);
        ctx.globalCompositeOperation = 'multiply';
        ctx.drawImage(window.tilesImage, 96, 0, 16, 16, goal.x, goal.y, goal.size, goal.size);
        ctx.restore();
    } else {
        ctx.fillStyle = '#ffff00'; // Amarillo como fallback
        ctx.fillRect(goal.x, goal.y, goal.size, goal.size);
        ctx.strokeStyle = '#ffcc00';
        ctx.lineWidth = 2;
        ctx.strokeRect(goal.x, goal.y, goal.size, goal.size);
    }
    
    // Dibujar cajas de poder - tile 2 con círculo de tile 7 o 1 con colores
    powerBoxes.forEach(box => {
        if (!box.collected) {
            if (window.tilesImage && window.tilesImage.complete) {
                // Base: tile 2 (posición 16, 0) con tinte según tipo
                ctx.save();
                if (box.type === 'snowball') {
                    ctx.fillStyle = '#87ceeb'; // Azul claro para snowball
                } else {
                    ctx.fillStyle = '#90ee90'; // Verde claro para ally
                }
                ctx.fillRect(box.x, box.y, box.size, box.size);
                ctx.globalCompositeOperation = 'multiply';
                ctx.drawImage(window.tilesImage, 16, 0, 16, 16, box.x, box.y, box.size, box.size);
                ctx.restore();
                
                // Círculo encima según tipo de poder
                const circleSize = box.size * 0.6;
                const circleX = box.x + (box.size - circleSize) / 2;
                const circleY = box.y + (box.size - circleSize) / 2;
                
                ctx.save();
                if (box.type === 'snowball') {
                    // Círculo de tile 7 para snowball con tinte azul
                    ctx.fillStyle = '#00bfff';
                    ctx.fillRect(circleX, circleY, circleSize, circleSize);
                    ctx.globalCompositeOperation = 'multiply';
                    ctx.drawImage(window.tilesImage, 96, 0, 16, 16, circleX, circleY, circleSize, circleSize);
                } else {
                    // Círculo de tile 1 para ally con tinte verde
                    ctx.fillStyle = '#00ff00';
                    ctx.fillRect(circleX, circleY, circleSize, circleSize);
                    ctx.globalCompositeOperation = 'multiply';
                    ctx.drawImage(window.tilesImage, 0, 0, 16, 16, circleX, circleY, circleSize, circleSize);
                }
                ctx.restore();
            } else {
                // Fallback
                ctx.fillStyle = box.type === 'snowball' ? '#87ceeb' : '#90ee90';
                ctx.fillRect(box.x, box.y, box.size, box.size);
                
                ctx.fillStyle = box.type === 'snowball' ? '#00bfff' : '#00ff00';
                ctx.beginPath();
                ctx.arc(box.x + box.size/2, box.y + box.size/2, box.size/3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    });
    
    // Dibujar enemigos con animación entre tiles 4 y 5
    enemies.forEach(enemy => {
        if (window.tilesImage && window.tilesImage.complete) {
            if (enemy.frozen) {
                // Enemigo congelado - usar tile estático (puede ser tile 5 con efecto azul)
                ctx.save();
                ctx.globalAlpha = 0.7;
                ctx.drawImage(window.tilesImage, 64, 0, 16, 16, enemy.x, enemy.y, enemy.size, enemy.size);
                // Efecto de congelamiento
                ctx.fillStyle = 'rgba(135, 206, 235, 0.5)';
                ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
                ctx.restore();
            } else {
                // Animación entre tiles 4 y 5 como en animation.js con tinte rojo
                const time = Date.now() / 1000;
                const frame = Math.floor(time * 4) % 2; // 4 cambios por segundo, 2 frames
                const tileX = 48 + (frame * 16); // Tile 4 (48) o Tile 5 (64)
                ctx.save();
                ctx.fillStyle = '#ff4444';
                ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
                ctx.globalCompositeOperation = 'multiply';
                ctx.drawImage(window.tilesImage, tileX, 0, 16, 16, enemy.x, enemy.y, enemy.size, enemy.size);
                ctx.restore();
            }
        } else {
            // Fallback
            if (enemy.frozen) {
                ctx.fillStyle = '#87ceeb';
                ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
                ctx.strokeStyle = '#4682b4';
            } else {
                ctx.fillStyle = '#ff4444';
                ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
                ctx.strokeStyle = '#cc0000';
            }
            ctx.lineWidth = 1;
            ctx.strokeRect(enemy.x, enemy.y, enemy.size, enemy.size);
        }
    });
    
    // Dibujar jugador - tile 6 con animación stretch/squash y color verde
    if (window.tilesImage && window.tilesImage.complete) {
        // Animación stretch and squash como en animation.js
        const time = Date.now() / 1000; // Tiempo en segundos
        const s = Math.sin(time * 9) * 0.5;
        const sizeX = player.size - s;
        const sizeY = player.size + s;
        const adjustedY = player.y + (player.size - sizeY);
        
        // Tile 6 (posición 80, 0 en el tileset) con tinte verde
        ctx.save();
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(player.x, adjustedY, sizeX, sizeY);
        ctx.globalCompositeOperation = 'multiply';
        ctx.drawImage(window.tilesImage, 80, 0, 16, 16, player.x, adjustedY, sizeX, sizeY);
        ctx.restore();
    } else {
        ctx.fillStyle = '#00ff00'; // Verde como fallback
        ctx.fillRect(player.x, player.y, player.size, player.size);
        ctx.strokeStyle = '#00cc00';
        ctx.lineWidth = 1;
        ctx.strokeRect(player.x, player.y, player.size, player.size);
    }
    
    // Dibujar animaciones
    drawAnimations(ctx);
    
    // Dibujar cruceta de dirección si está en modo apuntar (fuera del zoom)
    if (aimingMode) {
        drawAimingCrosshair(ctx, canvas);
    }
    
    // Verificar colisión con objetivo
    if (!gameWon && player.x < goal.x + goal.size &&
        player.x + player.size > goal.x &&
        player.y < goal.y + goal.size &&
        player.y + player.size > goal.y) {
        
        gameWon = true;
        
        // Reproducir sonido de meta
        playSound(sonidos.meta);
        
        // Verificar si debe avanzar de nivel según configuración
        if (gameConfig.progression) {
            if (gameConfig.progression.infiniteMode || 
                !gameConfig.progression.endLevelEnabled || 
                gameState.level < gameConfig.progression.endLevel) {
                
                // Avanzar nivel después de 2 segundos
                setTimeout(() => {
                    nextLevel();
                }, 2000);
            }
        } else {
            // Modo por defecto: avanzar nivel
            setTimeout(() => {
                nextLevel();
            }, 2000);
        }
    }
    
    // Mostrar mensaje de victoria
    if (gameWon) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#f39c12';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('¡OBJETIVO ALCANZADO!', canvas.width/2, canvas.height/2 - 20);
        
        // Verificar si es el nivel final
        if (gameConfig.progression && gameConfig.progression.endLevelEnabled && 
            gameState.level >= gameConfig.progression.endLevel) {
            ctx.fillText('🏆 ¡JUEGO COMPLETADO! 🏆', canvas.width/2, canvas.height/2 + 20);
            ctx.font = '16px Arial';
            ctx.fillText('¡Felicidades por completar todos los niveles!', canvas.width/2, canvas.height/2 + 50);
        } else {
            ctx.fillText('🎉 ¡Configuración funcionando! 🎉', canvas.width/2, canvas.height/2 + 20);
            ctx.font = '16px Arial';
            ctx.fillText('Siguiente nivel en 2 segundos...', canvas.width/2, canvas.height/2 + 50);
        }
    }
    
}

function updateGame(canvas) {
    const ctx = canvas.getContext('2d');
    
    // Actualizar enemigos
    updateEnemies();
    
    // Manejar controles
    handleControls();
    
    // Movimiento del jugador (solo si no está en modo apuntar)
    let newX = player.x;
    let newY = player.y;
    
    if (!aimingMode) {
        if (keys['ArrowLeft'] || keys['a'] || keys['A']) newX -= player.speed;
        if (keys['ArrowRight'] || keys['d'] || keys['D']) newX += player.speed;
        if (keys['ArrowUp'] || keys['w'] || keys['W']) newY -= player.speed;
        if (keys['ArrowDown'] || keys['s'] || keys['S']) newY += player.speed;
    }
    
    // Verificar colisiones con paredes
    let canMove = true;
    walls.forEach(wall => {
        if (newX < wall.x + wall.w &&
            newX + player.size > wall.x &&
            newY < wall.y + wall.h &&
            newY + player.size > wall.y) {
            canMove = false;
        }
    });
    
    // Verificar límites del laberinto
    const offsetX = (1000 - mazeSize * TILE_SIZE) / 2;
    const offsetY = (750 - mazeSize * TILE_SIZE) / 2;
    const mazeWidth = mazeSize * TILE_SIZE;
    const mazeHeight = mazeSize * TILE_SIZE;
    
    if (newX < offsetX || newX + player.size > offsetX + mazeWidth ||
        newY < offsetY || newY + player.size > offsetY + mazeHeight) {
        canMove = false;
    }
    
    // Aplicar movimiento si es válido
    if (canMove) {
        player.x = newX;
        player.y = newY;
    }
    
    // Verificar colisiones con cajas de poder
    checkPowerBoxCollisions();
    
    // Verificar colisiones con enemigos
    checkEnemyCollisions();
    
    // Redibujar
    drawGame(ctx, canvas);
    
    // Limpiar teclas presionadas para el siguiente frame
    Object.keys(keysPressed).forEach(key => {
        if (keysPressed[key]) keysPressed[key] = false;
    });
}

// Actualizar enemigos
function updateEnemies() {
    if (!gameConfig.enemies || !gameConfig.enemies.enabled) return;
    
    const currentTime = Date.now() / 1000;
    const moveInterval = gameConfig.enemies.moveInterval || 1.0;
    
    if (currentTime - lastEnemyMove > moveInterval) {
        enemies.forEach(enemy => {
            if (enemy.frozen) {
                enemy.freezeTime -= moveInterval;
                if (enemy.freezeTime <= 0) {
                    enemy.frozen = false;
                }
                return;
            }
            
            // Probabilidad de moverse
            if (Math.random() < (gameConfig.enemies.moveChance || 0.7)) {
                moveEnemy(enemy);
            }
        });
        lastEnemyMove = currentTime;
    }
}

// Mover un enemigo
function moveEnemy(enemy) {
    const directions = [
        { x: 0, y: -TILE_SIZE }, // Arriba
        { x: 0, y: TILE_SIZE },  // Abajo
        { x: -TILE_SIZE, y: 0 }, // Izquierda
        { x: TILE_SIZE, y: 0 }   // Derecha
    ];
    
    const direction = directions[Math.floor(Math.random() * directions.length)];
    const newX = enemy.x + direction.x;
    const newY = enemy.y + direction.y;
    
    // Verificar si la nueva posición es válida
    const offsetX = (1000 - mazeSize * TILE_SIZE) / 2;
    const offsetY = (750 - mazeSize * TILE_SIZE) / 2;
    const gridX = Math.floor((newX - offsetX) / TILE_SIZE);
    const gridY = Math.floor((newY - offsetY) / TILE_SIZE);
    
    if (gridX >= 0 && gridX < mazeSize && gridY >= 0 && gridY < mazeSize && 
        mazeData[gridY] && mazeData[gridY][gridX] === 0) {
        enemy.x = newX;
        enemy.y = newY;
        enemy.gridX = gridX;
        enemy.gridY = gridY;
    }
}

// Variable global para saber qué poder se está usando
let activePower = null;
let keysPressed = {}; // Para detectar teclas recién presionadas

// Función para verificar línea de vista entre dos puntos
function hasLineOfSight(x1, y1, x2, y2) {
    const offsetX = (1000 - mazeSize * TILE_SIZE) / 2;
    const offsetY = (750 - mazeSize * TILE_SIZE) / 2;
    
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;
    
    let currentX = Math.floor((x1 - offsetX) / TILE_SIZE);
    let currentY = Math.floor((y1 - offsetY) / TILE_SIZE);
    const targetX = Math.floor((x2 - offsetX) / TILE_SIZE);
    const targetY = Math.floor((y2 - offsetY) / TILE_SIZE);
    
    // Algoritmo de línea de Bresenham para verificar cada celda
    while (true) {
        // Verificar si la celda actual es una pared
        if (currentX >= 0 && currentX < mazeSize && currentY >= 0 && currentY < mazeSize) {
            if (mazeData[currentY] && mazeData[currentY][currentX] === 1) {
                return false; // Hay una pared bloqueando
            }
        }
        
        // Si llegamos al objetivo, hay línea de vista
        if (currentX === targetX && currentY === targetY) {
            return true;
        }
        
        const e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            currentX += sx;
        }
        if (e2 < dx) {
            err += dx;
            currentY += sy;
        }
    }
}

// Manejar controles
function handleControls() {
    // Activar poderes (solo cuando se presiona por primera vez)
    if (keysPressed['1'] && gameState.powers.pickaxe > 0) {
        aimingMode = true;
        activePower = 'pickaxe';
        console.log('🔨 Modo apuntar pico activado - usa flechas y ESPACIO');
        keysPressed['1'] = false; // Evitar repetición
    }
    
    if (keysPressed['2'] && gameState.powers.snowball > 0) {
        aimingMode = true;
        activePower = 'snowball';
        console.log('❄️ Modo apuntar activado - usa flechas y ESPACIO');
        keysPressed['2'] = false; // Evitar repetición
    }
    
    if (keysPressed['3'] && gameState.powers.ally > 0) {
        // Aliado: eliminar enemigo más cercano CON línea de vista (SIN cruceta)
        if (enemies.length > 0) {
            let closestEnemy = null;
            let closestDist = Infinity;
            
            enemies.forEach((enemy, index) => {
                const dist = Math.abs(enemy.x - player.x) + Math.abs(enemy.y - player.y);
                if (dist < closestDist && dist < TILE_SIZE * 8) { // Rango limitado
                    // Verificar línea de vista
                    if (hasLineOfSight(player.x, player.y, enemy.x, enemy.y)) {
                        closestDist = dist;
                        closestEnemy = index;
                    }
                }
            });
            
            if (closestEnemy !== null) {
                // Crear efecto visual antes de eliminar
                createAllyEffect(enemies[closestEnemy].x, enemies[closestEnemy].y);
                enemies.splice(closestEnemy, 1);
                gameState.powers.ally--;
                updatePowerDisplay();
                console.log('🤖 Aliado eliminó enemigo en línea de vista');
                
                // Reproducir sonido de colisión (aliado elimina enemigo)
                playSound(sonidos.colision);
            } else {
                console.log('🤖 No hay enemigos visibles para el aliado');
            }
        } else {
            console.log('🤖 No hay enemigos para eliminar');
        }
        keysPressed['3'] = false; // Evitar repetición
    }
    
    // Controles de apuntado
    if (aimingMode) {
        if (keys['ArrowUp']) aimDirection = { x: 0, y: -1 };
        if (keys['ArrowDown']) aimDirection = { x: 0, y: 1 };
        if (keys['ArrowLeft']) aimDirection = { x: -1, y: 0 };
        if (keys['ArrowRight']) aimDirection = { x: 1, y: 0 };
        
        if (keysPressed[' ']) { // Espacio
            usePower();
            aimingMode = false;
            activePower = null;
            keysPressed[' '] = false;
        }
        
        if (keysPressed['Escape']) {
            aimingMode = false;
            activePower = null;
            keysPressed['Escape'] = false;
            console.log('❌ Modo apuntar cancelado');
        }
    }
}

// Usar poder apuntado
function usePower() {
    if (activePower === 'pickaxe' && gameState.powers.pickaxe > 0) {
        // Pico: romper pared en la dirección apuntada
        const offsetX = (1000 - mazeSize * TILE_SIZE) / 2;
        const offsetY = (750 - mazeSize * TILE_SIZE) / 2;
        const playerGridX = Math.floor((player.x - offsetX) / TILE_SIZE);
        const playerGridY = Math.floor((player.y - offsetY) / TILE_SIZE);
        
        const targetX = playerGridX + aimDirection.x;
        const targetY = playerGridY + aimDirection.y;
        
        if (targetX >= 0 && targetX < mazeSize && targetY >= 0 && targetY < mazeSize && 
            mazeData[targetY] && mazeData[targetY][targetX] === 1) {
            
            // Romper la pared
            mazeData[targetY][targetX] = 0;
            
            // Actualizar paredes para renderizado
            walls = walls.filter(wall => {
                const wallGridX = Math.floor((wall.x - offsetX) / TILE_SIZE);
                const wallGridY = Math.floor((wall.y - offsetY) / TILE_SIZE);
                return !(wallGridX === targetX && wallGridY === targetY);
            });
            
            gameState.powers.pickaxe--;
            updatePowerDisplay();
            console.log('🔨 Pared rota con pico');
            
            // Reproducir sonido de pico
            playSound(sonidos.pico);
            
            // Crear animación de rotura
            createBreakAnimation(targetX, targetY);
        } else {
            console.log('🔨 No hay pared para romper en esa dirección');
        }
    } else if (activePower === 'snowball' && gameState.powers.snowball > 0) {
        // Bola de nieve: congelar enemigos en la dirección apuntada
        const range = 5 * TILE_SIZE;
        let enemiesHit = 0;
        
        enemies.forEach(enemy => {
            const dx = enemy.x - player.x;
            const dy = enemy.y - player.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist <= range) {
                // Verificar si está en la dirección correcta
                const dotProduct = (dx * aimDirection.x + dy * aimDirection.y) / dist;
                if (dotProduct > 0.5) { // 60 grados de cono
                    enemy.frozen = true;
                    enemy.freezeTime = 5; // 5 segundos
                    enemiesHit++;
                }
            }
        });
        
        gameState.powers.snowball--;
        updatePowerDisplay();
        console.log(`❄️ Bola de nieve lanzada - ${enemiesHit} enemigos congelados`);
        
        // Reproducir sonido de lanzar
        playSound(sonidos.lanzar);
        
        // Reproducir sonido de congelar si hay enemigos afectados
        if (enemiesHit > 0) {
            playSound(sonidos.congelar);
        }
        
        // Crear animación de bola de nieve
        createSnowballAnimation();
    }
}

// Crear animación de rotura de pared
function createBreakAnimation(gridX, gridY) {
    const offsetX = (1000 - mazeSize * TILE_SIZE) / 2;
    const offsetY = (750 - mazeSize * TILE_SIZE) / 2;
    
    // Añadir partículas de rotura (simplificado)
    window.breakAnimations = window.breakAnimations || [];
    window.breakAnimations.push({
        x: offsetX + gridX * TILE_SIZE + TILE_SIZE/2,
        y: offsetY + gridY * TILE_SIZE + TILE_SIZE/2,
        time: 0.5,
        maxTime: 0.5
    });
}

// Crear animación de bola de nieve
function createSnowballAnimation() {
    window.snowballAnimations = window.snowballAnimations || [];
    window.snowballAnimations.push({
        x: player.x + player.size/2,
        y: player.y + player.size/2,
        dirX: aimDirection.x,
        dirY: aimDirection.y,
        distance: 0,
        maxDistance: 5 * TILE_SIZE,
        time: 0,
        maxTime: 1.0
    });
}

// Crear efecto visual del aliado
function createAllyEffect(x, y) {
    window.allyAnimations = window.allyAnimations || [];
    window.allyAnimations.push({
        x: x + TILE_SIZE / 2,
        y: y + TILE_SIZE / 2,
        time: 0,
        maxTime: 0.8
    });
}

// Verificar colisiones con cajas de poder
function checkPowerBoxCollisions() {
    powerBoxes.forEach(box => {
        if (!box.collected && 
            player.x < box.x + box.size &&
            player.x + player.size > box.x &&
            player.y < box.y + box.size &&
            player.y + player.size > box.y) {
            
            box.collected = true;
            
            if (box.type === 'snowball') {
                gameState.powers.snowball++;
            } else if (box.type === 'ally') {
                gameState.powers.ally++;
            }
            
            updatePowerDisplay();
            console.log(`📦 Recogido poder: ${box.type}`);
        }
    });
}

// Verificar colisiones con enemigos
function checkEnemyCollisions() {
    enemies.forEach(enemy => {
        if (!enemy.frozen &&
            player.x < enemy.x + enemy.size &&
            player.x + player.size > enemy.x &&
            player.y < enemy.y + enemy.size &&
            player.y + player.size > enemy.y) {
            
            // Colisión con enemigo - reiniciar nivel
            console.log('💀 Colisión con enemigo - reiniciando nivel');
            
            // Reproducir sonido de enemigo
            playSound(sonidos.enemigo);
            
            const offsetX = (1000 - mazeSize * TILE_SIZE) / 2;
            const offsetY = (750 - mazeSize * TILE_SIZE) / 2;
            player.x = offsetX + 1 * TILE_SIZE + (TILE_SIZE - player.size) / 2;
            player.y = offsetY + 1 * TILE_SIZE + (TILE_SIZE - player.size) / 2;
        }
    });
}

// Dibujar cruceta de apuntado
function drawAimingCrosshair(ctx, canvas) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const size = 40;
    
    // Solo los 4 círculos direccionales (sin fondo, sin líneas, sin centro)
    const directions = [
        { x: 0, y: -1, pos: { x: centerX, y: centerY - size } }, // Arriba
        { x: 0, y: 1, pos: { x: centerX, y: centerY + size } },  // Abajo
        { x: -1, y: 0, pos: { x: centerX - size, y: centerY } }, // Izquierda
        { x: 1, y: 0, pos: { x: centerX + size, y: centerY } }   // Derecha
    ];
    
    directions.forEach(dir => {
        const isActive = dir.x === aimDirection.x && dir.y === aimDirection.y;
        const pulsation = Math.sin(Date.now() / 200) * 0.3 + 0.7;
        
        // Color: azul brillante para seleccionado, azul más tenue para no seleccionado
        ctx.fillStyle = isActive ? `rgba(0, 150, 255, ${pulsation})` : 'rgba(100, 150, 200, 0.8)';
        
        // Tamaño: más grande para seleccionado
        const radius = isActive ? 12 : 8;
        
        // Dibujar círculo
        ctx.beginPath();
        ctx.arc(dir.pos.x, dir.pos.y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Borde más oscuro para mejor visibilidad
        ctx.strokeStyle = isActive ? 'rgba(0, 100, 200, 0.8)' : 'rgba(50, 100, 150, 0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
    
    // Texto de instrucciones (más abajo para no interferir)
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    
    // Mostrar qué poder está activo
    const powerNames = {
        'pickaxe': '🔨 Pico - Rompe paredes',
        'snowball': '❄️ Bola de Nieve - Congela enemigos'
    };
    
    if (activePower && powerNames[activePower]) {
        ctx.fillStyle = '#f39c12';
        ctx.font = '16px Arial';
        ctx.fillText(powerNames[activePower], centerX, centerY + size + 30);
    }
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.fillText('Usa flechas para apuntar', centerX, centerY + size + 50);
    ctx.fillText('ESPACIO para usar, ESC para cancelar', centerX, centerY + size + 70);
}

// Dibujar animaciones
function drawAnimations(ctx) {
    const deltaTime = 0.016; // ~60fps
    
    // Animaciones de rotura de pared
    if (window.breakAnimations) {
        window.breakAnimations = window.breakAnimations.filter(anim => {
            anim.time -= deltaTime;
            
            if (anim.time > 0) {
                const alpha = anim.time / anim.maxTime;
                const size = (1 - alpha) * 20;
                
                ctx.fillStyle = `rgba(255, 165, 0, ${alpha})`;
                ctx.fillRect(anim.x - size/2, anim.y - size/2, size, size);
                
                // Partículas
                for (let i = 0; i < 3; i++) {
                    const angle = (i / 3) * Math.PI * 2;
                    const dist = (1 - alpha) * 15;
                    const px = anim.x + Math.cos(angle) * dist;
                    const py = anim.y + Math.sin(angle) * dist;
                    
                    ctx.fillStyle = `rgba(200, 100, 0, ${alpha})`;
                    ctx.fillRect(px - 2, py - 2, 4, 4);
                }
                
                return true;
            }
            return false;
        });
    }
    
    // Animaciones de bola de nieve
    if (window.snowballAnimations) {
        window.snowballAnimations = window.snowballAnimations.filter(anim => {
            anim.time += deltaTime;
            anim.distance += deltaTime * 300; // Velocidad más rápida (era 100, ahora 300)
            
            if (anim.time < anim.maxTime && anim.distance < anim.maxDistance) {
                const x = anim.x + anim.dirX * anim.distance;
                const y = anim.y + anim.dirY * anim.distance;
                
                // Bola de nieve principal
                ctx.fillStyle = '#87ceeb';
                ctx.beginPath();
                ctx.arc(x, y, 6, 0, Math.PI * 2);
                ctx.fill();
                
                // Estela de nieve
                const trailLength = 3;
                for (let i = 1; i <= trailLength; i++) {
                    const trailX = x - anim.dirX * i * 8;
                    const trailY = y - anim.dirY * i * 8;
                    const alpha = (trailLength - i) / trailLength * 0.5;
                    
                    ctx.fillStyle = `rgba(135, 206, 235, ${alpha})`;
                    ctx.beginPath();
                    ctx.arc(trailX, trailY, 4 - i, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                return true;
            }
            return false;
        });
    }
    
    // Animaciones del aliado
    if (window.allyAnimations) {
        window.allyAnimations = window.allyAnimations.filter(anim => {
            anim.time += deltaTime;
            
            if (anim.time < anim.maxTime) {
                const alpha = 1 - (anim.time / anim.maxTime);
                const size = 20 + (1 - alpha) * 30;
                
                // Círculo verde expansivo
                ctx.strokeStyle = `rgba(0, 255, 0, ${alpha})`;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(anim.x, anim.y, size, 0, Math.PI * 2);
                ctx.stroke();
                
                // Partículas verdes
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const dist = size * 0.7;
                    const px = anim.x + Math.cos(angle) * dist;
                    const py = anim.y + Math.sin(angle) * dist;
                    
                    ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
                    ctx.beginPath();
                    ctx.arc(px, py, 3, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                return true;
            }
            return false;
        });
    }
}

// Loop principal del juego (simulado)
function startGameLoop() {
    let startTime = Date.now();
    const canvas = document.querySelector('canvas');
    
    function gameLoop() {
        const currentTime = Date.now();
        const deltaTime = (currentTime - startTime) / 1000;
        
        // Actualizar tiempo
        gameState.totalTime += deltaTime;
        gameState.levelTime += deltaTime;
        
        // Actualizar juego
        if (canvas) {
            updateGame(canvas);
        }
        
        // Actualizar HUD
        updateHUD();
        
        startTime = currentTime;
        requestAnimationFrame(gameLoop);
    }
    
    gameLoop();
}

// Actualizar HUD
function updateHUD() {
    // Actualizar nivel
    const levelElement = document.getElementById('currentLevel');
    if (levelElement) {
        levelElement.textContent = gameState.level;
    }
    
    // Actualizar tiempos
    const totalTimeElement = document.getElementById('totalTime');
    if (totalTimeElement) {
        totalTimeElement.textContent = formatTime(gameState.totalTime);
    }
    
    const levelTimeElement = document.getElementById('levelTime');
    if (levelTimeElement) {
        levelTimeElement.textContent = formatTime(gameState.levelTime);
    }
}

// Actualizar display de poderes
function updatePowerDisplay() {
    const pickaxeElement = document.getElementById('pickaxeCount');
    const snowballElement = document.getElementById('snowballCount');
    const allyElement = document.getElementById('allyCount');
    
    if (pickaxeElement) {
        pickaxeElement.textContent = gameState.powers.pickaxe;
    }
    if (snowballElement) {
        snowballElement.textContent = gameState.powers.snowball;
    }
    if (allyElement) {
        allyElement.textContent = gameState.powers.ally;
    }
}

// Formatear tiempo en MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Función para avanzar al siguiente nivel
function nextLevel() {
    // Verificar si se puede avanzar según la configuración
    if (gameConfig.progression && gameConfig.progression.endLevelEnabled) {
        if (gameState.level >= gameConfig.progression.endLevel) {
            console.log('🏁 Nivel final alcanzado, juego completado');
            return; // No avanzar más
        }
    }
    
    gameState.level++;
    gameState.levelTime = 0;
    gameWon = false;
    
    // Regenerar laberinto para el nuevo nivel
    calculateMazeSize();
    generateMaze();
    
    // Dar pico gratis según configuración
    if (gameConfig.powers && gameConfig.powers.pickaxe && gameConfig.powers.pickaxe.enabled) {
        if (gameState.level >= gameConfig.powers.pickaxe.startLevel) {
            gameState.powers.pickaxe = 1; // Solo 1 pico gratis por nivel
        }
    }
    
    updatePowerDisplay();
    console.log(`📈 Nivel ${gameState.level} alcanzado!`);
}

// Función para demostración manual (solo para testing)
function simulateLevelUp() {
    nextLevel();
}

// Funciones de configuración específicas
function getCurrentMazeSize() {
    if (!gameConfig.maze) return 9;
    
    const { minSize, maxSize, growthRate } = gameConfig.maze;
    const size = minSize + (gameState.level - 1) * growthRate;
    return Math.min(size, maxSize);
}

function shouldSpawnEnemies() {
    if (!gameConfig.enemies || !gameConfig.enemies.enabled) return false;
    return gameState.level >= gameConfig.enemies.startLevel;
}

function getComplexityLevel() {
    if (!gameConfig.complexity) return 0;
    
    if (gameState.level < gameConfig.complexity.startLevel) return 0;
    
    const levelDiff = gameState.level - gameConfig.complexity.startLevel;
    return Math.min(levelDiff / 10, 1); // Máximo 100% de complejidad
}

// Exportar funciones para uso externo
window.initMazeGame = initMazeGame;
window.simulateLevelUp = simulateLevelUp;
window.getCurrentMazeSize = getCurrentMazeSize;
window.shouldSpawnEnemies = shouldSpawnEnemies;
window.getComplexityLevel = getComplexityLevel;

// Demo automático DESHABILITADO - ahora el jugador debe completar niveles
// Para testing manual, usa: simulateLevelUp() en la consola
console.log('🎮 Demo iniciado - ¡Completa el laberinto para avanzar de nivel!');
console.log('💡 Tip: Usa simulateLevelUp() en la consola para testing manual'); 