import { state } from '../state/state.js';
import { serializeShape } from './shapeActions.js';

// Add an action to the history
export function addToHistory(command) {
    // Remove any future history if we're not at the end
    if (state.currentHistoryIndex < state.commandHistory.length - 1) {
        state.commandHistory = state.commandHistory.slice(0, state.currentHistoryIndex + 1);
    }
    
    state.commandHistory.push(command);
    state.currentHistoryIndex++;
    
    // Keep history size manageable
    if (state.commandHistory.length > state.MAX_HISTORY) {
        state.commandHistory.shift();
        state.currentHistoryIndex--;
    }
}

// Undo the last action
export function undo() {
    if (state.currentHistoryIndex < 0) return;
    
    const command = state.commandHistory[state.currentHistoryIndex];
    state.currentHistoryIndex--;
    
    switch (command.type) {
        case 'create':
            command.shape.remove();
            const index = state.shapes.indexOf(command.shape);
            if (index > -1) {
                state.shapes.splice(index, 1);
            }
            break;
            
        case 'delete':
            document.getElementById('canvas').appendChild(command.shape);
            state.shapes.push(command.shape);
            break;
            
        case 'modify':
            const previousCommand = state.currentHistoryIndex >= 0 
                ? state.commandHistory[state.currentHistoryIndex] 
                : null;
                
            if (previousCommand && previousCommand.shape === command.shape) {
                applyProperties(command.shape, previousCommand.properties);
            }
            break;
    }
}

// Redo the last undone action
export function redo() {
    if (state.currentHistoryIndex >= state.commandHistory.length - 1) return;
    
    state.currentHistoryIndex++;
    const command = state.commandHistory[state.currentHistoryIndex];
    
    switch (command.type) {
        case 'create':
            document.getElementById('canvas').appendChild(command.shape);
            state.shapes.push(command.shape);
            break;
            
        case 'delete':
            command.shape.remove();
            const index = state.shapes.indexOf(command.shape);
            if (index > -1) {
                state.shapes.splice(index, 1);
            }
            break;
            
        case 'modify':
            applyProperties(command.shape, command.properties);
            break;
    }
}

// Helper function to apply properties to a shape
function applyProperties(shape, properties) {
    shape.style.width = properties.width;
    shape.style.height = properties.height;
    shape.style.left = properties.left;
    shape.style.top = properties.top;
    shape.style.backgroundColor = properties.backgroundColor;
    shape.style.borderColor = properties.borderColor;
    shape.style.borderWidth = properties.borderWidth;
    shape.style.transform = properties.transform;
} 