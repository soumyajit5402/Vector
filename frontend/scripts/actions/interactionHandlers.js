import { state } from '../state/state.js';
import { updateShapesInfo } from '../utils/uiUpdates.js';

// Handle shape mouse down event
export function handleShapeMouseDown(e) {
    if (e.target.classList.contains('resize-handle') || e.target.classList.contains('rotation-handle')) {
        return;
    }
    
    state.selectedShape = e.currentTarget;
    state.isDragging = true;
    state.startX = e.clientX;
    state.startY = e.clientY;
    state.startLeft = parseInt(state.selectedShape.style.left);
    state.startTop = parseInt(state.selectedShape.style.top);
    
    updateShapesInfo();
}

// Handle resize mouse down event
export function handleResizeMouseDown(e) {
    e.stopPropagation();
    state.selectedShape = e.target.parentElement;
    state.isResizing = true;
    state.startX = e.clientX;
    state.startY = e.clientY;
    state.startWidth = parseInt(state.selectedShape.style.width);
    state.startHeight = parseInt(state.selectedShape.style.height);
    state.startLeft = parseInt(state.selectedShape.style.left);
    state.startTop = parseInt(state.selectedShape.style.top);
    state.resizeType = e.target.className.replace('resize-handle ', '');
    
    updateShapesInfo();
}

// Handle rotation mouse down event
export function handleRotationMouseDown(e) {
    e.stopPropagation();
    state.selectedShape = e.target.parentElement;
    state.isRotating = true;
    const transform = state.selectedShape.style.transform;
    state.startRotation = transform ? parseInt(transform.match(/-?\d+/)[0]) : 0;
    
    updateShapesInfo();
}

// Handle mouse move for shape interactions
export function handleMouseMove(e) {
    // Track mouse position for paste operation
    state.lastMouseX = e.clientX;
    state.lastMouseY = e.clientY;
    
    const canvasRect = document.getElementById('canvas').getBoundingClientRect();
    state.lastCanvasX = e.clientX - canvasRect.left;
    state.lastCanvasY = e.clientY - canvasRect.top;

    // Handle shape dragging
    if (state.isDragging && state.selectedShape) {
        const dx = e.clientX - state.startX;
        const dy = e.clientY - state.startY;
        
        state.selectedShape.style.left = state.startLeft + dx + 'px';
        state.selectedShape.style.top = state.startTop + dy + 'px';
        
        updateShapesInfo();
    }

    // Handle shape resizing
    if (state.isResizing && state.selectedShape) {
        const dx = e.clientX - state.startX;
        const dy = e.clientY - state.startY;
        
        handleResize(dx, dy);
        updateShapesInfo();
    }

    // Handle shape rotation
    if (state.isRotating && state.selectedShape) {
        const rect = state.selectedShape.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        const rotation = angle * (180 / Math.PI) + 90;
        
        state.selectedShape.style.transform = `rotate(${rotation}deg)`;
        updateShapesInfo();
    }
}

// Handle mouse up event
export function handleMouseUp() {
    if (state.isDragging || state.isResizing || state.isRotating) {
        addToHistory({
            type: 'modify',
            shape: state.selectedShape,
            properties: serializeShape(state.selectedShape)
        });
    }
    
    state.isDragging = false;
    state.isResizing = false;
    state.isRotating = false;
}

// Helper function to handle resizing based on resize type
function handleResize(dx, dy) {
    switch (state.resizeType) {
        case 'top-left':
            state.selectedShape.style.width = state.startWidth - dx + 'px';
            state.selectedShape.style.height = state.startHeight - dy + 'px';
            state.selectedShape.style.left = state.startLeft + dx + 'px';
            state.selectedShape.style.top = state.startTop + dy + 'px';
            break;
        case 'top-right':
            state.selectedShape.style.width = state.startWidth + dx + 'px';
            state.selectedShape.style.height = state.startHeight - dy + 'px';
            state.selectedShape.style.top = state.startTop + dy + 'px';
            break;
        case 'bottom-left':
            state.selectedShape.style.width = state.startWidth - dx + 'px';
            state.selectedShape.style.height = state.startHeight + dy + 'px';
            state.selectedShape.style.left = state.startLeft + dx + 'px';
            break;
        case 'bottom-right':
            state.selectedShape.style.width = state.startWidth + dx + 'px';
            state.selectedShape.style.height = state.startHeight + dy + 'px';
            break;
        case 'top':
            state.selectedShape.style.height = state.startHeight - dy + 'px';
            state.selectedShape.style.top = state.startTop + dy + 'px';
            break;
        case 'right':
            state.selectedShape.style.width = state.startWidth + dx + 'px';
            break;
        case 'bottom':
            state.selectedShape.style.height = state.startHeight + dy + 'px';
            break;
        case 'left':
            state.selectedShape.style.width = state.startWidth - dx + 'px';
            state.selectedShape.style.left = state.startLeft + dx + 'px';
            break;
    }
} 