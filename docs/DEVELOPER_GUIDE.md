# MMPA Developer & Contributor Guide

**Complete Guide for Contributing to MMPA Platform v1.0**

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Coding Standards](#coding-standards)
4. [Testing](#testing)
5. [Pull Request Process](#pull-request-process)
6. [Architecture Guidelines](#architecture-guidelines)
7. [Performance Guidelines](#performance-guidelines)
8. [Documentation](#documentation)

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 14.0.0
- **npm** ≥ 6.0.0
- **Git**
- **Code Editor** (VSCode recommended)
- **Understanding of**:
  - JavaScript ES6+
  - Differential geometry (basic concepts)
  - Web Audio API
  - WebGL (for visualization work)

### Development Setup

#### 1. Fork & Clone

```bash
# Fork repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/mmpa.git
cd mmpa
```

#### 2. Add Upstream Remote

```bash
git remote add upstream https://github.com/original/mmpa.git
git fetch upstream
```

#### 3. Install Dependencies

```bash
npm install
```

#### 4. Create Branch

```bash
git checkout -b feature/your-feature-name
```

### Recommended Tools

#### VSCode Extensions

- **ESLint**: JavaScript linting
- **Prettier**: Code formatting
- **Git Lens**: Enhanced git integration
- **GLSL Canvas**: Shader preview
- **Todo Tree**: TODO/FIXME highlighting

#### Browser Extensions

- **React DevTools**: Component inspection (if using React)
- **Redux DevTools**: State debugging (if using Redux)
- **WebGL Insight**: WebGL debugging

---

## Development Workflow

### Daily Workflow

```bash
# 1. Sync with upstream
git checkout main
git pull upstream main
git push origin main

# 2. Create feature branch
git checkout -b feature/new-feature

# 3. Make changes
# ... edit files ...

# 4. Run tests
npm test

# 5. Commit changes
git add .
git commit -m "feat: add new feature"

# 6. Push to fork
git push origin feature/new-feature

# 7. Create pull request on GitHub
```

### Commit Message Convention

Follow **Conventional Commits** format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples**:

```bash
# Feature
git commit -m "feat(homology): add persistent homology computation"

# Bug fix
git commit -m "fix(actuator): correct control signal signs"

# Documentation
git commit -m "docs(api): add pullback() examples"

# Performance
git commit -m "perf(cache): implement FIFO eviction for integration cache"
```

---

## Coding Standards

### JavaScript Style

#### General Principles

1. **Use ES6+ features**: Arrow functions, destructuring, modules
2. **Prefer const/let**: No `var`
3. **Descriptive names**: `computeDifferentialForms()` not `compute()`
4. **Single responsibility**: One function = one purpose
5. **Pure functions**: Avoid side effects when possible

#### Code Examples

**Good**:
```javascript
// Clear, descriptive, pure function
function computeZeroForm(energyDensity, position) {
  const { q, p } = position;
  return energyDensity[q][p];
}

// Proper error handling
function pullback(form, map) {
  if (!form || form.degree === undefined) {
    console.warn('Invalid form structure');
    return null;
  }

  // ... implementation
}
```

**Bad**:
```javascript
// Unclear, mutating, cryptic
function calc(x, y) {
  var z = x;  // var instead of const
  z = z + y;  // mutation
  return z;
}

// No error handling
function pullback(form, map) {
  return form.data[map(0, 0)];  // Crashes if form is null
}
```

### File Organization

```javascript
// 1. Imports
import { DifferentialFormsComputer } from './differentialForms.js';

// 2. Constants
const MAX_CACHE_SIZE = 1000;
const DEFAULT_GAIN = 1.0;

// 3. Helper functions
function validateInput(input) {
  // ...
}

// 4. Main class
export class MyClass {
  constructor() { /* ... */ }
  method() { /* ... */ }
}

// 5. Exports
export default MyClass;
```

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Variables | camelCase | `currentState` |
| Constants | UPPER_SNAKE_CASE | `MAX_CACHE_SIZE` |
| Functions | camelCase | `computeControl()` |
| Classes | PascalCase | `LQRController` |
| Private methods | _camelCase | `_validateCache()` |
| Files | camelCase | `lqrController.js` |

### Comments & Documentation

#### JSDoc for Public APIs

```javascript
/**
 * Computes pullback transformation F*ω for coordinate changes
 *
 * @param {Object} form - Differential form with structure {degree, data}
 * @param {Function} map - Coordinate transformation (t, f) => {t, f}
 * @returns {Object} Pulled-back form with evaluate method
 *
 * @example
 * const transformed = df.pullback(zeroForm, birdToWhaleMap);
 * const value = transformed.evaluate(10, 440);
 */
pullback(form, map) {
  // ... implementation
}
```

#### Inline Comments for Complex Logic

```javascript
// Apply Stokes' theorem: ∫_∂Ω ω = ∫_Ω dω
// Left side: integrate form over boundary
const lhs = this.integrate(boundaryT, form);

// Right side: integrate exterior derivative over region
const rhs = this.integrate(current, exteriorDerivative);
```

#### TODO Comments

```javascript
// TODO: Optimize with GPU acceleration
// FIXME: Handle edge case when form.degree is null
// HACK: Temporary workaround for WebGL context loss
```

---

## Testing

### Test Requirements

**All new features must include tests**:
- Unit tests for functions
- Integration tests for workflows
- Validation tests for mathematical correctness

### Writing Tests

#### Unit Test Structure

**File**: `test_myfeature.js`

```javascript
import { MyClass } from './src/myfeature.js';

let allTestsPassed = true;

// TEST 1
console.log('\n📋 TEST 1: Feature Description');
console.log('-'.repeat(70));

const instance = new MyClass();
const result = instance.method();

const test1_passed = result === expectedValue;

if (test1_passed) {
  console.log('✅ TEST 1 PASSED');
} else {
  console.log('❌ TEST 1 FAILED');
  allTestsPassed = false;
}

// ... more tests ...

// SUMMARY
if (allTestsPassed) {
  console.log('\n✅ ALL TESTS PASSED!');
  process.exit(0);
} else {
  console.log('\n❌ SOME TESTS FAILED!');
  process.exit(1);
}
```

#### Running Tests

```bash
# Run all tests
npm test

# Run specific test
node test_myfeature.js

# Expected: all tests pass
```

### Test Categories

#### 1. Unit Tests

**What**: Test individual functions in isolation

**Example**:
```javascript
// Test pullback identity map
const identityMap = (t, f) => ({ t, f });
const result = df.pullback(zeroForm, identityMap);
assert(result.degree === 0, 'Identity preserves degree');
```

#### 2. Integration Tests

**What**: Test multiple components working together

**Example**:
```javascript
// Test full pipeline: audio → forms → homology
const spectrogram = generateTestSpectrogram();
df.computeFormsFromSpectrogram(spectrogram, 100);
const integral = homology.integrate(current, df.zeroForms);
assert(!isNaN(integral), 'Integration produces valid result');
```

#### 3. Performance Tests

**What**: Verify performance meets targets

**Example**:
```javascript
const start = Date.now();
for (let i = 0; i < 1000; i++) {
  homology.integrate(current, form);
}
const duration = Date.now() - start;
assert(duration < 100, 'Cache makes 1000 integrations fast');
```

#### 4. Memory Tests

**What**: Verify no memory leaks

**Example**:
```javascript
const before = process.memoryUsage().heapUsed;
for (let i = 0; i < 5000; i++) {
  homology.integrate(current, form);
}
const after = process.memoryUsage().heapUsed;
const growth = (after - before) / 1024 / 1024;
assert(growth < 50, 'Memory growth < 50 MB');
```

---

## Pull Request Process

### Before Submitting

**Checklist**:
- [ ] Code follows style guidelines
- [ ] All tests pass (`npm test`)
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] No console.log() statements (use proper logging)
- [ ] No commented-out code
- [ ] Commit messages follow convention

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Performance improvement
- [ ] Documentation
- [ ] Refactoring

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)

## Screenshots (if applicable)
```

### Review Process

1. **Automated Checks**: CI runs tests
2. **Code Review**: Maintainer reviews code
3. **Discussion**: Address feedback
4. **Approval**: Maintainer approves
5. **Merge**: Squash and merge to main

### After Merge

```bash
# Update your local main
git checkout main
git pull upstream main

# Delete feature branch
git branch -d feature/your-feature

# Push to your fork
git push origin main
git push origin --delete feature/your-feature
```

---

## Architecture Guidelines

### Adding New Components

#### 1. Data Source

**Location**: `src/cameraSignalProvider.js`

**Steps**:
1. Create class extending `SignalProviderStrategy`
2. Implement `start()`, `stop()`, `getData()`
3. Add to router
4. Add tests

**Example**:
```javascript
class NewSignalSource {
  async start() {
    // Initialize connection
  }

  async stop() {
    // Cleanup
  }

  getData() {
    // Return signal data
    return { value: 0.5 };
  }
}
```

#### 2. Actuator

**Location**: `src/actuator/`

**Steps**:
1. Create new file: `newActuator.js`
2. Implement `actuate(u, state)` method
3. Add validation tests
4. Document in API docs

**Template**:
```javascript
export class NewActuator {
  constructor(options = {}) {
    this.gain = options.gain || 1.0;
  }

  actuate(u, current_state) {
    const [trans_sm, res] = u;

    // Transform control signal to domain parameters
    const param1 = trans_sm * this.gain;
    const param2 = res * this.gain;

    return {
      param1,
      param2,
      action: 'ACTION_NAME'
    };
  }
}
```

#### 3. MMPA Feature

**Location**: `src/ratioEngine.js` (if exists) or new module

**Steps**:
1. Compute from differential forms
2. Add to `state.mmpaFeatures`
3. Map to visual in `mappingLayer.js`
4. Add tests

---

## Performance Guidelines

### Optimization Checklist

- [ ] **Cache expensive computations**: Use Map/Set for O(1) lookup
- [ ] **Avoid unnecessary allocations**: Reuse arrays/objects
- [ ] **Profile before optimizing**: Use Chrome DevTools
- [ ] **Set memory limits**: Prevent unbounded growth
- [ ] **Use Web Workers**: For heavy computation (optional)

### Anti-Patterns to Avoid

**❌ Creating new objects in loops**:
```javascript
for (let i = 0; i < 10000; i++) {
  const obj = { x: i, y: i * 2 };  // 10k allocations!
  process(obj);
}
```

**✅ Reuse objects**:
```javascript
const obj = { x: 0, y: 0 };
for (let i = 0; i < 10000; i++) {
  obj.x = i;
  obj.y = i * 2;
  process(obj);
}
```

**❌ Unbounded caches**:
```javascript
const cache = new Map();
cache.set(key, value);  // Never evicts, grows forever
```

**✅ Bounded cache with FIFO**:
```javascript
if (cache.size >= MAX_SIZE) {
  const firstKey = cache.keys().next().value;
  cache.delete(firstKey);  // Evict oldest
}
cache.set(key, value);
```

---

## Documentation

### What to Document

1. **Public APIs**: All exported functions/classes
2. **Complex algorithms**: Non-obvious logic
3. **Design decisions**: Why, not just what
4. **Breaking changes**: Migration guides
5. **Examples**: Real usage examples

### Documentation Locations

| Type | Location |
|------|----------|
| API reference | `docs/API_DOCUMENTATION.md` |
| Architecture | `docs/ARCHITECTURE.md` |
| Deployment | `docs/DEPLOYMENT_GUIDE.md` |
| Contributing | `docs/DEVELOPER_GUIDE.md` (this file) |
| Changelog | `CHANGELOG.md` |

### Writing Good Documentation

**Bad**:
```javascript
// Sets the value
function setValue(x) { /* ... */ }
```

**Good**:
```javascript
/**
 * Updates the LQR target setpoint to a new value.
 * The controller will adjust control signals to drive
 * the system state toward this new target.
 *
 * @param {number} target - New setpoint (0-1)
 * @throws {RangeError} If target outside [0, 1]
 *
 * @example
 * lqr.setTargetState(0.618);  // Golden ratio
 */
function setTargetState(target) {
  if (target < 0 || target > 1) {
    throw new RangeError('Target must be in [0, 1]');
  }
  this.target = target;
}
```

---

## Best Practices

### Mathematical Code

1. **Verify mathematically**: Use `verifyStokes()` for validation
2. **Comment formulas**: Write LaTeX in comments
3. **Test edge cases**: Zero, NaN, infinity
4. **Preserve structure**: Don't break mathematical invariants

**Example**:
```javascript
/**
 * Computes exterior derivative d: Ωᵏ → Ωᵏ⁺¹
 *
 * For 0-form f: df = (∂f/∂q)dq + (∂f/∂p)dp
 * For 1-form ω = adq + bdp: dω = (∂b/∂q - ∂a/∂p)dq∧dp
 *
 * @param {Object} form - k-form (degree 0 or 1)
 * @returns {Object} (k+1)-form
 */
exteriorDerivative(form) {
  // Verify input
  if (form.degree > 1) {
    throw new Error('Exterior derivative only defined for degree ≤ 1');
  }

  // ... implementation preserving dd = 0
}
```

### Error Handling

1. **Validate inputs**: Check null/undefined/NaN
2. **Fail gracefully**: Return null or default, log warning
3. **Provide context**: Helpful error messages
4. **Test error paths**: Write tests for error cases

**Example**:
```javascript
pullback(form, map) {
  // Validate
  if (!form || form.degree === undefined) {
    console.warn('pullback: Invalid form structure', form);
    return null;
  }

  if (typeof map !== 'function') {
    console.warn('pullback: Map must be a function');
    return null;
  }

  // ... implementation
}
```

---

## Getting Help

### Resources

- **Issues**: [GitHub Issues](https://github.com/username/mmpa/issues)
- **Discussions**: [GitHub Discussions](https://github.com/username/mmpa/discussions)
- **Documentation**: [docs/](../docs/)
- **Email**: maintainer@example.com

### Asking Good Questions

1. **Search first**: Check existing issues/docs
2. **Provide context**: What are you trying to do?
3. **Show code**: Minimal reproducible example
4. **Describe expected**: What should happen?
5. **Describe actual**: What actually happens?
6. **Environment**: Browser, OS, Node version

**Example**:
```markdown
## Issue

Pullback returns undefined for 1-forms

## Expected

Should return pullback object with evaluate method

## Actual

Returns undefined

## Code

\```javascript
const oneForm = {degree: 1, data: {q: 1.0, p: 0.5}};
const result = df.pullback(oneForm, identityMap);
console.log(result);  // undefined
\```

## Environment

- Browser: Chrome 120
- Node: 18.0.0
- MMPA: v1.0.0
```

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Developer Guide Version**: 1.0
**Last Updated**: 2025-11-14
**Maintainer**: Your Name <maintainer@example.com>

**Thank you for contributing to MMPA!** 🎉
