# Documentación Técnica - Constructor de Laberintos

## 📋 Índice
1. [Resumen del Proyecto](#resumen-del-proyecto)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Componentes Principales](#componentes-principales)
4. [Flujo de Generación](#flujo-de-generación)
5. [Optimizaciones Implementadas](#optimizaciones-implementadas)
6. [API y Configuración](#api-y-configuración)
7. [Resolución de Problemas](#resolución-de-problemas)
8. [Desarrollo y Contribución](#desarrollo-y-contribución)

---

## 🎯 Resumen del Proyecto

El **Constructor de Laberintos** es una herramienta web que permite generar juegos de laberintos personalizables de forma automática. Utiliza **LittleJS** como motor de juego y genera archivos HTML5 completamente autónomos.

### Características Principales
- ✅ Generación automática de juegos completos
- ✅ Configuración visual mediante interfaz web
- ✅ Juegos autónomos (no requieren servidor)
- ✅ Compatibilidad total con herramientas de desarrollo
- ✅ Optimizado para rendimiento y estabilidad
- ✅ Sistema de sonidos integrado (ZzFX)
- ✅ Interfaz de apuntado optimizada y minimalista

---

## 🏗️ Arquitectura del Sistema

### Estructura de Archivos
```
maze_construct/
├── index.html              # Interfaz principal del constructor
├── game.html               # Vista previa del juego
├── js/
│   ├── constructor.js      # Lógica de la interfaz
│   ├── game_builder.js     # Motor de generación de juegos
│   ├── game_engine.js      # Motor del juego de vista previa
│   ├── tiles.js           # Manejo de texturas
│   ├── maze_sounds.js     # Sistema de sonidos
│   └── littlejs/          # Motor de juego LittleJS
├── css/
│   ├── constructor.css    # Estilos del constructor
│   └── game.css          # Estilos del juego
├── assets/
│   └── tiles.png         # Texturas del juego
├── configs/              # Configuraciones predefinidas
│   ├── easy.json
│   ├── normal.json
│   ├── hard.json
│   └── extreme.json
└── output/              # Juegos generados (ignorado por git)
```

### Tecnologías Utilizadas
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Motor de Juego**: LittleJS (WebGL/Canvas)
- **Audio**: ZzFX (generación procedural de sonidos)
- **Algoritmos**: Generación procedural de laberintos
- **Formato de Salida**: Archivos HTML5 autónomos

---

## 🔧 Componentes Principales

### 1. Constructor de Interfaz (`js/constructor.js`)
**Responsabilidad**: Manejo de la interfaz de usuario del constructor

**Funciones Principales**:
- `updatePreview()`: Actualiza vista previa en tiempo real
- `loadConfig()`: Carga configuraciones predefinidas
- `validateConfig()`: Valida parámetros de configuración
- `exportConfig()`: Exporta configuración personalizada

**Eventos Manejados**:
- Cambios en controles deslizantes
- Selección de configuraciones predefinidas
- Validación en tiempo real
- Generación de juegos

### 2. Motor de Generación (`js/game_builder.js`)
**Responsabilidad**: Generación automática de juegos completos

**Funciones Principales**:
```javascript
async function generateGameFiles(gameName, config)
// Genera todos los archivos del juego

function generateGameHTML(gameName, config)
// Crea el archivo HTML principal

function generateGameEngine(config)
// Genera el motor de juego personalizado

function generateGameCSS()
// Crea los estilos del juego
```

**Características Técnicas**:
- Generación asíncrona de archivos
- Validación automática de configuraciones
- Optimizaciones anti-bloqueo integradas
- Manejo de errores robusto

### 3. Motor de Juego (`generateGameEngine()`)
**Responsabilidad**: Lógica principal del juego generado

**Funciones del Motor**:
```javascript
function gameInit()           // Inicialización del juego
function gameUpdate()         // Actualización por frame
function gameRender()         // Renderizado
function gameUpdatePost()     // Post-procesamiento
function gameRenderPost()     // Post-renderizado
```

**Sistemas Integrados**:
- **Sistema de Movimiento**: Control del jugador con WASD/Flechas
- **Sistema de Poderes**: Pico, Bola de Nieve, Aliado
- **Sistema de Enemigos**: IA básica con congelamiento
- **Sistema de Progresión**: Niveles con dificultad creciente
- **Sistema de Audio**: Efectos de sonido procedurales
- **Sistema de Apuntado**: Cruceta visual minimalista con 4 círculos azules

### 4. Generador de Laberintos
**Algoritmo**: Búsqueda en profundidad iterativa (no recursiva)

**Características**:
- Prevención de stack overflow
- Límites de tiempo de ejecución
- Fallback a laberintos simples
- Validación de conectividad

```javascript
function generateMazeIterative() {
    const stack = [{x: 1, y: 1}];
    const visited = new Set();
    let iterations = 0;
    const maxIterations = size * size * 2;
    
    while (stack.length > 0 && iterations < maxIterations) {
        // Algoritmo de generación seguro
    }
}
```

---

## ⚡ Optimizaciones Implementadas

### 1. Optimizaciones de Rendimiento
```javascript
// Actualizaciones escalonadas
const frameCount = Math.floor(time * 60);
if (frameCount % 3 === 0) {
    // Actualizar enemigos cada 3 frames
}

// Límites de entidades
const maxEnemigos = Math.min(enemigos.length, 5);

// Configuración de FPS
try { 
    if (typeof frameRate !== 'undefined') frameRate = 60; 
} catch(e) {}
```

### 2. Prevención de Bloqueos
```javascript
// Protección contra variables constantes
try { 
    if (typeof gravity !== 'undefined') gravity = 0; 
} catch(e) {}

// Timeouts de seguridad
const maxIterations = size * size * 2;
if (Date.now() - startTime > 100) {
    throw new Error('Timeout');
}
```

### 3. Compatibilidad con DevTools
```javascript
// Parche ligero para herramientas de desarrollo
document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.stopImmediatePropagation();
        return true;
    }
}, true);

// CSS anti-bloqueo
setTimeout(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
        canvas.style.pointerEvents = 'auto';
        canvas.style.userSelect = 'text';
    }
}, 3000);
```

---

## 📊 API y Configuración

### Estructura de Configuración
```json
{
  "gameplay": {
    "playerSpeed": 160,
    "cameraScale": 2
  },
  "maze": {
    "minSize": 9,
    "maxSize": 31,
    "growthRate": 2
  },
  "powers": {
    "pickaxe": {
      "enabled": true,
      "startLevel": 1
    },
    "snowball": {
      "enabled": true,
      "probability": 0.8
    },
    "ally": {
      "enabled": true,
      "probability": 0.1
    }
  },
  "enemies": {
    "enabled": true,
    "startLevel": 5,
    "moveInterval": 0.6,
    "moveChance": 0.9
  },
  "progression": {
    "endLevelEnabled": true,
    "endLevel": 10,
    "infiniteMode": false
  }
}
```

### Parámetros de Configuración

#### Gameplay
- `playerSpeed`: Velocidad del jugador (píxeles/segundo)
- `cameraScale`: Escala de la cámara (1-8)

#### Maze
- `minSize`: Tamaño mínimo del laberinto (impar, 5-31)
- `maxSize`: Tamaño máximo del laberinto (impar, 5-31)
- `growthRate`: Crecimiento por nivel (1-5)

#### Powers
- `enabled`: Activar/desactivar poder
- `startLevel`: Nivel de inicio (pickaxe)
- `probability`: Probabilidad de aparición (0.0-1.0)

#### Enemies
- `enabled`: Activar/desactivar enemigos
- `startLevel`: Nivel de aparición de enemigos
- `moveInterval`: Intervalo de movimiento (segundos)
- `moveChance`: Probabilidad de movimiento (0.0-1.0)

---

## 🔍 Resolución de Problemas

### Problemas Comunes y Soluciones

#### 1. Error "Assignment to constant variable"
**Causa**: Intento de modificar variables constantes de LittleJS
**Solución**: Usar bloques try/catch para configuraciones del motor
```javascript
try { 
    if (typeof objectMaxSpeed !== 'undefined') objectMaxSpeed = 1000; 
} catch(e) {}
```

#### 2. Juego no se renderiza
**Causa**: Doble inicialización o problemas con texturas
**Solución**: 
- Verificar que solo se llame `engineInit()` una vez
- Usar array para texturas: `['tiles.png']` no `'tiles.png'`

#### 3. DevTools bloqueadas
**Causa**: LittleJS captura eventos del navegador
**Solución**: Aplicar parche ligero con interceptación selectiva

#### 4. Rendimiento lento
**Causa**: Demasiadas entidades o laberintos muy grandes
**Solución**: 
- Limitar enemigos a máximo 5
- Máximo tamaño de laberinto 31x31
- Actualizaciones escalonadas

### Debugging
```javascript
// Habilitar logs de debug
console.log('🎮 Estado del juego:', gameState);
console.log('🏗️ Laberinto:', mazeData.length + 'x' + mazeData[0].length);
console.log('👹 Enemigos:', enemigos.length);
console.log('⚡ Poderes:', poderes);
```

---

## 🚀 Desarrollo y Contribución

### Configuración del Entorno
1. Clonar el repositorio
2. Abrir `index.html` en un navegador moderno
3. No requiere servidor web (funciona con file://)

### Estructura de Desarrollo
```javascript
// Patrón de módulos
const GameBuilder = {
    generateGameFiles: async function(name, config) { /* ... */ },
    validateConfig: function(config) { /* ... */ },
    // ...
};
```

### Convenciones de Código
- **Funciones**: camelCase (`generateGameFiles`)
- **Constantes**: UPPER_CASE (`TILE_SIZE`)
- **Variables**: camelCase (`jugadorPos`)
- **Comentarios**: Español con emojis para secciones

### Testing
```javascript
// Configuración de prueba
const testConfig = {
    gameplay: { playerSpeed: 160, cameraScale: 2 },
    maze: { minSize: 9, maxSize: 15, growthRate: 2 },
    // ...
};

// Generar juego de prueba
await generateGameFiles('test_game', testConfig);
```

### Extensiones Futuras
- [ ] Editor visual de laberintos
- [ ] Más tipos de enemigos
- [ ] Sistema de puntuación
- [ ] Multijugador local
- [ ] Exportación a diferentes formatos
- [ ] Temas visuales personalizables

---

## 📝 Notas Adicionales

### Compatibilidad
- **Navegadores**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Dispositivos**: Desktop, tablets (controles táctiles limitados)
- **Resoluciones**: 1024x768 mínimo recomendado

### Rendimiento
- **Memoria**: ~50MB por juego generado
- **CPU**: Optimizado para 60 FPS en hardware moderno
- **Almacenamiento**: ~2MB por juego generado

### Licencias
- **LittleJS**: Zlib License
- **ZzFX**: MIT License
- **Proyecto**: [Especificar licencia del proyecto]

---

*Documentación actualizada: Junio 2025*
*Versión del Constructor: 2.3*