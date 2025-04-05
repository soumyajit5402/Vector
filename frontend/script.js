document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const shapesInfo = document.getElementById('shapes-info');
    const shapeOptions = document.querySelectorAll('.shape-option');
    let selectedShape = null;
    let isResizing = false;
    let isDragging = false;
    let isRotating = false;
    let startX, startY, startWidth, startHeight;
    let startLeft, startTop;
    let startRotation = 0;
    let resizeType = null;
    let shapes = []; // Array to track all shapes
    let copiedShape = null; // Store copied shape data
    let commandHistory = [];
    let currentHistoryIndex = -1;
    const MAX_HISTORY = 10;

    // Add state tracking for collapsed shapes and sections
    const collapsedStates = {
        shapes: new Set(), // Track collapsed shape indices
        sections: new Map() // Track collapsed sections for each shape
    };

    // Define subtle color palette
    const colorPalette = {
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

    // Track mouse position for paste operation
    let lastMouseX = 0;
    let lastMouseY = 0;
    let lastCanvasX = 0;
    let lastCanvasY = 0;

    // Update mouse position tracking
    document.addEventListener('mousemove', (e) => {
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        
        const canvasRect = canvas.getBoundingClientRect();
        lastCanvasX = e.clientX - canvasRect.left;
        lastCanvasY = e.clientY - canvasRect.top;
    });

    // Create a new shape
    function createShape(type, x, y, properties = null) {
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
            rotationHandle.addEventListener('mousedown', handleRotationMouseDown);
        }

        // Add event listeners
        shape.addEventListener('mousedown', handleShapeMouseDown);
        shape.querySelectorAll('.resize-handle').forEach(handle => {
            handle.addEventListener('mousedown', handleResizeMouseDown);
        });

        // Add shape to tracking array
        shapes.push(shape);

        return shape;
    }

    // Copy shape properties
    function copyShape(shape) {
        if (!shape) return;
        copiedShape = shape.cloneNode(true);
    }

    function addToHistory(command) {
        // Remove any future history if we're in the middle of the stack
        if (currentHistoryIndex < commandHistory.length - 1) {
            commandHistory = commandHistory.slice(0, currentHistoryIndex + 1);
        }
        
        // Add new command and trim history if needed
        commandHistory.push(command);
        if (commandHistory.length > MAX_HISTORY) {
            commandHistory.shift();
        }
        currentHistoryIndex = commandHistory.length - 1;
        
        // Save after any history change
        saveDocument();
    }

    function undo() {
        if (currentHistoryIndex >= 0) {
            const command = commandHistory[currentHistoryIndex];
            
            switch (command.type) {
                case 'create':
                    const createIndex = shapes.indexOf(command.shape);
                    if (createIndex > -1) {
                        shapes.splice(createIndex, 1);
                        command.shape.remove();
                        selectedShape = null;
                        document.querySelectorAll('.shape').forEach(s => s.classList.remove('selected'));
                    }
                    break;

                case 'delete':
                    // Re-add event listeners
                    command.shape.addEventListener('mousedown', handleShapeMouseDown);
                    command.shape.querySelectorAll('.resize-handle').forEach(handle => {
                        handle.addEventListener('mousedown', handleResizeMouseDown);
                    });
                    
                    const rotationHandle = command.shape.querySelector('.rotation-handle');
                    if (rotationHandle) {
                        rotationHandle.addEventListener('mousedown', handleRotationMouseDown);
                    }
                    
                    canvas.appendChild(command.shape);
                    shapes.push(command.shape);
                    selectedShape = command.shape;
                    
                    // Select the restored shape
                    document.querySelectorAll('.shape').forEach(s => s.classList.remove('selected'));
                    command.shape.classList.add('selected');
                    break;

                case 'move':
                    command.shape.style.left = command.oldLeft;
                    command.shape.style.top = command.oldTop;
                    break;

                case 'resize':
                    command.shape.style.width = command.oldWidth;
                    command.shape.style.height = command.oldHeight;
                    command.shape.style.left = command.oldLeft;
                    command.shape.style.top = command.oldTop;
                    break;

                case 'rotate':
                    command.shape.style.transform = `rotate(${command.oldRotation}deg)`;
                    break;

                case 'style':
                    command.shape.style[command.property] = command.oldValue;
                    break;
            }
            
            currentHistoryIndex--;
            updateShapesInfo();
            saveDocument();
        }
    }

    // Paste shape function
    function pasteShape() {
        if (!copiedShape) return;

        // Get canvas rect and scroll position
        const canvasRect = canvas.getBoundingClientRect();
        const canvasScrollLeft = canvas.scrollLeft || 0;
        const canvasScrollTop = canvas.scrollTop || 0;
        
        // Check if mouse is over canvas
        if (lastMouseX < canvasRect.left || lastMouseX > canvasRect.right || 
            lastMouseY < canvasRect.top || lastMouseY > canvasRect.bottom) {
            return;
        }

        // Create new shape
        const newShape = copiedShape.cloneNode(true);
        
        // Get dimensions of the original shape
        const computedStyle = window.getComputedStyle(copiedShape);
        const originalWidth = parseFloat(computedStyle.width);
        const originalHeight = parseFloat(computedStyle.height);

        // Calculate position relative to canvas
        const mouseCanvasX = lastMouseX - canvasRect.left;
        const mouseCanvasY = lastMouseY - canvasRect.top;

        // Set position and dimensions BEFORE adding to DOM
        newShape.style.position = 'absolute';
        newShape.style.width = `${originalWidth}px`;
        newShape.style.height = `${originalHeight}px`;
        newShape.style.left = `${mouseCanvasX + canvasScrollLeft - originalWidth/2}px`;
        newShape.style.top = `${mouseCanvasY + canvasScrollTop - originalHeight/2}px`;

        // Add event listeners
        newShape.addEventListener('mousedown', handleShapeMouseDown);
        newShape.querySelectorAll('.resize-handle').forEach(handle => {
            handle.addEventListener('mousedown', handleResizeMouseDown);
        });

        const rotationHandle = newShape.querySelector('.rotation-handle');
        if (rotationHandle) {
            rotationHandle.addEventListener('mousedown', handleRotationMouseDown);
        }

        // Add to canvas and tracking array
        canvas.appendChild(newShape);
        shapes.push(newShape);

        // Select the new shape
        document.querySelectorAll('.shape').forEach(s => s.classList.remove('selected'));
        newShape.classList.add('selected');
        selectedShape = newShape;

        // Add to history
        addToHistory({
            type: 'create',
            shape: newShape
        });

        updateShapesInfo();
        saveDocument();
    }

    // Handle rotation mouse down
    function handleRotationMouseDown(e) {
        selectedShape = this.parentElement;
        isRotating = true;
        startX = e.clientX;
        startY = e.clientY;
        
        // Get current rotation
        const style = window.getComputedStyle(selectedShape);
        const matrix = new WebKitCSSMatrix(style.transform);
        startRotation = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
        
        // Store initial rotation for undo
        selectedShape._initialRotation = selectedShape.style.transform || 'rotate(0deg)';
        
        e.preventDefault();
    }

    // Update information for all shapes
    function updateShapesInfo() {
        const shapesInfo = document.getElementById('shapes-info');
        shapesInfo.innerHTML = ''; // Clear existing information

        shapes.forEach((shape, index) => {
            const isShapeCollapsed = collapsedStates.shapes.has(index);
            const shapeSections = collapsedStates.sections.get(index) || new Set();
            
            const shapeInfo = document.createElement('div');
            shapeInfo.className = `shape-info ${shape === selectedShape ? 'selected' : ''} ${isShapeCollapsed ? 'collapsed' : ''}`;
            shapeInfo.innerHTML = `
                <div class="shape-header">
                    <input type="text" 
                           class="shape-name" 
                           value="${shape.name || `Shape ${index + 1}`}"
                           onchange="updateShapeName(${index}, this.value)">
                    <span class="shape-toggle" onclick="toggleShapeCollapse(${index})">▼</span>
                </div>
                <div class="shape-content">
                    <div class="section-header ${shapeSections.has('edges') ? 'collapsed' : ''}">
                        <h4>Edges</h4>
                        <span class="toggle-icon">▼</span>
                    </div>
                    <div class="section-content">
                        <p>Top: ${Math.round(shape.offsetTop)}px</p>
                        <p>Left: ${Math.round(shape.offsetLeft)}px</p>
                        <p>Right: ${Math.round(shape.offsetLeft + shape.offsetWidth)}px</p>
                        <p>Bottom: ${Math.round(shape.offsetTop + shape.offsetHeight)}px</p>
                    </div>

                    <div class="section-header ${shapeSections.has('dimensions') ? 'collapsed' : ''}">
                        <h4>Dimensions</h4>
                        <span class="toggle-icon">▼</span>
                    </div>
                    <div class="section-content">
                        <div class="dimension-controls">
                            <div class="dimension-input">
                                <label>Width</label>
                                <input type="number" 
                                       value="${Math.round(shape.offsetWidth)}" 
                                       onchange="updateShapeDimensions(${index}, 'width', this.value)">
                            </div>
                            <div class="dimension-input">
                                <label>Height</label>
                                <input type="number" 
                                       value="${Math.round(shape.offsetHeight)}" 
                                       onchange="updateShapeDimensions(${index}, 'height', this.value)">
                            </div>
                        </div>
                        ${shape.classList.contains('rectangle') ? `
                            <div class="dimension-input" style="margin-top: 8px;">
                                <label>Rotation</label>
                                <input type="number" 
                                       value="${Math.round(shape.rotation || 0)}" 
                                       onchange="updateShapeRotation(${index}, this.value)">
                            </div>
                        ` : ''}
                    </div>

                    <div class="section-header ${shapeSections.has('border') ? 'collapsed' : ''}">
                        <h4>Border</h4>
                        <span class="toggle-icon">▼</span>
                    </div>
                    <div class="section-content">
                        <div class="border-controls">
                            <div class="border-input">
                                <label>Width</label>
                                <input type="number" 
                                       value="${parseInt(shape.style.borderWidth) || 0}" 
                                       onchange="updateShapeStyle(${index}, 'borderWidth', this.value)">
                            </div>
                            <div class="border-input">
                                <label>Color</label>
                                <div class="color-buttons">
                                    ${colorPalette.border.map(color => `
                                        <div class="color-button" 
                                             style="background-color: ${color.value}"
                                             onclick="updateShapeStyle(${index}, 'borderColor', '${color.value}')"
                                             title="${color.name}">
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="section-header ${shapeSections.has('background') ? 'collapsed' : ''}">
                        <h4>Background</h4>
                        <span class="toggle-icon">▼</span>
                    </div>
                    <div class="section-content">
                        <div class="color-buttons">
                            ${colorPalette.background.map(color => `
                                <div class="color-button" 
                                     style="background-color: ${color.value}"
                                     onclick="updateShapeStyle(${index}, 'backgroundColor', '${color.value}')"
                                     title="${color.name}">
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;

            // Add click events for section headers
            shapeInfo.querySelectorAll('.section-header').forEach(header => {
                const sectionName = header.querySelector('h4').textContent.toLowerCase();
                const toggleIcon = header.querySelector('.toggle-icon');
                toggleIcon.addEventListener('click', () => {
                    if (!collapsedStates.sections.has(index)) {
                        collapsedStates.sections.set(index, new Set());
                    }
                    const sections = collapsedStates.sections.get(index);
                    if (sections.has(sectionName)) {
                        sections.delete(sectionName);
                    } else {
                        sections.add(sectionName);
                    }
                    updateShapesInfo();
                });
            });

            shapesInfo.appendChild(shapeInfo);
        });
    }

    // Function to update shape name
    window.updateShapeName = function(index, name) {
        if (shapes[index]) {
            shapes[index].name = name;
            updateShapesInfo();
            saveDocument();
        }
    };

    // Function to update shape dimensions
    window.updateShapeDimensions = function(index, property, value) {
        if (shapes[index]) {
            const newValue = Math.max(10, parseInt(value));
            const rect = shapes[index].getBoundingClientRect();
            const container = canvas.getBoundingClientRect();
            const centerX = rect.left - container.left + rect.width / 2;
            const centerY = rect.top - container.top + rect.height / 2;

            if (property === 'width') {
                shapes[index].style.width = newValue + 'px';
                shapes[index].style.left = (centerX - newValue / 2) + 'px';
            } else if (property === 'height') {
                shapes[index].style.height = newValue + 'px';
                shapes[index].style.top = (centerY - newValue / 2) + 'px';
            }
            updateShapesInfo();
            saveDocument();
        }
    };

    // Function to update shape rotation
    window.updateShapeRotation = function(index, angle) {
        if (shapes[index] && !shapes[index].classList.contains('circle')) {
            shapes[index].style.transform = `rotate(${parseInt(angle)}deg)`;
            updateShapesInfo();
            saveDocument();
        }
    };

    // Function to update shape style
    window.updateShapeStyle = function(index, property, value) {
        if (shapes[index]) {
            const oldValue = shapes[index].style[property];
            shapes[index].style[property] = value;
            
            // Add to history
            addToHistory({
                type: 'style',
                shape: shapes[index],
                property: property,
                oldValue: oldValue
            });
            
            updateShapesInfo();
            saveDocument();
        }
    };

    // Handle shape mouse down
    function handleShapeMouseDown(e) {
        if (e.target.classList.contains('resize-handle')) return;
        
        // Remove selected class from all shapes
        document.querySelectorAll('.shape').forEach(s => s.classList.remove('selected'));
        // Add selected class to current shape
        this.classList.add('selected');
        
        selectedShape = this;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = this.offsetLeft;
        startTop = this.offsetTop;

        // Store initial position for undo
        selectedShape._initialPosition = {
            left: this.style.left,
            top: this.style.top
        };

        e.preventDefault();
        updateShapesInfo();
    }

    // Handle resize mouse down
    function handleResizeMouseDown(e) {
        selectedShape = this.parentElement;
        isResizing = true;
        resizeType = this.classList[1];
        startX = e.clientX;
        startY = e.clientY;
        startWidth = selectedShape.offsetWidth;
        startHeight = selectedShape.offsetHeight;
        startLeft = selectedShape.offsetLeft;
        startTop = selectedShape.offsetTop;

        // Store initial state for undo
        selectedShape._initialState = {
            width: startWidth + 'px',
            height: startHeight + 'px',
            left: startLeft + 'px',
            top: startTop + 'px'
        };

        e.preventDefault();
        updateShapesInfo();
    }

    // Handle drag and drop
    shapeOptions.forEach(option => {
        option.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', option.dataset.shape);
            e.dataTransfer.effectAllowed = 'copy';
            // Add visual feedback
            option.style.opacity = '0.5';
        });

        option.addEventListener('dragend', (e) => {
            // Reset visual feedback
            option.style.opacity = '1';
        });
    });

    // Add click handler for canvas to deselect shapes
    canvas.addEventListener('click', (e) => {
        // Only deselect if clicking directly on the canvas (not on a shape or handle)
        if (e.target === canvas) {
            document.querySelectorAll('.shape').forEach(s => s.classList.remove('selected'));
            selectedShape = null;
            updateShapesInfo();
        }
    });

    canvas.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        // Add visual feedback
        canvas.style.border = '2px dashed #4CAF50';
    });

    canvas.addEventListener('dragleave', (e) => {
        // Reset visual feedback
        canvas.style.border = '1px solid #ccc';
    });

    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        // Reset visual feedback
        canvas.style.border = '1px solid #ccc';
        
        const shapeType = e.dataTransfer.getData('text/plain');
        if (!shapeType) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const newShape = createShape(shapeType, x, y);
        canvas.appendChild(newShape);
        
        // Select the new shape
        document.querySelectorAll('.shape').forEach(s => s.classList.remove('selected'));
        newShape.classList.add('selected');
        selectedShape = newShape;

        // Add to history
        addToHistory({
            type: 'create',
            shape: newShape
        });
        
        updateShapesInfo();
        saveDocument();
    });

    // Mouse up to stop dragging, resizing, and rotating
    document.addEventListener('mouseup', () => {
        if (isResizing && selectedShape && selectedShape._initialState) {
            addToHistory({
                type: 'resize',
                shape: selectedShape,
                oldWidth: selectedShape._initialState.width,
                oldHeight: selectedShape._initialState.height,
                oldLeft: selectedShape._initialState.left,
                oldTop: selectedShape._initialState.top
            });
            delete selectedShape._initialState;
        }
        
        if (isDragging && selectedShape && selectedShape._initialPosition) {
            // Only add to history if the position actually changed
            if (selectedShape._initialPosition.left !== selectedShape.style.left ||
                selectedShape._initialPosition.top !== selectedShape.style.top) {
                addToHistory({
                    type: 'move',
                    shape: selectedShape,
                    oldLeft: selectedShape._initialPosition.left,
                    oldTop: selectedShape._initialPosition.top
                });
            }
            delete selectedShape._initialPosition;
        }
        
        isResizing = false;
        isDragging = false;
        isRotating = false;
        resizeType = null;
    });

    // Handle keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Check if the focus is on an input field
        const activeElement = document.activeElement;
        const isInputFocused = activeElement.tagName === 'INPUT' && activeElement.type === 'number';

        // Check for Cmd+C (Copy)
        if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
            if (selectedShape) {
                copyShape(selectedShape);
                e.preventDefault();
            }
        }
        // Check for Cmd+V (Paste)
        else if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
            pasteShape();
            e.preventDefault();
        }
        // Delete key
        else if ((e.key === 'Delete' || e.key === 'Backspace') && !isInputFocused) {
            if (selectedShape) {
                // Add to history before deleting
                addToHistory({
                    type: 'delete',
                    shape: selectedShape
                });
                
                const index = shapes.indexOf(selectedShape);
                if (index > -1) {
                    shapes.splice(index, 1);
                }
                selectedShape.remove();
                selectedShape = null;
                updateShapesInfo();
                saveDocument();
            }
        }
        // Undo (Cmd+Z on Mac)
        else if (e.key === 'z' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            undo();
            updateShapesInfo();
        }
    });

    // Add new function to handle shape collapse toggle
    window.toggleShapeCollapse = function(index) {
        if (collapsedStates.shapes.has(index)) {
            collapsedStates.shapes.delete(index);
        } else {
            collapsedStates.shapes.add(index);
        }
        updateShapesInfo();
    };

    // Update the shape movement tracking
    function setupShapeInteraction(shape) {
        let isDragging = false;
        let startX, startY;
        let originalLeft, originalTop;
        
        shape.addEventListener('mousedown', function(e) {
            if (e.target === shape || e.target.parentElement === shape) {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                originalLeft = shape.style.left;
                originalTop = shape.style.top;
                
                // Select the shape
                document.querySelectorAll('.shape').forEach(s => s.classList.remove('selected'));
                shape.classList.add('selected');
                updateShapesInfo();
            }
        });
        
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                
                shape.style.left = `${parseInt(originalLeft) + dx}px`;
                shape.style.top = `${parseInt(originalTop) + dy}px`;
            }
        });
        
        document.addEventListener('mouseup', function() {
            if (isDragging) {
                // Add move to history
                addToHistory({
                    type: 'move',
                    shape: shape,
                    oldLeft: originalLeft,
                    oldTop: originalTop
                });
                isDragging = false;
            }
        });
        
        // Add resize to history
        const resizeHandles = shape.querySelectorAll('.resize-handle');
        resizeHandles.forEach(handle => {
            handle.addEventListener('mousedown', function() {
                const originalWidth = shape.style.width;
                const originalHeight = shape.style.height;
                
                const onMouseUp = function() {
                    addToHistory({
                        type: 'resize',
                        shape: shape,
                        oldWidth: originalWidth,
                        oldHeight: originalHeight
                    });
                    document.removeEventListener('mouseup', onMouseUp);
                };
                
                document.addEventListener('mouseup', onMouseUp);
            });
        });
        
        // Add rotation to history
        const rotationHandle = shape.querySelector('.rotation-handle');
        if (rotationHandle) {
            rotationHandle.addEventListener('mousedown', function() {
                const originalRotation = shape.style.transform ?
                    parseInt(shape.style.transform.match(/rotate\((.*?)deg\)/)[1]) : 0;
                
                const onMouseUp = function() {
                    addToHistory({
                        type: 'rotate',
                        shape: shape,
                        oldRotation: originalRotation
                    });
                    document.removeEventListener('mouseup', onMouseUp);
                };
                
                document.addEventListener('mouseup', onMouseUp);
            });
        }
    }

    // Mouse move handler for shape interactions
    document.addEventListener('mousemove', (e) => {
        if (isRotating && selectedShape) {
            const centerX = selectedShape.offsetLeft + selectedShape.offsetWidth / 2;
            const centerY = selectedShape.offsetTop + selectedShape.offsetHeight / 2;
            
            const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
            const rotation = angle - startRotation;
            
            selectedShape.style.transform = `rotate(${rotation}deg)`;
            
            // Add rotation to history when mouse is released
            const onMouseUp = () => {
                if (selectedShape._initialRotation) {
                    addToHistory({
                        type: 'rotate',
                        shape: selectedShape,
                        oldRotation: selectedShape._initialRotation
                    });
                    delete selectedShape._initialRotation;
                }
                document.removeEventListener('mouseup', onMouseUp);
            };
            document.addEventListener('mouseup', onMouseUp);
            
            updateShapesInfo();
        } else if (isResizing && selectedShape) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            const container = canvas;
            const containerRect = container.getBoundingClientRect();

            let newWidth = startWidth;
            let newHeight = startHeight;
            let newLeft = startLeft;
            let newTop = startTop;

            // Handle corner and edge resizing with 10px minimum
            switch (resizeType) {
                case 'top-left':
                    newWidth = Math.max(10, startWidth - dx);
                    newHeight = Math.max(10, startHeight - dy);
                    newLeft = startLeft + (startWidth - newWidth);
                    newTop = startTop + (startHeight - newHeight);
                    break;
                case 'top-right':
                    newWidth = Math.max(10, startWidth + dx);
                    newHeight = Math.max(10, startHeight - dy);
                    newTop = startTop + (startHeight - newHeight);
                    break;
                case 'bottom-left':
                    newWidth = Math.max(10, startWidth - dx);
                    newHeight = Math.max(10, startHeight + dy);
                    newLeft = startLeft + (startWidth - newWidth);
                    break;
                case 'bottom-right':
                    newWidth = Math.max(10, startWidth + dx);
                    newHeight = Math.max(10, startHeight + dy);
                    break;
                case 'top':
                    newHeight = Math.max(10, startHeight - dy);
                    newTop = startTop + (startHeight - newHeight);
                    break;
                case 'right':
                    newWidth = Math.max(10, startWidth + dx);
                    break;
                case 'bottom':
                    newHeight = Math.max(10, startHeight + dy);
                    break;
                case 'left':
                    newWidth = Math.max(10, startWidth - dx);
                    newLeft = startLeft + (startWidth - newWidth);
                    break;
            }

            // Ensure shape stays within container bounds
            const maxLeft = containerRect.width - newWidth;
            const maxTop = containerRect.height - newHeight;
            
            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));

            selectedShape.style.width = newWidth + 'px';
            selectedShape.style.height = newHeight + 'px';
            selectedShape.style.left = newLeft + 'px';
            selectedShape.style.top = newTop + 'px';

        } else if (isDragging && selectedShape) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            // Calculate new position
            const newLeft = startLeft + dx;
            const newTop = startTop + dy;
            
            // Get container dimensions
            const container = canvas;
            const containerRect = container.getBoundingClientRect();
            
            // Ensure shape stays within container bounds
            const maxLeft = containerRect.width - selectedShape.offsetWidth;
            const maxTop = containerRect.height - selectedShape.offsetHeight;
            
            // Set new position with bounds checking
            selectedShape.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + 'px';
            selectedShape.style.top = Math.max(0, Math.min(newTop, maxTop)) + 'px';
            
            updateShapesInfo();
        }

        if (isResizing || isDragging || isRotating) {
            updateShapesInfo();
        }
    });

    // Function to serialize shape data
    function serializeShape(shape) {
        const style = window.getComputedStyle(shape);
        const matrix = new WebKitCSSMatrix(style.transform);
        const rotation = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
        
        return {
            type: shape.classList.contains('circle') ? 'circle' : 'rectangle',
            name: shape.name || '',
            style: {
                width: shape.style.width,
                height: shape.style.height,
                left: shape.style.left,
                top: shape.style.top,
                backgroundColor: shape.style.backgroundColor,
                borderColor: shape.style.borderColor,
                borderWidth: shape.style.borderWidth,
                transform: shape.style.transform || 'rotate(0deg)',
                rotation: rotation
            }
        };
    }

    // Function to save document state
    function saveDocument() {
        const documentData = {
            name: "YourDocumentName", // Replace with dynamic name if needed
            data: JSON.stringify(serializeShapes()) // Assuming serializeShapes() returns the document data
        };

        fetch('http://localhost:8080/saveDocument', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(documentData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to save document');
            }
            return response.text();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Add click handler for the open document button
    document.querySelector('.open-document').addEventListener('click', function() {
        fetch('http://localhost:8080/listDocuments')
            .then(response => response.json())
            .then(data => {
                const documentList = document.getElementById('documentList');
                documentList.innerHTML = ''; // Clear existing list
                data.forEach((doc, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${doc.name}</td>
                        <td>${doc.created_at}</td>
                        <td>${doc.updated_at}</td>
                    `;
                    row.addEventListener('click', () => selectDocumentRow(row, doc.name));
                    documentList.appendChild(row);
                });
                document.getElementById('documentModal').style.display = 'block';
            })
            .catch(error => console.error('Error fetching documents:', error));
    });

    let selectedDocumentName = null;

    function selectDocumentRow(row, name) {
        // Deselect all rows
        document.querySelectorAll('#documentList tr').forEach(tr => tr.classList.remove('selected'));
        // Select the clicked row
        row.classList.add('selected');
        // Enable the load button
        document.getElementById('loadDocumentButton').disabled = false;
        // Store the selected document name
        selectedDocumentName = name;
    }

    document.getElementById('loadDocumentButton').addEventListener('click', function() {
        if (selectedDocumentName) {
            loadDocument(selectedDocumentName);
        }
    });

    function loadDocument(name) {
        fetch(`http://localhost:8080/getDocument?name=${name}`)
            .then(response => response.json())
            .then(data => {
                // Clear existing shapes
                shapes.forEach(shape => shape.remove());
                shapes = [];
                
                // Parse and add shapes to the canvas
                const shapeDataArray = JSON.parse(data);
                shapeDataArray.forEach(shapeData => {
                    const newShape = createShape(shapeData.type, 0, 0, shapeData.style);
                    canvas.appendChild(newShape);
                });
                
                // Update the right navigation with shape information
                updateShapesInfo();
                
                console.log('Document loaded:', data);
                document.getElementById('documentModal').style.display = 'none';
            })
            .catch(error => console.error('Error loading document:', error));
    }

    // Close the modal
    document.querySelector('.close').addEventListener('click', function() {
        document.getElementById('documentModal').style.display = 'none';
        document.getElementById('loadDocumentButton').disabled = true;
        selectedDocumentName = null;
    });

    function serializeShapes() {
        const shapesData = [];

        document.querySelectorAll('.shape').forEach(shape => {
            const style = window.getComputedStyle(shape);
            const matrix = new WebKitCSSMatrix(style.transform);
            const rotation = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);

            const shapeData = {
                type: shape.classList.contains('circle') ? 'circle' : 'rectangle',
                name: shape.querySelector('.shape svg').value || '',
                style: {
                    width: style.width,
                    height: style.height,
                    left: style.left,
                    top: style.top,
                    backgroundColor: style.backgroundColor,
                    borderColor: style.borderColor,
                    borderWidth: style.borderWidth,
                    transform: style.transform || 'rotate(0deg)',
                    rotation: rotation
                }
            };

            shapesData.push(shapeData);
        });

        return JSON.stringify(shapesData);
    }
}); 