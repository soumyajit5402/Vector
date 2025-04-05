# Vector Graphics Editor Frontend

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
├── server/
│   ├── server.js         # Express server for serving static files
│   └── index.html        # Main HTML template
└── script.js             # Main JavaScript file
```

## Styling System

The styling system is organized into modular components using a clean, maintainable CSS architecture.

### Base Styles (`styles/layout/base.css`)

- CSS reset and base styles
- Global CSS variables for:
  - Colors (primary, grays, etc.)
  - Spacing scale (4px to 24px)
  - Border radius values
  - Shadow styles
  - Transitions
  - Z-index layers
  - Component dimensions

### Layout (`styles/layout/container.css`)

- Main application layout
- Shape panel layout
- Canvas container
- Left navigation panel
- Scrollbar customization

### Components

1. **Navigation** (`styles/components/navigation.css`)
   - Top navigation bar
   - Document name input
   - Action buttons (Open, Save)

2. **Toolbar** (`styles/components/toolbar.css`)
   - Tool groups
   - Tool buttons with icons
   - Tooltips
   - Shape tools submenu
   - Color picker

3. **Shapes** (`styles/components/shapes.css`)
   - Shape styles (rectangle, circle, triangle, line)
   - Selection states
   - Resize handles
   - Rotation handle
   - Selection box
   - Canvas container

4. **Info Panel** (`styles/components/info-panel.css`)
   - Shape properties
   - Collapsible sections
   - Dimension controls
   - Color buttons
   - Input fields

5. **Modal** (`styles/components/modal.css`)
   - Modal overlay
   - Document list grid
   - Document previews
   - Empty states

## Color System

The application uses a consistent color system:

- Primary: `#2b6cb0` (Blue)
- Gray scale: 50-900 (from `#f8fafc` to `#1a202c`)
- Semantic colors for states and interactions

## Spacing System

Consistent spacing scale using CSS variables:
- `--spacing-1`: 4px
- `--spacing-2`: 8px
- `--spacing-3`: 12px
- `--spacing-4`: 16px
- `--spacing-5`: 20px
- `--spacing-6`: 24px

## Component Dimensions

Fixed dimensions for major components:
- Navigation height: 48px
- Toolbar width: 48px
- Info panel width: 250px

## Browser Support

The application uses modern CSS features including:
- CSS Grid and Flexbox
- CSS Variables (Custom Properties)
- CSS Transitions and Transforms
- Modern pseudo-selectors

## Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Access the application at `http://localhost:3000` 