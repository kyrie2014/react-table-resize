# Contributing to React Table Resize

First off, thank you for considering contributing to React Table Resize! 🎉

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps to reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed and what behavior you expected**
* **Include screenshots or GIFs if possible**
* **Include your environment details** (OS, Browser, React version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior and explain the expected behavior**
* **Explain why this enhancement would be useful**

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Follow the coding style** (ESLint + Prettier)
3. **Add tests** if you've added code
4. **Ensure the test suite passes**
5. **Make sure your code lints**
6. **Update documentation** if needed
7. **Write a clear commit message**

## Development Setup

```bash
# Clone your fork
git clone https://github.com/kyrie2014/react-table-resize.git
cd react-table-resize

# Install dependencies
npm install

# Start development
npm run build:watch

# Run tests
npm run test:watch

# Run linting
npm run lint
```

## Project Structure

```
react-table-resize/
├── src/
│   ├── index.tsx           # Main hook and components
│   ├── style.less          # Styles
│   └── types.ts            # TypeScript types (if separated)
├── tests/
│   └── index.test.tsx      # Tests
├── docs/                   # Documentation
├── examples/               # Usage examples
├── package.json
├── tsconfig.json
├── rollup.config.js
└── README.md
```

## Coding Guidelines

### TypeScript

* Use TypeScript for all new code
* Provide proper types for all exports
* Avoid `any` types when possible
* Document complex types with comments

### React

* Use functional components with hooks
* Use `React.memo` for performance-critical components
* Properly handle cleanup in `useEffect`
* Follow React best practices

### Styling

* Use LESS for styles
* Follow BEM naming convention
* Support dark mode
* Ensure responsive design

### Performance

* Use debouncing for frequent operations
* Use `requestAnimationFrame` for DOM updates
* Avoid unnecessary re-renders
* Use `useMemo` and `useCallback` appropriately

## Testing

* Write unit tests for all new features
* Maintain or improve code coverage
* Test edge cases
* Test browser compatibility

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat: add new resize handle style
fix: resolve column width persistence issue
docs: update API documentation
style: format code with prettier
refactor: simplify cell resize logic
test: add tests for auto-sizing
chore: update dependencies
```

## Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create a git tag
4. Push to GitHub
5. Publish to npm

## Questions?

Feel free to:
* Open an issue for questions
* Join our Discord community
* Email the maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for your contributions! 🚀

