# React Table Resize

> 🎯 A powerful, production-ready React component for resizable table columns and cells with TypeScript support.

[![npm version](https://img.shields.io/npm/v/react-table-resize.svg)](https://www.npmjs.com/package/react-table-resize)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## ✨ Features

- 🎨 **Column Resizing**: Drag column headers to adjust width
- 📏 **Cell Content Resizing**: Enable per-column cell content resizing (width & height)
- 💾 **Persistent Widths**: Save column widths to localStorage
- 🎯 **Double-click Auto-size**: Auto-fit columns to content
- 🔧 **Flexible Configuration**: Per-column settings with global defaults
- 📱 **Responsive**: Works on desktop and touch devices
- ⚡ **Performance Optimized**: Debouncing, RAF, and CSS-based optimizations
- 🎭 **Multiple Handle Styles**: Default, minimal, classic, modern
- 🌗 **Dark Mode Support**: Built-in dark mode styling
- 📦 **TypeScript**: Full type safety with comprehensive type definitions
- 🎪 **Framework Agnostic**: Works with Ant Design Table (easy to adapt)

## 📦 Installation

```bash
npm install react-table-resize
# or
yarn add react-table-resize
# or
pnpm add react-table-resize
```

### Peer Dependencies

```json
{
  "react": ">=16.8.0",
  "react-dom": ">=16.8.0",
  "react-resizable": "^3.0.0",
  "antd": ">=4.0.0"
}
```

## 🚀 Quick Start

```tsx
import { Table } from 'antd';
import { useTableResize, ResizeColumnType } from 'react-table-resize';
import 'react-table-resize/dist/style.css';

const MyTable = () => {
  const columns: ResizeColumnType[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      defaultWidth: 200,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      defaultWidth: 100,
    },
  ];

  const { columns: resizableColumns, components } = useTableResize(columns, {
    persistColumnWidth: true,
    storageKey: 'my-table-widths',
  });

  return <Table columns={resizableColumns} components={components} dataSource={data} />;
};
```

## 📖 Documentation

### Basic Column Resizing

```tsx
const { columns, components } = useTableResize(baseColumns, {
  minWidth: 80,           // Global minimum width
  maxWidth: 600,          // Global maximum width
  threshold: 2,           // Resize threshold in pixels
  persistColumnWidth: true,
  storageKey: 'table-widths',
  showWidthTooltip: true,
  enableDoubleClickAutoSize: true,
});
```

### Cell Content Resizing

Enable users to resize individual cell content (both width and height):

```tsx
const columns: ResizeColumnType[] = [
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    defaultWidth: 200,
    cellResize: {
      enabled: true,
      defaultHeight: 80,    // Initial height
      minHeight: 60,        // Minimum height
      maxHeight: 350,       // Maximum height
      maxWidth: 500,        // Maximum width for cell content
    },
  },
];
```

### Configuration Options

#### `ResizeConfig`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `minWidth` | `number` | `80` | Global minimum column width |
| `maxWidth` | `number` | - | Global maximum column width |
| `minHeight` | `number` | `40` | Global minimum cell height |
| `maxHeight` | `number` | - | Global maximum cell height |
| `threshold` | `number` | `2` | Resize detection threshold |
| `enableCellContentResize` | `boolean` | `false` | Enable cell content resizing globally |
| `cellResizeHandleStyle` | `'default' \| 'minimal' \| 'classic' \| 'modern'` | `'default'` | Visual style of resize handle |
| `persistColumnWidth` | `boolean` | `false` | Save column widths to localStorage |
| `storageKey` | `string` | `'table-column-widths'` | localStorage key |
| `showWidthTooltip` | `boolean` | `false` | Show width tooltip while resizing |
| `enableDoubleClickAutoSize` | `boolean` | `false` | Enable double-click to auto-size |

#### `CellResizeConfig`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enabled` | `boolean` | `false` | Enable cell resizing for this column |
| `defaultHeight` | `number` | - | Initial cell height |
| `minHeight` | `number` | - | Minimum cell height |
| `maxHeight` | `number` | - | Maximum cell height |
| `minWidth` | `number` | - | Minimum cell width |
| `maxWidth` | `number` | - | Maximum cell width |

### Advanced Usage

#### Custom Handle Styles

```tsx
const { columns, components } = useTableResize(baseColumns, {
  cellResizeHandleStyle: 'modern', // Options: default, minimal, classic, modern
});
```

#### Reset Column Widths

```tsx
const { columns, components, resetColumnWidths } = useTableResize(baseColumns, {
  persistColumnWidth: true,
});

// Reset all columns to default widths
<button onClick={resetColumnWidths}>Reset Widths</button>
```

#### Auto-size Single Column

```tsx
const { columns, components, autoSizeColumn } = useTableResize(baseColumns);

// Auto-size a specific column
<button onClick={() => autoSizeColumn('columnKey')}>Auto-size</button>
```

## 🎨 Styling

The component uses CSS classes for styling. You can override these in your own CSS:

```css
/* Customize resize handle */
.resizable-cell-content::after {
  background: linear-gradient(135deg, transparent 50%, #your-color 50%);
}

/* Customize hover state */
.resizable-cell:hover .resizable-cell-content::after {
  border-color: #your-color;
  box-shadow: 0 0 8px #your-color;
}

/* Dark mode customization */
@media (prefers-color-scheme: dark) {
  .resizable-cell-content::after {
    background: linear-gradient(135deg, transparent 50%, #your-dark-color 50%);
  }
}
```

## 🔧 API Reference

### `useTableResize<T>(columns, config?)`

**Parameters:**
- `columns`: `ResizeColumnType<T>[]` - Array of column definitions
- `config`: `ResizeConfig` - Configuration options

**Returns:**
```typescript
{
  columns: ResizeColumnType<T>[],        // Enhanced columns
  components: TableComponents,            // Table components with resize logic
  resetColumnWidths: () => void,         // Reset all widths
  autoSizeColumn: (key: string) => void, // Auto-size specific column
  tableClassName: string,                // CSS class for table
}
```

## 🎯 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📝 License

MIT © [Your Name]

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/)
- Uses [react-resizable](https://github.com/react-grid-layout/react-resizable)
- Designed for [Ant Design](https://ant.design/)

## 📊 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

