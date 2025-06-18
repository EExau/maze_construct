# 🛠️ Constructor de Juegos de Laberinto

**Un constructor visual completo para crear juegos de laberinto personalizados usando LittleJS**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![LittleJS](https://img.shields.io/badge/Engine-LittleJS-green.svg)](https://github.com/KilledByAPixel/LittleJS)

## 🎮 ¿Qué es esto?

Un **constructor visual intuitivo** que permite crear juegos completos de laberinto sin necesidad de programar. Simplemente configura los parámetros, personaliza la dificultad y descarga tu juego listo para jugar.

### ✨ Características Principales

- **🎨 Interface Visual**: Constructor drag-and-drop sin código
- **⚙️ Altamente Configurable**: Controla cada aspecto del gameplay
- **📦 Descarga Completa**: Genera juegos ejecutables en ZIP
- **🎯 Sistema de Poderes**: Pico, bolas de nieve, aliados
- **👾 IA de Enemigos**: Comportamiento configurable y realista
- **🔊 Audio Integrado**: Sistema de sonidos ZzFX incorporado
- **📱 Responsive**: Funciona en desktop y móvil
- **🚀 Sin Dependencias**: Juegos generados funcionan offline

## 🚀 Demo en Vivo

## 🛠️ Instalación y Uso

### Opción 1: Uso Directo (Recomendado)
```bash
git clone https://github.com/tu-usuario/maze-constructor.git
cd maze-constructor/maze_construct
# Abrir index.html en tu navegador  (se recomienda abrirlo sobre un servidor o servidor local)
```

### Opción 2: Servidor Local
```bash
git clone https://github.com/tu-usuario/maze-constructor.git
cd maze-constructor/maze_construct
python -m http.server 8080
# Ir a http://localhost:8080
```

## 📋 Guía Rápida

### 1. **Configurar el Juego**
- Ajusta velocidad del jugador y escala de cámara
- Define tamaños de laberinto (mínimo → máximo)
- Configura poderes disponibles y probabilidades

### 2. **Personalizar Dificultad**
- **😊 Fácil**: Sin enemigos, laberintos pequeños
- **😐 Normal**: Balance perfecto para todos
- **😰 Difícil**: Para jugadores experimentados  
- **💀 Extremo**: Máximo desafío

### 3. **Generar y Descargar**
- Clic en **"🚀 Construir Juego"**
- Descarga automática en ZIP
- ¡Juego listo para compartir!

## ⚙️ Configuraciones Disponibles

| Categoría | Opciones | Descripción |
|-----------|----------|-------------|
| **🎮 Gameplay** | Velocidad, Cámara | Mecánicas básicas del juego |
| **📏 Laberinto** | Tamaño, Crecimiento | Progresión de dificultad |
| **🎯 Poderes** | Pico, Bola de Nieve, Aliado | Herramientas del jugador |
| **👾 Enemigos** | IA, Movimiento, Spawn | Comportamiento de oponentes |
| **🧩 Complejidad** | Callejones, Rutas Falsas | Dificultad del laberinto |

## 🎯 Poderes del Juego

### 🔨 Pico
- **Función**: Rompe paredes adyacentes
- **Control**: Tecla `1` + Flechas + Espacio
- **Estrategia**: Crea atajos o escapes de emergencia

### ❄️ Bola de Nieve  
- **Función**: Congela enemigos temporalmente
- **Control**: Tecla `2` + Apuntar + Espacio
- **Estrategia**: Neutraliza amenazas a distancia

### 🤖 Aliado
- **Función**: Elimina enemigo más cercano
- **Control**: Tecla `3` (uso inmediato)
- **Estrategia**: Limpia el camino hacia la meta

## 🏗️ Arquitectura Técnica

### Stack Tecnológico
- **Motor**: [LittleJS](https://github.com/KilledByAPixel/LittleJS) - Motor de juegos 2D ultraligero
- **Audio**: ZzFX - Generación procedural de sonidos
- **Frontend**: Vanilla JavaScript ES6+
- **Empaquetado**: JSZip para descarga de juegos

### Estructura del Proyecto
```
maze_construct/
├── index.html          # Constructor principal
├── js/
│   ├── constructor.js  # Lógica del constructor
│   ├── game_builder.js # Generador de juegos ⭐
│   ├── game_engine.js  # Motor de demo
│   └── maze_sounds.js  # Sistema de audio
├── css/               # Estilos del constructor
├── assets/           # Recursos (tiles, etc.)
├── configs/          # Presets predefinidos
```

### 🐛 Reportar Bugs
- Usa el [sistema de issues](../../issues)
- Incluye pasos para reproducir
- Especifica navegador y OS

### ✨ Nuevas Características
- Fork el repositorio
- Crea una rama: `git checkout -b feature/nueva-caracteristica`
- Commit: `git commit -m 'Añadir nueva característica'`
- Push: `git push origin feature/nueva-caracteristica`
- Abre un Pull Request

### 🎨 Ideas de Contribución
- **Nuevos poderes**: Teletransporte, invisibilidad, etc.
- **Temas visuales**: Diferentes estilos de tiles
- **Modos de juego**: Tiempo límite, coleccionables, etc.
- **Mejoras de UI**: Animaciones, efectos visuales
- **Optimizaciones**: Rendimiento, tamaño de archivo

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver [LICENSE](LICENSE) para detalles.

### Reconocimientos
- **[LittleJS](https://github.com/KilledByAPixel/LittleJS)** por Frank Force - Motor base
- **[ZzFX](https://github.com/KilledByAPixel/ZzFX)** - Sistema de audio
- **Comunidad JavaScript** - Inspiración y recursos

---

## 🔄 Changelog

### v2.2 (Actual) - Juegos 100% Estables
- ✅ **Errores críticos eliminados**: Sin loops infinitos
- ✅ **Algoritmo iterativo**: Generación de laberinto sin recursión  
- ✅ **DevTools accesible**: Sin bloqueos del navegador
- ✅ **UI optimizada**: Diseño profesional sin bordes azules
- ✅ **Avance de nivel correcto**: Sin lag entre niveles

### v2.1 - Corrección de Errores
- ✅ Error de sintaxis JavaScript corregido
- 🎮 Inicialización robusta de LittleJS
- 📦 Descarga como ZIP implementada

### v2.0 - Constructor Visual
- 🎨 Interface visual completa
- ⚙️ Sistema de configuración avanzado  
- 🎯 Presets predefinidos (Fácil → Extremo)

### v1.0 - Versión Inicial
- 🛠️ Constructor básico funcional
- 🎮 Generación de juegos simples 
