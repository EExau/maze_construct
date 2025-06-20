// Constructor de Laberintos - Lógica JavaScript

// Configuración actual
let currentConfig = {};
let configGenerated = false; // Estado para controlar botones

// Sistema de Toast
function showToast(message, type = 'success', duration = 3000) {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✅',
        info: 'ℹ️',
        warning: '⚠️',
        error: '❌'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.success}</span>
        <span class="toast-message">${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto-remover después del tiempo especificado
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);
}

// Control de estado de botones
function updateButtonStates() {
    const btnTestGame = document.getElementById('btnTestGame');
    const btnBuildGame = document.getElementById('btnBuildGame');
    
    if (configGenerated) {
        // Habilitar botones
        btnTestGame.disabled = false;
        btnTestGame.classList.remove('disabled');
        btnBuildGame.disabled = false;
        btnBuildGame.classList.remove('disabled');
    } else {
        // Deshabilitar botones
        btnTestGame.disabled = true;
        btnTestGame.classList.add('disabled');
        btnBuildGame.disabled = true;
        btnBuildGame.classList.add('disabled');
    }
}

// Función llamada cuando cambia cualquier configuración
function onConfigChange() {
    configGenerated = false;
    updateButtonStates();
    
    // Limpiar textarea de configuración si había algo
    const configOutput = document.getElementById('configOutput');
    if (configOutput.value) {
        configOutput.value = '';
        showToast('Configuración modificada. Genere nueva configuración para continuar.', 'warning');
    }
}

// Presets predefinidos
const presets = {
    easy: {
        playerSpeed: 100,
        cameraScale: 4,
        minSize: 9,
        maxSize: 15,
        growthRate: 1,
        pickaxeEnabled: true,
        pickaxeStart: 5,
        snowballEnabled: true,
        snowballProb: 90,
        allyEnabled: false,
        allyProb: 0,
        enemiesEnabled: false,
        enemyStart: 999,
        enemyInterval: 2.0,
        enemyMoveChance: 50,
        complexityStart: 999,
        deadEndIntensity: 10,
        falsePathIntensity: 5
    },
    progression: {
        endLevelEnabled: false,
        endLevel: 50,
        infiniteMode: true
    },
    normal: {
        playerSpeed: 120,
        cameraScale: 4,
        minSize: 9,
        maxSize: 21,
        growthRate: 2,
        pickaxeEnabled: true,
        pickaxeStart: 10,
        snowballEnabled: true,
        snowballProb: 80,
        allyEnabled: true,
        allyProb: 20,
        enemiesEnabled: true,
        enemyStart: 15,
        enemyInterval: 1.0,
        enemyMoveChance: 70,
        complexityStart: 6,
        deadEndIntensity: 30,
        falsePathIntensity: 20
    },
    progression: {
        endLevelEnabled: false,
        endLevel: 50,
        infiniteMode: true
    },
    hard: {
        playerSpeed: 140,
        cameraScale: 3,
        minSize: 11,
        maxSize: 25,
        growthRate: 2,
        pickaxeEnabled: true,
        pickaxeStart: 15,
        snowballEnabled: true,
        snowballProb: 70,
        allyEnabled: true,
        allyProb: 15,
        enemiesEnabled: true,
        enemyStart: 10,
        enemyInterval: 0.8,
        enemyMoveChance: 80,
        complexityStart: 4,
        deadEndIntensity: 50,
        falsePathIntensity: 40
    },
    progression: {
        endLevelEnabled: true,
        endLevel: 75,
        infiniteMode: false
    },
    extreme: {
        playerSpeed: 160,
        cameraScale: 2,
        minSize: 13,
        maxSize: 35,
        growthRate: 3,
        pickaxeEnabled: true,
        pickaxeStart: 20,
        snowballEnabled: true,
        snowballProb: 60,
        allyEnabled: true,
        allyProb: 10,
        enemiesEnabled: true,
        enemyStart: 5,
        enemyInterval: 0.6,
        enemyMoveChance: 90,
        complexityStart: 2,
        deadEndIntensity: 70,
        falsePathIntensity: 60
    },
    progression: {
        endLevelEnabled: true,
        endLevel: 100,
        infiniteMode: false
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeSliders();
    initializeCheckboxes();
    loadPreset('normal'); // Cargar preset normal por defecto
    updateButtonStates(); // Inicializar estado de botones
});

// Inicializar sliders con valores dinámicos
function initializeSliders() {
    const sliders = [
        { id: 'playerSpeed', valueId: 'playerSpeedValue' },
        { id: 'cameraScale', valueId: 'cameraScaleValue' },
        { id: 'snowballProb', valueId: 'snowballProbValue', suffix: '%' },
        { id: 'allyProb', valueId: 'allyProbValue', suffix: '%' },
        { id: 'enemyInterval', valueId: 'enemyIntervalValue', suffix: 's' },
        { id: 'enemyMoveChance', valueId: 'enemyMoveChanceValue', suffix: '%' },
        { id: 'deadEndIntensity', valueId: 'deadEndIntensityValue', suffix: '%' },
        { id: 'falsePathIntensity', valueId: 'falsePathIntensityValue', suffix: '%' }
    ];

    sliders.forEach(slider => {
        const element = document.getElementById(slider.id);
        const valueElement = document.getElementById(slider.valueId);
        
        if (element && valueElement) {
            element.addEventListener('input', function() {
                const suffix = slider.suffix || '';
                valueElement.textContent = this.value + suffix;
            });
        }
    });
}

// Inicializar checkboxes con lógica especial
function initializeCheckboxes() {
    // Checkbox de nivel final - habilita/deshabilita el input numérico
    const endLevelEnabled = document.getElementById('endLevelEnabled');
    const endLevelInput = document.getElementById('endLevel');
    const infiniteMode = document.getElementById('infiniteMode');
    
    if (endLevelEnabled && endLevelInput && infiniteMode) {
        endLevelEnabled.addEventListener('change', function() {
            if (this.checked) {
                endLevelInput.disabled = false;
                infiniteMode.checked = false;
            } else {
                endLevelInput.disabled = true;
                infiniteMode.checked = true;
            }
        });
        
        infiniteMode.addEventListener('change', function() {
            if (this.checked) {
                endLevelEnabled.checked = false;
                endLevelInput.disabled = true;
            }
        });
    }
}

// Cargar preset
function loadPreset(presetName) {
    const preset = presets[presetName];
    if (!preset) return;

    // Aplicar valores del preset a los controles
    Object.keys(preset).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = preset[key];
            } else {
                element.value = preset[key];
                // Actualizar valores mostrados para sliders
                const valueElement = document.getElementById(key + 'Value');
                if (valueElement) {
                    let suffix = '';
                    if (key.includes('Prob') || key.includes('Chance') || key.includes('Intensity')) suffix = '%';
                    if (key.includes('Interval')) suffix = 's';
                    valueElement.textContent = preset[key] + suffix;
                }
            }
        }
    });
    
    // Aplicar lógica especial para nivel final
    const endLevelInput = document.getElementById('endLevel');
    if (endLevelInput && preset.endLevelEnabled !== undefined) {
        endLevelInput.disabled = !preset.endLevelEnabled;
    }

    // Mostrar toast de preset cargado
    const presetNames = {
        easy: '😊 Fácil',
        normal: '😐 Normal', 
        hard: '😰 Difícil',
        extreme: '💀 Extremo'
    };
    
    showToast(`Preset "${presetNames[presetName]}" cargado correctamente`, 'success');
    
    // Resetear estado de configuración generada
    configGenerated = false;
    updateButtonStates();
    
    // Limpiar textarea
    const configOutput = document.getElementById('configOutput');
    configOutput.value = '';
}

// Generar configuración JSON
function generateConfig() {
    currentConfig = {
        // Configuración básica
        gameplay: {
            playerSpeed: parseInt(document.getElementById('playerSpeed').value),
            cameraScale: parseInt(document.getElementById('cameraScale').value)
        },
        
        // Tamaños de laberinto
        maze: {
            minSize: parseInt(document.getElementById('minSize').value),
            maxSize: parseInt(document.getElementById('maxSize').value),
            growthRate: parseInt(document.getElementById('growthRate').value)
        },
        
        // Poderes
        powers: {
            pickaxe: {
                enabled: document.getElementById('pickaxeEnabled').checked,
                startLevel: parseInt(document.getElementById('pickaxeStart').value)
            },
            snowball: {
                enabled: document.getElementById('snowballEnabled').checked,
                probability: parseInt(document.getElementById('snowballProb').value) / 100
            },
            ally: {
                enabled: document.getElementById('allyEnabled').checked,
                probability: parseInt(document.getElementById('allyProb').value) / 100
            }
        },
        
        // Enemigos
        enemies: {
            enabled: document.getElementById('enemiesEnabled').checked,
            startLevel: parseInt(document.getElementById('enemyStart').value),
            moveInterval: parseFloat(document.getElementById('enemyInterval').value),
            moveChance: parseInt(document.getElementById('enemyMoveChance').value) / 100
        },
        
        // Complejidad
        complexity: {
            startLevel: parseInt(document.getElementById('complexityStart').value),
            deadEndIntensity: parseInt(document.getElementById('deadEndIntensity').value) / 100,
            falsePathIntensity: parseInt(document.getElementById('falsePathIntensity').value) / 100
        },
        
        // Progresión
        progression: {
            endLevelEnabled: document.getElementById('endLevelEnabled').checked,
            endLevel: parseInt(document.getElementById('endLevel').value),
            infiniteMode: document.getElementById('infiniteMode').checked
        },
        
        // Metadatos
        metadata: {
            name: "Configuración Personalizada",
            description: "Generada con el Constructor de Laberintos",
            version: "1.0",
            created: new Date().toISOString()
        }
    };

    // Mostrar en el textarea
    document.getElementById('configOutput').value = JSON.stringify(currentConfig, null, 2);
    
    // Actualizar estado de configuración generada
    configGenerated = true;
    updateButtonStates();
    
    // Mostrar toast de éxito
    showToast('📄 Configuración generada correctamente. Ya puedes probar o construir el juego.', 'success');
}

// Probar el juego
function testGame() {
    if (!configGenerated || !currentConfig || Object.keys(currentConfig).length === 0) {
        showToast('⚠️ Primero genera una configuración para poder probar el juego', 'warning');
        return;
    }
    
    // Guardar configuración temporalmente
    localStorage.setItem('tempMazeConfig', JSON.stringify(currentConfig));
    
    // Mostrar toast informativo
    showToast('🎮 Abriendo juego de prueba en nueva ventana...', 'info');
    
    // Abrir página de juego
    window.open('game.html', '_blank');
}

// Exportar configuración
function exportConfig() {
    if (!currentConfig || Object.keys(currentConfig).length === 0) {
        showToast('⚠️ Primero genera una configuración para poder exportarla', 'warning');
        return;
    }
    
    const configName = prompt('📝 Nombre para la configuración:', currentConfig.metadata.name);
    if (!configName) return;
    
    currentConfig.metadata.name = configName;
    
    const dataStr = JSON.stringify(currentConfig, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `${configName.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    link.click();
    
    // Mostrar toast de éxito
    showToast(`💾 Configuración "${configName}" exportada correctamente`, 'success');
}

// Importar configuración
function importConfig() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const config = JSON.parse(e.target.result);
                applyImportedConfig(config);
                showToast(`📂 Configuración "${config.metadata?.name || 'Sin nombre'}" importada correctamente`, 'success');
                
                // Resetear estado de configuración generada
                configGenerated = false;
                updateButtonStates();
                
                // Limpiar textarea
                document.getElementById('configOutput').value = '';
            } catch (error) {
                showToast(`❌ Error al leer el archivo: ${error.message}`, 'error');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

// Aplicar configuración importada
function applyImportedConfig(config) {
    // Mapear configuración a controles
    if (config.gameplay) {
        document.getElementById('playerSpeed').value = config.gameplay.playerSpeed || 120;
        document.getElementById('cameraScale').value = config.gameplay.cameraScale || 4;
    }
    
    if (config.maze) {
        document.getElementById('minSize').value = config.maze.minSize || 9;
        document.getElementById('maxSize').value = config.maze.maxSize || 21;
        document.getElementById('growthRate').value = config.maze.growthRate || 2;
    }
    
    if (config.powers) {
        if (config.powers.pickaxe) {
            document.getElementById('pickaxeEnabled').checked = config.powers.pickaxe.enabled;
            document.getElementById('pickaxeStart').value = config.powers.pickaxe.startLevel || 10;
        }
        if (config.powers.snowball) {
            document.getElementById('snowballEnabled').checked = config.powers.snowball.enabled;
            document.getElementById('snowballProb').value = (config.powers.snowball.probability * 100) || 80;
        }
        if (config.powers.ally) {
            document.getElementById('allyEnabled').checked = config.powers.ally.enabled;
            document.getElementById('allyProb').value = (config.powers.ally.probability * 100) || 20;
        }
    }
    
    if (config.enemies) {
        document.getElementById('enemiesEnabled').checked = config.enemies.enabled;
        document.getElementById('enemyStart').value = config.enemies.startLevel || 15;
        document.getElementById('enemyInterval').value = config.enemies.moveInterval || 1.0;
        document.getElementById('enemyMoveChance').value = (config.enemies.moveChance * 100) || 70;
    }
    
    if (config.complexity) {
        document.getElementById('complexityStart').value = config.complexity.startLevel || 6;
        document.getElementById('deadEndIntensity').value = (config.complexity.deadEndIntensity * 100) || 30;
        document.getElementById('falsePathIntensity').value = (config.complexity.falsePathIntensity * 100) || 20;
    }
    
    if (config.progression) {
        document.getElementById('endLevelEnabled').checked = config.progression.endLevelEnabled || false;
        document.getElementById('endLevel').value = config.progression.endLevel || 50;
        document.getElementById('infiniteMode').checked = config.progression.infiniteMode !== false;
        
        // Aplicar lógica de habilitación
        const endLevelInput = document.getElementById('endLevel');
        endLevelInput.disabled = !config.progression.endLevelEnabled;
    }
    
    // Actualizar valores mostrados
    initializeSliders();
    
    // Regenerar configuración
    generateConfig();
}

// Copiar configuración al portapapeles
function copyConfig() {
    const textarea = document.getElementById('configOutput');
    if (!textarea.value) {
        showToast('⚠️ No hay configuración para copiar', 'warning');
        return;
    }
    
    textarea.select();
    document.execCommand('copy');
    showToast('📋 Configuración copiada al portapapeles', 'success');
}

// Guardar configuración en localStorage
function saveConfig() {
    if (!currentConfig || Object.keys(currentConfig).length === 0) {
        showToast('⚠️ No hay configuración para guardar', 'warning');
        return;
    }
    
    const configName = prompt('💾 Nombre para guardar:', currentConfig.metadata.name);
    if (!configName) return;
    
    currentConfig.metadata.name = configName;
    
    // Obtener configuraciones guardadas
    let savedConfigs = JSON.parse(localStorage.getItem('savedMazeConfigs') || '{}');
    
    // Guardar nueva configuración
    savedConfigs[configName] = currentConfig;
    localStorage.setItem('savedMazeConfigs', JSON.stringify(savedConfigs));
    
    showToast(`💾 Configuración "${configName}" guardada correctamente`, 'success');
}

// Construir juego completo
async function buildGame() {
    if (!configGenerated || !currentConfig || Object.keys(currentConfig).length === 0) {
        showToast('⚠️ Primero genera una configuración para poder construir el juego', 'warning');
        return;
    }
    
    const gameName = prompt('🎮 Nombre del juego:', currentConfig.metadata.name);
    if (!gameName) return;
    
    try {
        // Mostrar toast de inicio
        showToast('🚀 Iniciando construcción del juego...', 'info', 2000);
        
        // Mostrar indicador de carga
        const loadingMsg = document.createElement('div');
        loadingMsg.innerHTML = '🚀 Construyendo juego...';
        loadingMsg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.8);color:white;padding:20px;border-radius:10px;z-index:9999;font-size:18px;';
        document.body.appendChild(loadingMsg);
        
        // Generar archivos del juego
        const gameFiles = await generateGameFiles(gameName, currentConfig);
        
        // Crear y descargar ZIP
        await downloadGameZip(gameName, gameFiles);
        
        document.body.removeChild(loadingMsg);
        showToast(`✅ ¡Juego "${gameName}" construido y descargado correctamente!`, 'success', 5000);
        
    } catch (error) {
        showToast(`❌ Error al construir el juego: ${error.message}`, 'error', 5000);
        console.error('Error de construcción:', error);
    }
} 