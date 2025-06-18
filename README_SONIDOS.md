# 🔊 Librería de Sonidos para Juegos de Laberinto

Esta librería proporciona sonidos auténticos para juegos de laberinto creados con LittleJS, basados en el juego maze original.

## 📁 Archivos

- `maze_sounds.js` - Librería principal de sonidos
- `game_engine.js` - Motor del juego que usa los sonidos
- `README_SONIDOS.md` - Esta documentación

## 🚀 Uso Rápido

### 1. Integración Básica

```html
<!DOCTYPE html>
<html>
<head>
    <title>Mi Juego de Laberinto</title>
</head>
<body>
    <!-- Importar LittleJS primero -->
    <script src="littlejs.js"></script>
    
    <!-- Importar la librería de sonidos -->
    <script src="maze_sounds.js"></script>
    
    <!-- Tu código del juego -->
    <script src="mi_juego.js"></script>
</body>
</html>
```

### 2. Inicialización en tu Juego

```javascript
function gameInit() {
    // Tu código de inicialización del juego...
    
    // Inicializar sonidos del laberinto
    if (initMazeSounds()) {
        console.log('Sonidos listos!');
    } else {
        console.log('Error al cargar sonidos');
    }
}

// Llamar engineInit con tu gameInit
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost);
```

### 3. Reproducir Sonidos

```javascript
// Ejemplos de uso en tu juego:

// Cuando el jugador llega a la meta
function playerReachGoal() {
    playMazeSound('meta');
    // Tu lógica de victoria...
}

// Cuando el jugador toca un enemigo
function playerHitEnemy() {
    playMazeSound('enemigo');
    // Tu lógica de daño...
}

// Cuando se usa el pico
function usePickaxe() {
    playMazeSound('pico');
    // Tu lógica de romper paredes...
}

// Cuando se lanza una bola de nieve
function throwSnowball() {
    playMazeSound('lanzar');
    // Tu lógica de proyectil...
}

// Cuando el aliado elimina un enemigo
function allyKillsEnemy() {
    playMazeSound('colision');
    // Tu lógica de eliminación...
}

// Cuando se congela un enemigo
function freezeEnemy() {
    playMazeSound('congelar');
    // Tu lógica de congelamiento...
}
```

## 🎵 Sonidos Disponibles

| Nombre | Descripción | Cuándo Usar |
|--------|-------------|-------------|
| `meta` | ✨ Llegar a la meta | Cuando el jugador completa el nivel |
| `enemigo` | 🥊 Enemigo toca al jugador | Cuando el jugador recibe daño |
| `pico` | ⚡ Usar pico | Cuando se rompe una pared |
| `lanzar` | 🏌️ Lanzar proyectil | Cuando se dispara bola de nieve o aliado |
| `colision` | 💰 Aliado elimina enemigo | Cuando el aliado mata un enemigo |
| `congelar` | 🌊 Enemigo congelado | Cuando un enemigo se congela |
| `paso` | 👣 Paso del jugador | Opcional: movimiento del jugador |
| `recogido` | 📦 Recoger poder | Cuando se recoge un power-up |
| `error` | ❌ Acción inválida | Cuando una acción no es posible |

## 🔧 API Completa

### `initMazeSounds()`
Inicializa todos los sonidos. Debe llamarse después de que LittleJS esté cargado.

**Retorna:** `true` si los sonidos se inicializaron correctamente, `false` en caso de error.

```javascript
if (initMazeSounds()) {
    console.log('Sonidos listos');
} else {
    console.log('Error al cargar sonidos');
}
```

### `playMazeSound(soundName, volume = 1)`
Reproduce un sonido específico.

**Parámetros:**
- `soundName` (string): Nombre del sonido a reproducir
- `volume` (number, opcional): Volumen de 0 a 1 (por defecto 1)

**Retorna:** `true` si el sonido se reprodujo, `false` si hubo error.

```javascript
// Reproducir a volumen normal
playMazeSound('meta');

// Reproducir a medio volumen
playMazeSound('enemigo', 0.5);
```

### `areMazeSoundsReady()`
Verifica si los sonidos están inicializados y listos para usar.

**Retorna:** `true` si están listos, `false` si no.

```javascript
if (areMazeSoundsReady()) {
    playMazeSound('meta');
} else {
    console.log('Sonidos no están listos');
}
```

### `getMazeSoundList()`
Obtiene la lista de todos los sonidos disponibles.

**Retorna:** Array con los nombres de los sonidos.

```javascript
const availableSounds = getMazeSoundList();
console.log('Sonidos disponibles:', availableSounds);
// Output: ['meta', 'enemigo', 'pico', 'lanzar', 'colision', 'congelar', 'paso', 'recogido', 'error']
```

## 🎮 Ejemplo Completo

```javascript
// mi_juego.js
let player, enemies = [];

function gameInit() {
    // Inicializar sonidos
    initMazeSounds();
    
    // Crear jugador
    player = new EngineObject(vec2(0, 0));
    
    // Crear enemigos
    for (let i = 0; i < 3; i++) {
        enemies.push(new EngineObject(vec2(i * 5, 0)));
    }
}

function gameUpdate() {
    // Verificar si el jugador llegó a la meta
    if (player.pos.distance(vec2(10, 10)) < 1) {
        playMazeSound('meta');
        // Lógica de victoria
    }
    
    // Verificar colisiones con enemigos
    enemies.forEach(enemy => {
        if (player.pos.distance(enemy.pos) < 1) {
            playMazeSound('enemigo');
            // Lógica de daño
        }
    });
}

function gameRender() {
    // Tu código de renderizado...
}

// Inicializar LittleJS
engineInit(gameInit, gameUpdate, undefined, gameRender);
```

## 🛠️ Solución de Problemas

### Los sonidos no se reproducen
1. **Verifica que LittleJS esté cargado primero**
   ```javascript
   if (typeof Sound === 'undefined') {
       console.error('LittleJS no está cargado');
   }
   ```

2. **Verifica que los sonidos estén inicializados**
   ```javascript
   if (!areMazeSoundsReady()) {
       console.error('Sonidos no inicializados');
       initMazeSounds();
   }
   ```

3. **Verifica el nombre del sonido**
   ```javascript
   const validSounds = getMazeSoundList();
   if (!validSounds.includes('mi_sonido')) {
       console.error('Sonido no válido');
   }
   ```

### Error "Sound is not defined"
Asegúrate de importar LittleJS antes que la librería de sonidos:
```html
<!-- ✅ Correcto -->
<script src="littlejs.js"></script>
<script src="maze_sounds.js"></script>

<!-- ❌ Incorrecto -->
<script src="maze_sounds.js"></script>
<script src="littlejs.js"></script>
```

## 📄 Licencia

Esta librería está basada en los sonidos del juego maze original de LittleJS y sigue la misma licencia MIT.

## 🤝 Contribuir

Si encuentras bugs o quieres añadir más sonidos, siéntete libre de contribuir al proyecto. 