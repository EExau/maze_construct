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
- **🛠️ DevTools Compatible**: F12 y herramientas de desarrollo totalmente funcionales
- **⚡ Optimizado**: Sin bloqueos, loops infinitos o errores críticos
- **🔒 100% Estable**: Todos los juegos generados funcionan perfectamente
- **🎯 Apuntado Visual**: Sistema de cruceta minimalista con círculos azules

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
- **Control**: Tecla `1` → Círculos azules aparecen → Flechas para seleccionar → Espacio
- **Visual**: El círculo de la dirección seleccionada pulsa en azul brillante
- **Estrategia**: Crea atajos o escapes de emergencia

### ❄️ Bola de Nieve  
- **Función**: Congela enemigos temporalmente
- **Control**: Tecla `2` → Apuntar con círculos azules → Espacio
- **Visual**: 4 círculos azules muestran direcciones disponibles
- **Estrategia**: Neutraliza amenazas a distancia

### 🤖 Aliado
- **Función**: Elimina enemigo más cercano
- **Control**: Tecla `3` (uso inmediato, sin apuntado)
- **Visual**: Efecto inmediato sin interfaz de apuntado
- **Estrategia**: Limpia el camino hacia la meta

## 🏗️ Arquitectura Técnica

### Stack Tecnológico
- **Motor**: [LittleJS](https://github.com/KilledByAPixel/LittleJS) - Motor de juegos 2D ultraligero
- **Audio**: ZzFX - Generación procedural de sonidos
- **Frontend**: Vanilla JavaScript ES6+
- **Empaquetado**: JSZip para descarga de juegos

### 🔧 Mejoras Técnicas v2.3
- **Protección de Variables**: Try/catch para todas las asignaciones del motor
- **Algoritmo Iterativo**: Generación de laberintos sin recursión
- **Parche Anti-Bloqueo**: Eventos selectivos para DevTools
- **Optimización de Rendimiento**: Actualizaciones escalonadas (enemigos cada 3 frames)
- **Timeouts de Seguridad**: Límites temporales para prevenir loops infinitos
- **CSS Optimizado**: Estilos que permiten herramientas de desarrollo
- **Interfaz de Apuntado**: Sistema visual minimalista con 4 círculos azules

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

### 🐛 Problemas Resueltos en v2.3
- ✅ **"Assignment to constant variable"**: Error crítico eliminado
- ✅ **DevTools bloqueadas**: F12 y clic derecho funcionan perfectamente
- ✅ **Loops infinitos**: Algoritmo iterativo con timeouts de seguridad
- ✅ **Juegos que no cargan**: Inicialización robusta implementada
- ✅ **Rendimiento lento**: Optimizaciones de CPU y memoria aplicadas
- ✅ **Interfaz confusa**: Sistema de apuntado simplificado y más claro

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

> 📋 **Ver historial completo**: [HISTORIAL_VERSIONES.md](HISTORIAL_VERSIONES.md)

### v2.3 (Actual) - Interfaz de Apuntado Optimizada ⭐
**Fecha**: Junio 2025
- 🎯 **Sistema de apuntado rediseñado**: Solo 4 círculos azules, sin cruceta confusa
- 🎨 **Colores optimizados**: Azul brillante pulsante para seleccionado, azul tenue para no seleccionado
- 📐 **Posicionamiento mejorado**: Círculos más separados (40px) y tamaños variables
- 🧹 **Interfaz limpia**: Eliminado fondo gris, líneas rojas y punto central
- ✨ **Experiencia mejorada**: Apuntado más intuitivo y menos confuso
- 🔧 **Consistencia**: Mismo comportamiento en todos los motores de juego

### v2.2 - Estabilidad Total y Compatibilidad Completa
**Fecha**: Junio 2025
- 🛠️ **Corrección crítica**: Error "Assignment to constant variable" eliminado
- 🔧 **Protección robusta**: Try/catch para todas las variables del motor LittleJS
- 🚀 **DevTools completamente funcionales**: F12, clic derecho y herramientas de desarrollo
- ⚡ **Optimizaciones de rendimiento**: Actualizaciones escalonadas, límite de enemigos
- 🎯 **Parche anti-bloqueo**: CSS y eventos optimizados para compatibilidad total
- 🏗️ **Algoritmo iterativo**: Generación de laberintos sin recursión ni stack overflow
- 📚 **Documentación completa**: Guía técnica y de usuario detallada
- 🔒 **Timeouts de seguridad**: Prevención de loops infinitos con límites temporales
- 🎮 **Configuración balanceada**: Basada en el patrón exitoso de demo_6
- ✅ **100% estable**: Juegos generados funcionan sin errores

### v2.1 - Mejoras de Funcionalidad
**Fecha**: Junio 2025
- ✅ **Error de sintaxis corregido**: Problemas de JavaScript resueltos
- 🎮 **Inicialización mejorada**: LittleJS más robusto y confiable
- 📦 **Sistema de descarga**: Exportación completa en formato ZIP
- 🔊 **Audio integrado**: Sistema ZzFX funcionando correctamente

### v2.0 - Constructor Visual Completo
**Fecha**: Junio 2025
- 🎨 **Interfaz visual completa**: Constructor drag-and-drop intuitivo
- ⚙️ **Sistema de configuración avanzado**: Control total de parámetros
- 🎯 **Presets predefinidos**: Configuraciones Fácil, Normal, Difícil, Extremo
- 📱 **Diseño responsive**: Compatible con diferentes resoluciones
- 🎮 **Vista previa en tiempo real**: Cambios visibles instantáneamente

### v1.0 - Versión Inicial (Prototipo)
**Fecha**: Junio 2025
- 🛠️ **Constructor básico**: Funcionalidad mínima viable
- 🎮 **Generación simple**: Juegos básicos de laberinto
- 🏗️ **Fundación técnica**: Estructura base del proyecto 
