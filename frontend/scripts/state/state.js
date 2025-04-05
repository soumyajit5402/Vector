// Application state
export const state = {
    shapes: [], // Array to track all shapes
    selectedShape: null,
    isResizing: false,
    isDragging: false,
    isRotating: false,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    startLeft: 0,
    startTop: 0,
    startRotation: 0,
    resizeType: null,
    copiedShape: null,
    commandHistory: [],
    currentHistoryIndex: -1,
    MAX_HISTORY: 10,
    lastMouseX: 0,
    lastMouseY: 0,
    lastCanvasX: 0,
    lastCanvasY: 0,
    collapsedStates: {
        shapes: new Set(),
        sections: new Map()
    }
};

// Color palette
export const colorPalette = {
    background: [
        { name: 'Sky Blue', value: '#E3F2FD' },
        { name: 'Mint', value: '#E8F5E9' },
        { name: 'Lavender', value: '#F3E5F5' },
        { name: 'Peach', value: '#FFF3E0' },
        { name: 'Seafoam', value: '#E0F7FA' },
        { name: 'Rose', value: '#FFEBEE' },
        { name: 'Sage', value: '#F1F8E9' },
        { name: 'Linen', value: '#FAFAFA' },
        { name: 'Mist', value: '#ECEFF1' },
        { name: 'Pearl', value: '#F5F5F5' }
    ],
    border: [
        { name: 'Slate', value: '#455A64' },
        { name: 'Charcoal', value: '#37474F' },
        { name: 'Graphite', value: '#546E7A' },
        { name: 'Steel', value: '#607D8B' },
        { name: 'Smoke', value: '#78909C' },
        { name: 'Ash', value: '#90A4AE' },
        { name: 'Stone', value: '#B0BEC5' },
        { name: 'Silver', value: '#CFD8DC' },
        { name: 'Pewter', value: '#78909C' },
        { name: 'Iron', value: '#455A64' }
    ]
}; 