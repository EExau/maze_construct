# 🎮 Guía de Usuario - Constructor de Laberintos

## 🚀 Inicio Rápido

### 1. Abrir el Constructor
- Abre `index.html` en tu navegador
- No necesitas servidor web, funciona directamente desde el archivo

### 2. Configurar tu Juego
- Usa los controles deslizantes para ajustar la dificultad
- Selecciona una configuración predefinida (Fácil, Normal, Difícil, Extremo)
- O personaliza todos los parámetros manualmente

### 3. Generar el Juego
- Escribe un nombre para tu juego
- Haz clic en "Generar Juego"
- Los archivos se guardan automáticamente en la carpeta `output/`

### 4. Jugar
- Abre el archivo `index.html` dentro de la carpeta de tu juego
- ¡Disfruta tu laberinto personalizado!

---

## 🎯 Controles del Juego

### Movimiento
- **Flechas** o **WASD**: Mover al jugador
- El jugador es el **cuadrado verde**
- La meta es el **cuadrado amarillo**

### Poderes
- **Tecla 1**: Usar Pico (romper paredes)
- **Tecla 2**: Usar Bola de Nieve (congelar enemigos)
- **Tecla 3**: Usar Aliado (ayuda temporal)

### Usar Poderes
1. Presiona la tecla del poder (1, 2, o 3)
2. Aparecerán **4 círculos azules** alrededor del jugador
3. Usa las **flechas** para seleccionar dirección (el círculo pulsará en azul brillante)
4. Presiona **Espacio** para activar el poder
5. Presiona **Escape** para cancelar

### Otros Controles
- **F12**: Abrir herramientas de desarrollo
- **Clic derecho**: Menú contextual del navegador
- **F11**: Pantalla completa (en algunos navegadores)

---

## ⚙️ Configuraciones

### 🎮 Jugabilidad
- **Velocidad del Jugador**: Qué tan rápido se mueve (80-240)
- **Escala de Cámara**: Qué tan cerca/lejos se ve (1-8)

### 🏗️ Laberinto
- **Tamaño Mínimo**: Tamaño inicial del laberinto (5-31)
- **Tamaño Máximo**: Tamaño máximo que puede alcanzar (5-31)
- **Crecimiento**: Cuánto crece el laberinto por nivel (1-5)

### ⚡ Poderes
- **Pico**: Rompe paredes, disponible desde el nivel que elijas
- **Bola de Nieve**: Congela enemigos, aparece aleatoriamente
- **Aliado**: Te ayuda temporalmente, muy raro de encontrar

### 👹 Enemigos
- **Activar/Desactivar**: Si quieres enemigos en tu juego
- **Nivel de Inicio**: En qué nivel aparecen por primera vez
- **Velocidad**: Qué tan seguido se mueven
- **Agresividad**: Probabilidad de que se muevan hacia ti

### 🏁 Progresión
- **Nivel Final**: En qué nivel termina el juego (o infinito)
- **Modo Infinito**: El juego nunca termina, niveles infinitos

---

## 📋 Configuraciones Predefinidas

### 🟢 Fácil
- Laberintos pequeños (5-13)
- Sin enemigos
- Muchos poderes
- Perfecto para principiantes

### 🟡 Normal
- Laberintos medianos (9-15)
- Enemigos desde nivel 3
- Poderes balanceados
- Experiencia estándar

### 🟠 Difícil
- Laberintos grandes (13-25)
- Enemigos desde nivel 2
- Menos poderes
- Para jugadores experimentados

### 🔴 Extremo
- Laberintos enormes (21-31)
- Enemigos desde nivel 1
- Poderes muy raros
- ¡Solo para expertos!

---

## 🎨 Personalización Avanzada

### Crear Configuración Personalizada
1. Ajusta todos los parámetros a tu gusto
2. Haz clic en "Exportar Configuración"
3. Guarda el archivo JSON
4. Puedes importarlo más tarde con "Cargar Configuración"

### Modificar Juegos Existentes
- Los juegos generados son archivos HTML independientes
- Puedes editarlos manualmente si sabes programar
- Cada juego incluye toda su configuración en el código

### Compartir Juegos
- Simplemente comparte la carpeta completa del juego
- O comprime la carpeta en un ZIP
- Los juegos funcionan en cualquier navegador moderno

---

## 🔧 Solución de Problemas

### El juego no se ve
- **Causa**: Error en la configuración
- **Solución**: Prueba con una configuración predefinida

### El juego va muy lento
- **Causa**: Laberinto demasiado grande o muchos enemigos
- **Solución**: Reduce el tamaño máximo del laberinto a 15-21

### No puedo usar F12 o clic derecho
- **Causa**: Problema muy raro, el juego debería permitirlo
- **Solución**: Actualiza la página o usa otro navegador

### El juego se ve pixelado
- **Causa**: Escala de cámara muy alta
- **Solución**: Reduce la escala de cámara a 2-4

### No hay sonido
- **Causa**: Navegador bloquea audio automático
- **Solución**: Haz clic en el juego primero, luego el sonido funcionará

---

## 💡 Consejos y Trucos

### Para Principiantes
- Empieza con la configuración "Fácil"
- Practica el uso de poderes en niveles sin enemigos
- El pico es tu mejor amigo para crear atajos

### Para Jugadores Avanzados
- Usa la bola de nieve estratégicamente
- Los aliados pueden distraer enemigos
- Memoriza los patrones de movimiento de enemigos

### Para Creadores
- Experimenta con diferentes combinaciones
- Los laberintos pequeños con muchos enemigos son muy desafiantes
- Los laberintos grandes sin enemigos son relajantes

### Estrategias de Juego
- **Explora sistemáticamente**: No te pierdas en el laberinto
- **Conserva poderes**: Úsalos solo cuando sea necesario
- **Evita enemigos**: No siempre es necesario confrontarlos
- **Usa las paredes**: El pico puede crear rutas más directas
- **Apunta con precisión**: Los círculos azules te muestran exactamente dónde apuntas

---

## 🏆 Desafíos Sugeridos

### Desafío Velocista
- Configuración: Normal
- Meta: Completar 5 niveles en menos de 3 minutos

### Desafío Pacifista
- Configuración: Difícil con enemigos
- Meta: Completar sin usar bolas de nieve

### Desafío Minimalista
- Configuración: Extremo
- Meta: Completar usando solo 1 pico por nivel

### Desafío Explorador
- Configuración: Personalizada con laberintos 31x31
- Meta: Explorar al menos 80% del laberinto antes de llegar a la meta

---

## 📞 Soporte

Si tienes problemas o sugerencias:
1. Revisa esta guía primero
2. Consulta la documentación técnica para problemas avanzados
3. Verifica que estés usando un navegador moderno y actualizado

---

*¡Disfruta creando y jugando tus laberintos personalizados!* 🎮✨ 