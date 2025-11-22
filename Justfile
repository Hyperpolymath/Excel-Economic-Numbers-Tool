# Justfile for Economic Toolkit v2.0
# https://github.com/casey/just

# Default recipe to display help information
default:
    @just --list

# Install all dependencies
install:
    @echo "Installing Julia dependencies..."
    julia --project=. -e 'using Pkg; Pkg.instantiate()'
    @echo "Installing Node.js dependencies..."
    npm install
    @echo "All dependencies installed!"

# Development server (starts Julia backend + webpack dev server)
dev:
    @echo "Starting development servers..."
    @just dev-julia & just dev-webpack

# Start Julia development server
dev-julia:
    julia --project=. src/julia/EconomicToolkit.jl --dev

# Start webpack development server
dev-webpack:
    npm run dev

# Run all tests
test:
    @echo "Running all tests..."
    @just test-julia
    @just test-typescript
    @just test-integration

# Run Julia tests
test-julia:
    @echo "Running Julia tests..."
    julia --project=. -e 'using Pkg; Pkg.test()'

# Run TypeScript tests
test-typescript:
    @echo "Running TypeScript tests..."
    npm run test

# Run integration tests
test-integration:
    @echo "Running integration tests..."
    npm run test:integration

# Run tests with coverage
test-coverage:
    @echo "Running tests with coverage..."
    @just test-coverage-julia
    @just test-coverage-typescript

# Julia test coverage
test-coverage-julia:
    julia --project=. -e 'using Pkg; Pkg.test(coverage=true)'

# TypeScript test coverage
test-coverage-typescript:
    npm run test:coverage

# Lint all code
lint:
    @echo "Linting code..."
    @just lint-julia
    @just lint-typescript

# Lint Julia code
lint-julia:
    @echo "Linting Julia code..."
    julia --project=. -e 'using JuliaFormatter; format("src/julia", verbose=true)'

# Lint TypeScript code
lint-typescript:
    @echo "Linting TypeScript code..."
    npm run lint

# Fix linting issues
lint-fix:
    @echo "Fixing linting issues..."
    @just lint-fix-julia
    @just lint-fix-typescript

# Fix Julia formatting
lint-fix-julia:
    julia --project=. -e 'using JuliaFormatter; format("src/julia", verbose=true, overwrite=true)'

# Fix TypeScript linting
lint-fix-typescript:
    npm run lint:fix

# Build all platforms
build:
    @echo "Building all platforms..."
    @just build-julia
    @just build-typescript
    @just build-excel
    @just build-libre

# Build Julia backend
build-julia:
    @echo "Building Julia backend..."
    julia --project=. -e 'using PackageCompiler; create_sysimage(:EconomicToolkit, sysimage_path="build/EconomicToolkit.so")'

# Build TypeScript
build-typescript:
    @echo "Building TypeScript..."
    npm run build

# Build Excel add-in
build-excel:
    @echo "Building Excel add-in..."
    npm run build:excel
    @echo "Copying manifest..."
    cp src/excel/manifest.xml dist/officejs/

# Build LibreOffice extension
build-libre:
    @echo "Building LibreOffice extension..."
    npm run build:libre
    @echo "Creating .oxt package..."
    cd dist/uno && zip -r economic-toolkit.oxt *

# Clean build artifacts
clean:
    @echo "Cleaning build artifacts..."
    rm -rf dist/
    rm -rf build/
    rm -rf node_modules/
    rm -rf .julia/
    rm -rf coverage/
    rm -rf *.cov
    @echo "Clean complete!"

# Clean and rebuild
rebuild: clean install build

# Deploy to local testing
deploy:
    @echo "Deploying to local testing..."
    @just deploy-excel
    @just deploy-libre

# Deploy Excel add-in locally
deploy-excel:
    @echo "Installing Excel add-in for local testing..."
    @just build-excel
    @# Sideload manifest for testing
    @echo "Excel add-in built. Sideload from: dist/officejs/manifest.xml"

# Deploy LibreOffice extension locally
deploy-libre:
    @echo "Installing LibreOffice extension for local testing..."
    @just build-libre
    unopkg add --force dist/uno/economic-toolkit.oxt

# Run security audit
security:
    @echo "Running security audit..."
    npm audit
    julia --project=. -e 'using Pkg; Pkg.audit()'

# Update dependencies
update:
    @echo "Updating dependencies..."
    julia --project=. -e 'using Pkg; Pkg.update()'
    npm update

# Format all code
format:
    @echo "Formatting code..."
    @just lint-fix

# Watch mode for development
watch:
    @echo "Starting watch mode..."
    npm run watch

# Start Julia REPL with project
repl:
    julia --project=.

# Benchmark performance
benchmark:
    @echo "Running benchmarks..."
    julia --project=. test/benchmarks/run_benchmarks.jl

# Generate documentation
docs:
    @echo "Generating documentation..."
    julia --project=. docs/make.jl
    npm run docs

# Serve documentation locally
docs-serve:
    @echo "Serving documentation..."
    cd docs/build && python3 -m http.server 8000

# Check code quality
quality:
    @echo "Checking code quality..."
    @just lint
    @just test
    @just security

# Pre-commit hook (run before committing)
pre-commit:
    @echo "Running pre-commit checks..."
    @just lint-fix
    @just test
    @echo "Pre-commit checks passed!"

# CI/CD simulation (what CI will run)
ci:
    @echo "Simulating CI/CD pipeline..."
    @just install
    @just lint
    @just test-coverage
    @just build
    @just security
    @echo "CI simulation complete!"

# Docker/Podman build
container-build:
    @echo "Building container image..."
    podman build -t economic-toolkit:latest .

# Run container
container-run:
    @echo "Running container..."
    podman run -it --rm -p 8080:8080 economic-toolkit:latest

# Show project status
status:
    @echo "=== Economic Toolkit v2.0 Status ==="
    @echo ""
    @echo "Git status:"
    @git status -s
    @echo ""
    @echo "Installed tools:"
    @command -v julia > /dev/null && echo "  ✓ Julia $(julia --version | grep -oE '[0-9.]+' | head -1)" || echo "  ✗ Julia not found"
    @command -v node > /dev/null && echo "  ✓ Node.js $(node --version)" || echo "  ✗ Node.js not found"
    @command -v podman > /dev/null && echo "  ✓ Podman $(podman --version | grep -oE '[0-9.]+' | head -1)" || echo "  ⚠ Podman not found"
    @command -v just > /dev/null && echo "  ✓ Just $(just --version | grep -oE '[0-9.]+' | head -1)" || echo "  ⚠ Just not found"
    @echo ""
    @echo "Cache status:"
    @[ -d ~/.economic-toolkit/cache ] && echo "  Cache directory exists" || echo "  No cache directory"
    @[ -f ~/.economic-toolkit/cache/data.db ] && echo "  Cache database exists ($(du -h ~/.economic-toolkit/cache/data.db | cut -f1))" || echo "  No cache database"
    @echo ""

# Release build (production)
release:
    @echo "Building production release..."
    @just clean
    @just install
    @just test
    @just build
    @echo "Release build complete!"
    @echo "Artifacts in dist/"

# Publish to package registry (placeholder)
publish:
    @echo "Publishing package..."
    @echo "⚠ Not implemented yet"

# Help for specific commands
help-dev:
    @echo "Development Commands:"
    @echo "  just dev          - Start development servers"
    @echo "  just test         - Run all tests"
    @echo "  just lint         - Lint code"
    @echo "  just watch        - Watch mode for auto-rebuild"
    @echo "  just repl         - Start Julia REPL"

help-build:
    @echo "Build Commands:"
    @echo "  just build        - Build all platforms"
    @echo "  just build-excel  - Build Excel add-in only"
    @echo "  just build-libre  - Build LibreOffice extension only"
    @echo "  just clean        - Clean build artifacts"
    @echo "  just rebuild      - Clean and rebuild"

help-test:
    @echo "Testing Commands:"
    @echo "  just test              - Run all tests"
    @echo "  just test-julia        - Run Julia tests"
    @echo "  just test-typescript   - Run TypeScript tests"
    @echo "  just test-coverage     - Run tests with coverage"
    @echo "  just benchmark         - Run performance benchmarks"
