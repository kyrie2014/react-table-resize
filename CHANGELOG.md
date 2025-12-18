# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-18

### Added
- Initial release
- Column resizing via drag handles
- Cell content resizing (width and height)
- Per-column cell resize configuration
- localStorage persistence for column widths
- Double-click auto-sizing
- Multiple resize handle styles (default, minimal, classic, modern)
- TypeScript support with full type definitions
- Dark mode support
- Responsive design
- Performance optimizations (debouncing, RAF)
- Comprehensive documentation

### Features
- ✨ Drag column headers to resize column width
- ✨ Drag cell corners to resize individual cell content
- ✨ Synchronized row/column resizing
- ✨ Configurable min/max dimensions
- ✨ Persistent widths across sessions
- ✨ Auto-fit columns on double-click
- ✨ Touch device support
- ✨ Accessibility features

### Technical Highlights
- React Hooks-based architecture
- Direct DOM manipulation for optimal performance
- CSS `!important` override strategy for browser resize conflicts
- ResizeObserver API for content change detection
- Ant Design Table integration

## [Unreleased]

### Planned
- [ ] Add virtualization support for large tables
- [ ] Add row reordering
- [ ] Add column reordering
- [ ] Add export to CSV/Excel
- [ ] Add filtering and sorting integration
- [ ] Add more themes
- [ ] Add storybook examples
- [ ] Add E2E tests with Playwright

---

## Version History

- **1.0.0** - Initial public release

---

For more details, see [GitHub Releases](https://github.com/kyrie2014/react-table-resize/releases).

