# Vector Graphics Editor Frontend
# Vector Graphics Editor Frontend

A modern vector graphics editor built with vanilla JavaScript and CSS.
A modern vector graphics editor built with vanilla JavaScript and CSS.

## Project Structure

```
frontend/
├── styles/
│   ├── layout/
│   │   ├── base.css      # Base styles, CSS reset, and variables
│   │   └── container.css # Main layout container styles
│   └── components/
│       ├── navigation.css # Top navigation bar styles
│       ├── toolbar.css    # Left toolbar styles
│       ├── shapes.css     # Shape elements and controls
│       ├── info-panel.css # Right info panel styles
│       └── modal.css      # Modal dialog styles
│   │   ├── base.css      # Base styles, CSS reset, and variables
│   │   └── container.css # Main layout container styles
│   └── components/
│       ├── navigation.css # Top navigation bar styles
│       ├── toolbar.css    # Left toolbar styles
│       ├── shapes.css     # Shape elements and controls
│       ├── info-panel.css # Right info panel styles
│       └── modal.css      # Modal dialog styles
├── server/
│   ├── server.js         # Express server for serving static files
│   └── index.html        # Main HTML template
└── script.js             # Main JavaScript file
│   ├── server.js         # Express server for serving static files
│   └── index.html        # Main HTML template
└── script.js             # Main JavaScript file
```

## Styling System

The styling system is organized into modular components using a clean, maintainable CSS architecture.

### Base Styles (`styles/layout/base.css`)

- Global CSS reset
- Body styles
- Font settings
- Viewport configuration
- Box sizing and margin reset

### Layout (`styles/layout/container.css`)

- Main application container
- Canvas container
- Shape panel layout
- Left navigation panel
- Shape options and previews
- Scrollbar customization

### Components

1. **Navigation** (`styles/components/navigation.css`)
   - Top navigation bar
   - Document title
   - Navigation actions
   - Open document button
   - Hover and focus states

2. **Shapes** (`styles/components/shapes.css`)
   - Shape base styles
   - Shape variants (circle, triangle, line)
   - Selection states
   - Resize handles
   - Rotation handles
   - Selection box
   - Canvas container

3. **Info Panel** (`styles/components/info-panel.css`)
   - Info panel layout
   - Shape information
   - Section headers
   - Controls
   - Dimension inputs
   - Color buttons
   - Control buttons
   - Collapsible sections

4. **Modal** (`styles/components/modal.css`)
   - Modal dialog
   - Modal content
   - Close button
   - Table styles
   - Document list
   - Empty state
   - Load document button

## Color System

The application uses a consistent color system:

- Primary: `#4299e1` (Blue)
- Background: `#ffffff` (White)
- Borders: `#e6e8eb`, `#e2e8f0` (Light Gray)
- Text: `#000000`, `#4a5568` (Black, Dark Gray)
- Hover states: `#f7fafc` (Light Blue)
- Selected states: `#ebf8ff` (Light Blue)

## Spacing System

Consistent spacing scale:
- Small: 4px
- Medium: 8px
- Large: 16px
- Extra Large: 24px

## Browser Support

The application uses modern CSS features including:
- CSS Grid and Flexbox
- CSS Transitions and Transforms
- Modern pseudo-selectors
- Box Shadow and Border Radius
- Z-index layering

## Development

1. Install dependencies:
```bash
cd frontend/server
npm install
```

2. Start the development server:
```bash
npm start
```

3. Access the application at `http://localhost:3000`

## Features

- Create and edit vector shapes
- Resize and rotate shapes
- Customize shape properties
- Save and load documents
- Responsive layout
- Modern UI with smooth transitions 