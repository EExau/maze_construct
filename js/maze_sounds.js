// Librería de Sonidos para Juegos de Laberinto
// Compatible con LittleJS - Para usar en proyectos reales
// 
// Uso:
// 1. Importar este archivo en tu proyecto LittleJS
// 2. Llamar initMazeSounds() después de engineInit()
// 3. Usar playMazeSound('nombre') para reproducir sonidos

let mazeSounds = {};

// Inicializar sonidos del laberinto
function initMazeSounds() {
    if (typeof Sound === 'undefined') {
        console.warn('⚠️ LittleJS Sound no disponible. Asegúrate de importar LittleJS primero.');
        return false;
    }
    
    try {
        mazeSounds = {
            meta: new Sound([,,539,0,.04,.29,1,1.92,,,567,.02,.02,,,,.04]), // ✨ Llegar a la meta
            enemigo: new Sound([,,925,.04,.3,.6,1,.3,,6.27,-184,.09,.17]), // 🥊 Enemigo toca al jugador
            pico: new Sound([,,471,,.09,.47,4,1.06,-6.7,,,,,.9,61,.1,,.82,.1]), // ⚡ Usar pico
            lanzar: new Sound([,,150,.05,,.05,,1.3,,,,,,3]), // 🏌️ Lanzar bola/aliado
            colision: new Sound([,,1675,,.06,.24,1,1.82,,,837,.06]), // 💰 Aliado elimina enemigo
            congelar: new Sound([,.2,40,.5,,1.5,,11,,,,,,199]), // 🌊 Enemigo congelado
            
            // Sonidos adicionales opcionales
            paso: new Sound([,,100,.01,,.01,,1,,,,,,,1]), // 👣 Paso del jugador
            recogido: new Sound([,,300,.02,,.1,,1.5,,,,,,,1]), // 📦 Recoger poder
            error: new Sound([,,200,.01,,.02,,2,,,,,,,1]) // ❌ Acción inválida
        };
        
        console.log('🔊 Sonidos de laberinto inicializados correctamente');
        return true;
    } catch (error) {
        console.error('❌ Error al inicializar sonidos:', error);
        return false;
    }
}

// Reproducir sonido específico
function playMazeSound(soundName, volume = 1) {
    if (!mazeSounds[soundName]) {
        console.warn(`⚠️ Sonido '${soundName}' no encontrado`);
        return false;
    }
    
    try {
        mazeSounds[soundName].play(volume);
        return true;
    } catch (error) {
        console.error(`❌ Error al reproducir sonido '${soundName}':`, error);
        return false;
    }
}

// Verificar si los sonidos están disponibles
function areMazeSoundsReady() {
    return Object.keys(mazeSounds).length > 0;
}

// Obtener lista de sonidos disponibles
function getMazeSoundList() {
    return Object.keys(mazeSounds);
}

// Exportar funciones para uso externo
if (typeof module !== 'undefined' && module.exports) {
    // Node.js
    module.exports = {
        initMazeSounds,
        playMazeSound,
        areMazeSoundsReady,
        getMazeSoundList
    };
} else if (typeof window !== 'undefined') {
    // Browser
    window.initMazeSounds = initMazeSounds;
    window.playMazeSound = playMazeSound;
    window.areMazeSoundsReady = areMazeSoundsReady;
    window.getMazeSoundList = getMazeSoundList;
}

// Ejemplo de uso en un proyecto LittleJS:
/*
// En tu archivo principal del juego:

// 1. Importar después de LittleJS
// <script src="maze_sounds.js"></script>

// 2. Inicializar en gameInit()
function gameInit() {
    // Tu código de inicialización...
    
    // Inicializar sonidos del laberinto
    initMazeSounds();
}

// 3. Usar en tu código
function playerReachGoal() {
    playMazeSound('meta'); // Reproducir sonido de meta
}

function playerHitEnemy() {
    playMazeSound('enemigo'); // Reproducir sonido de enemigo
}

function usePickaxe() {
    playMazeSound('pico'); // Reproducir sonido de pico
}

function throwSnowball() {
    playMazeSound('lanzar'); // Reproducir sonido de lanzar
}

function allyKillsEnemy() {
    playMazeSound('colision'); // Reproducir sonido de colisión
}

function freezeEnemy() {
    playMazeSound('congelar'); // Reproducir sonido de congelar
}
*/ 