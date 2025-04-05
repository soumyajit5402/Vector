import { state } from '../state/state.js';

// Update the shapes information panel
export function updateShapesInfo() {
    const shapesInfo = document.getElementById('shapes-info');
    shapesInfo.innerHTML = '';
    
    state.shapes.forEach((shape, index) => {
        const shapeInfo = document.createElement('div');
        shapeInfo.className = 'shape-info';
        
        // Create header with shape type and collapse button
        const header = document.createElement('div');
        header.className = 'shape-info-header';
        
        const shapeType = shape.classList.contains('circle') ? 'Circle' : 'Rectangle';
        header.innerHTML = `
            <span>${shapeType} ${index + 1}</span>
            <button class="collapse-btn">${state.collapsedStates.shapes.has(index) ? '+' : '-'}</button>
        `;
        
        shapeInfo.appendChild(header);
        
        // Create content section (if not collapsed)
        if (!state.collapsedStates.shapes.has(index)) {
            const content = document.createElement('div');
            content.className = 'shape-info-content';
            
            // Position section
            const positionSection = createSection('Position', index, [
                { label: 'Left', value: parseInt(shape.style.left) + 'px' },
                { label: 'Top', value: parseInt(shape.style.top) + 'px' }
            ]);
            content.appendChild(positionSection);
            
            // Size section
            const sizeSection = createSection('Size', index, [
                { label: 'Width', value: parseInt(shape.style.width) + 'px' },
                { label: 'Height', value: parseInt(shape.style.height) + 'px' }
            ]);
            content.appendChild(sizeSection);
            
            // Style section
            const styleSection = createSection('Style', index, [
                { label: 'Background', value: shape.style.backgroundColor || 'transparent' },
                { label: 'Border', value: shape.style.borderColor || 'black' },
                { label: 'Border Width', value: shape.style.borderWidth || '1px' }
            ]);
            content.appendChild(styleSection);
            
            // Rotation section (for rectangles only)
            if (!shape.classList.contains('circle')) {
                const transform = shape.style.transform;
                const rotation = transform ? parseInt(transform.match(/-?\d+/)[0]) : 0;
                const rotationSection = createSection('Rotation', index, [
                    { label: 'Angle', value: rotation + '°' }
                ]);
                content.appendChild(rotationSection);
            }
            
            shapeInfo.appendChild(content);
        }
        
        shapesInfo.appendChild(shapeInfo);
    });
}

// Create a collapsible section for shape information
function createSection(title, shapeIndex, items) {
    const section = document.createElement('div');
    section.className = 'info-section';
    
    const sectionId = `${title}-${shapeIndex}`;
    const isCollapsed = state.collapsedStates.sections.get(sectionId);
    
    const header = document.createElement('div');
    header.className = 'section-header';
    header.innerHTML = `
        <span>${title}</span>
        <button class="collapse-btn">${isCollapsed ? '+' : '-'}</button>
    `;
    section.appendChild(header);
    
    if (!isCollapsed) {
        const content = document.createElement('div');
        content.className = 'section-content';
        
        items.forEach(item => {
            const row = document.createElement('div');
            row.className = 'info-row';
            row.innerHTML = `
                <span class="info-label">${item.label}:</span>
                <span class="info-value">${item.value}</span>
            `;
            content.appendChild(row);
        });
        
        section.appendChild(content);
    }
    
    return section;
} 