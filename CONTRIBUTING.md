# Contributing to Economic Toolkit v2.0

Thank you for considering contributing to Economic Toolkit! This document provides guidelines and instructions for contributing.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Making Changes](#making-changes)
5. [Testing](#testing)
6. [Submitting Changes](#submitting-changes)
7. [Style Guidelines](#style-guidelines)
8. [Adding Data Sources](#adding-data-sources)
9. [Adding Formulas](#adding-formulas)

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow the project's technical standards

## Getting Started

### Prerequisites

- Julia ≥1.10
- Node.js ≥20
- Git ≥2.30
- Just ≥1.0 (optional but recommended)

### Fork and Clone

```bash
# Fork the repository on GitHub
git clone https://github.com/YOUR_USERNAME/excel-economic-number-tool-.git
cd excel-economic-number-tool-

# Add upstream remote
git remote add upstream https://github.com/Hyperpolymath/excel-economic-number-tool-.git
```

## Development Setup

```bash
# Check dependencies
./bootstrap.sh

# Install dependencies
just install
# or
julia --project=. -e 'using Pkg; Pkg.instantiate()'
npm install

# Run tests
just test

# Start development server
just dev
```

## Making Changes

### 1. Create a Branch

```bash
git checkout -b feature/amazing-feature
# or
git checkout -b fix/bug-description
```

### 2. Make Your Changes

- Write clear, documented code
- Follow existing code style
- Add tests for new features
- Update documentation as needed

### 3. Commit Your Changes

Use conventional commits:

```bash
git commit -m "feat(data-sources): add OECD client implementation"
git commit -m "fix(formulas): correct Gini coefficient calculation"
git commit -m "docs(readme): update installation instructions"
```

#### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

## Testing

### Run All Tests

```bash
just test
```

### Run Specific Tests

```bash
# Julia tests
just test-julia

# TypeScript tests
just test-typescript

# Integration tests
just test-integration

# With coverage
just test-coverage
```

### Test Requirements

- Unit test coverage ≥95%
- All tests must pass
- Integration tests for new data sources
- Performance tests for new formulas

## Submitting Changes

### 1. Update Your Branch

```bash
git fetch upstream
git rebase upstream/main
```

### 2. Push to Your Fork

```bash
git push origin feature/amazing-feature
```

### 3. Create Pull Request

- Go to GitHub and create a pull request
- Fill in the PR template
- Reference any related issues
- Wait for review

### Pull Request Checklist

- [ ] Tests pass locally
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Commits follow conventional format
- [ ] No merge conflicts
- [ ] Coverage ≥95%

## Style Guidelines

### Julia

- Follow [Blue Style Guide](https://github.com/invenia/BlueStyle)
- Use JuliaFormatter:

```bash
just lint-fix-julia
```

- Meaningful variable names
- Document all public functions
- Type annotations for function arguments

### TypeScript

- Follow ESLint configuration
- Use Prettier for formatting:

```bash
just lint-fix-typescript
```

- Use explicit types (avoid `any`)
- Document public APIs with JSDoc
- Prefer `const` over `let`

### General

- Keep functions focused and single-purpose
- Write self-documenting code
- Add comments for complex logic
- Use meaningful variable names

## Adding Data Sources

### Steps to Add a New Data Source

1. **Create Client File**

```julia
# src/julia/data_sources/NewSource.jl

struct NewSourceClient
    base_url::String
    api_key::Union{String, Nothing}
    rate_limiter::RateLimiter
    cache::SQLiteCache
    retry_config::RetryConfig
end

function fetch_series(client::NewSourceClient, series_id::String,
                      start_date::Date, end_date::Date)::DataFrame
    # Implementation
end
```

2. **Add to Main Module**

```julia
# src/julia/EconomicToolkit.jl
include("data_sources/NewSource.jl")
export NewSourceClient
```

3. **Write Tests**

```julia
# tests/julia/test_new_source.jl
@testset "NewSource Tests" begin
    # Test cases
end
```

4. **Update Documentation**

- Add to `docs/data_sources.md`
- Add examples to README
- Update CLAUDE.md

5. **Submit PR**

## Adding Formulas

### Steps to Add a New Formula

1. **Create Formula File**

```julia
# src/julia/formulas/new_formula.jl

"""
    new_formula(data::Vector{Float64})::Float64

Calculate something useful.

# Arguments
- `data::Vector{Float64}`: Input data

# Returns
- `Float64`: Result
"""
function new_formula(data::Vector{Float64})::Float64
    # Implementation
end
```

2. **Add to Main Module**

```julia
# src/julia/EconomicToolkit.jl
include("formulas/new_formula.jl")
export new_formula
```

3. **Write Tests**

```julia
# tests/julia/test_new_formula.jl
@testset "New Formula Tests" begin
    @test new_formula([1.0, 2.0, 3.0]) ≈ expected_result
end
```

4. **Add Excel/LibreOffice Integration**

```typescript
// Register in adapter
adapter.registerFunction({
    name: 'ECON.NEWFORMULA',
    description: 'Calculate something',
    parameters: [/* ... */],
    returnType: 'number'
}, async (data) => {
    // Call Julia backend
});
```

5. **Update Documentation**

## Review Process

1. Automated checks run (lint, test, build)
2. Code review by maintainers
3. Changes requested if needed
4. Approval and merge

## Questions?

- Open an issue for discussion
- Check existing documentation
- Ask in pull request comments

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing! 🎉
