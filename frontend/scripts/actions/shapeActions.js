import { state } from '../state/state.js';

// Create a new shape
export function createShape(type, x, y, properties = null) {
    const shape = document.createElement('div');
    shape.className = 'shape';
    if (type !== 'rectangle') {
        shape.classList.add(type);
    }
    
    // Set initial position centered around the drop point
    const width = properties?.width || 300;
    const height = properties?.height || 200;
    shape.style.width = width + 'px';
    shape.style.height = height + 'px';
    shape.style.left = properties?.left || (x - width / 2) + 'px';
    shape.style.top = properties?.top || (y - height / 2) + 'px';
    shape.style.position = 'absolute';

    // Create SVG content
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    shape.appendChild(svg);

    // Apply properties if provided (for pasting)
    if (properties) {
        shape.style.backgroundColor = properties.backgroundColor;
        shape.style.borderColor = properties.borderColor;
        shape.style.borderWidth = properties.borderWidth;
        shape.style.transform = properties.transform;
    }

    // Add resize handles
    const handles = [
        'top-left', 'top-right', 'bottom-left', 'bottom-right',
        'top', 'right', 'bottom', 'left'
    ];
    
    handles.forEach(handle => {
        const handleElement = document.createElement('div');
        handleElement.className = `resize-handle ${handle}`;
        shape.appendChild(handleElement);
    });

    // Add rotation handle (only for rectangles)
    if (type === 'rectangle') {
        const rotationHandle = document.createElement('div');
        rotationHandle.className = 'rotation-handle';
        shape.appendChild(rotationHandle);
    }

    // Add shape to tracking array
    state.shapes.push(shape);
    return shape;
}

// Copy a shape
export function copyShape(shape) {
    if (!shape) return;
    state.copiedShape = serializeShape(shape);
}

// Paste a shape
export function pasteShape() {
    if (!state.copiedShape) return;

    const newShape = createShape(
        state.copiedShape.type,
        state.lastCanvasX,
        state.lastCanvasY,
        {
            width: parseInt(state.copiedShape.width),
            height: parseInt(state.copiedShape.height),
            backgroundColor: state.copiedShape.backgroundColor,
            borderColor: state.copiedShape.borderColor,
            borderWidth: state.copiedShape.borderWidth,
            transform: state.copiedShape.transform
        }
    );

    document.getElementById('canvas').appendChild(newShape);
    setupShapeInteraction(newShape);
    addToHistory({
        type: 'create',
        shape: newShape,
        properties: serializeShape(newShape)
    });
}

// Serialize a shape for saving/copying
export function serializeShape(shape) {
    return {
        type: shape.classList.contains('circle') ? 'circle' : 'rectangle',
        width: shape.style.width,
        height: shape.style.height,
        left: shape.style.left,
        top: shape.style.top,
        backgroundColor: shape.style.backgroundColor,
        borderColor: shape.style.borderColor,
        borderWidth: shape.style.borderWidth,
        transform: shape.style.transform
    };
}

// Serialize all shapes
export function serializeShapes() {
    return state.shapes.map(shape => serializeShape(shape));
} 