# Vector Frontend

This is the frontend application for the Vector project, a web-based vector graphics editor.

## Project Structure

```
frontend/
├── js/
│   ├── actions/
│   │   ├── shapeActions.js      # Shape creation and manipulation
│   │   ├── interactionHandlers.js # Mouse and keyboard interaction handlers
│   │   └── historyActions.js    # Undo/redo functionality
│   ├── state/
│   │   └── state.js            # Application state management
│   └── utils/
│       └── uiUpdates.js        # UI-related utility functions
├── styles/
│   ├── base/
│   │   └── reset.css           # Reset and base styles
│   ├── layout/
│   │   └── container.css       # Main layout and container styles
│   ├── components/
│   │   ├── navigation.css      # Navigation bar styles
│   │   ├── shapes.css         # Shape-related styles
│   │   ├── info-panel.css     # Information panel styles
│   │   └── modal.css          # Modal dialog styles
│   └── main.css               # Main stylesheet with imports
├── server/
│   └── server.js              # Express server for serving static files
├── script.js                  # Main application entry point
└── index.html                # Main HTML file
```

## Styles Organization

The CSS is organized into a modular structure:

### Base Styles (base/)
- `reset.css`: Contains reset styles and base typography

### Layout (layout/)
- `container.css`: Defines the main container layout, shape panel, canvas, and left navigation

### Components (components/)
- `navigation.css`: Styles for the top navigation bar
- `shapes.css`: Styles for shapes, resize handles, and shape options
- `info-panel.css`: Styles for the information panel and shape details
- `modal.css`: Styles for modal dialogs and document loading

## Modules

### State Management (state.js)
- Manages the application's global state
- Defines color palettes and default values
- Tracks shape selection, interaction states, and history

### Shape Actions (shapeActions.js)
- Creates and manipulates shapes
- Handles shape copying and pasting
- Serializes shapes for saving/loading

### Interaction Handlers (interactionHandlers.js)
- Manages mouse events for shapes
- Handles dragging, resizing, and rotation
- Updates shape positions and dimensions

### History Actions (historyActions.js)
- Implements undo/redo functionality
- Tracks command history
- Manages state changes

### UI Updates (uiUpdates.js)
- Updates the shapes information panel
- Creates and manages collapsible sections
- Handles UI state changes

## Usage

1. Create shapes by clicking the shape options
2. Manipulate shapes using:
   - Drag to move
   - Resize handles to change dimensions
   - Rotation handle to rotate (rectangles only)
3. Use keyboard shortcuts:
   - Ctrl/Cmd + C to copy
   - Ctrl/Cmd + V to paste
   - Ctrl/Cmd + Z to undo
   - Ctrl/Cmd + Shift + Z to redo
4. Save and load documents using the provided buttons

## Development

To modify or extend the application:

1. State changes should be made in `state.js`
2. New shape actions should be added to `shapeActions.js`
3. New interaction handlers should be added to `interactionHandlers.js`
4. UI updates should be implemented in `uiUpdates.js`
5. History-related changes should be made in `historyActions.js`
6. New styles should be added to their respective component files in the `styles/` directory
7. Import any new stylesheets in `main.css`

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev    # Runs with hot-reload using nodemon
   # OR
   npm start     # Runs without hot-reload
   ```

3. Open your browser and navigate to `http://localhost:3000` 