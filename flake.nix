{
  description = "Economic Toolkit v2.0 - Cross-platform Excel/LibreOffice add-in";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };

        juliaWithPackages = pkgs.julia.withPackages [
          "HTTP"
          "JSON3"
          "SQLite"
          "DataFrames"
          "Dates"
        ];

      in
      {
        # Development shell
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            # Julia
            juliaWithPackages

            # Node.js
            nodejs_20
            nodePackages.npm

            # Build tools
            just
            git

            # Containerization
            podman

            # Linting
            nodePackages.eslint
            nodePackages.prettier

            # Testing
            nodePackages.jest

            # Optional
            sqlite
            curl
            jq
          ];

          shellHook = ''
            echo "╔════════════════════════════════════════════════════════════╗"
            echo "║  Economic Toolkit v2.0 Development Environment            ║"
            echo "╚════════════════════════════════════════════════════════════╝"
            echo ""
            echo "Available commands:"
            echo "  just --list          # Show all available commands"
            echo "  just install         # Install dependencies"
            echo "  just dev             # Start development servers"
            echo "  just test            # Run tests"
            echo "  just build           # Build all targets"
            echo "  ./bootstrap.sh       # Check dependencies"
            echo ""
            echo "Julia: $(julia --version | head -1)"
            echo "Node: $(node --version)"
            echo "npm: $(npm --version)"
            echo ""

            # Set up Julia environment
            export JULIA_PROJECT="$PWD"

            # Set up Node environment
            export NODE_ENV="development"

            # Cache directories
            export JULIA_DEPOT_PATH="$PWD/.julia"
            export NPM_CONFIG_CACHE="$PWD/.npm"

            # Set up Git hooks (optional)
            if [ ! -f .git/hooks/pre-commit ]; then
              echo "Setting up Git pre-commit hook..."
              cat > .git/hooks/pre-commit << 'EOF'
#!/usr/bin/env bash
just pre-commit
EOF
              chmod +x .git/hooks/pre-commit
            fi
          '';

          # Environment variables
          JULIA_NUM_THREADS = "auto";
          JULIA_DEPOT_PATH = ".julia";
        };

        # Packages
        packages = {
          # Julia backend package
          julia-backend = pkgs.stdenv.mkDerivation {
            pname = "economic-toolkit-julia";
            version = "2.0.0-dev";

            src = ./.;

            buildInputs = [ juliaWithPackages ];

            buildPhase = ''
              mkdir -p $out
              cp -r src/julia $out/
              cp Project.toml $out/
            '';

            installPhase = ''
              mkdir -p $out/bin
              cat > $out/bin/economic-toolkit << EOF
#!/usr/bin/env bash
julia --project=$out -e 'using EconomicToolkit; start_server()'
EOF
              chmod +x $out/bin/economic-toolkit
            '';

            meta = with pkgs.lib; {
              description = "Economic Toolkit Julia backend";
              license = with licenses; [ mit ];
              platforms = platforms.unix;
            };
          };

          # TypeScript/Node package
          node-frontend = pkgs.buildNpmPackage {
            pname = "economic-toolkit-frontend";
            version = "2.0.0-dev";

            src = ./.;

            npmDepsHash = "sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";  # Update with real hash

            buildPhase = ''
              npm run build
            '';

            installPhase = ''
              mkdir -p $out
              cp -r dist $out/
            '';

            meta = with pkgs.lib; {
              description = "Economic Toolkit TypeScript frontend";
              license = with pkgs.lib.licenses; [ mit ];
              platforms = pkgs.lib.platforms.unix;
            };
          };

          # Container image
          container = pkgs.dockerTools.buildLayeredImage {
            name = "economic-toolkit";
            tag = "2.0.0-dev";

            contents = with pkgs; [
              juliaWithPackages
              nodejs_20
              bash
              coreutils
            ];

            config = {
              Cmd = [ "julia" "--project=/app" "/app/src/julia/EconomicToolkit.jl" ];
              WorkingDir = "/app";
              ExposedPorts = {
                "8080/tcp" = {};
              };
              Env = [
                "JULIA_PROJECT=/app"
              ];
            };
          };

          default = self.packages.${system}.julia-backend;
        };

        # Apps
        apps = {
          default = {
            type = "app";
            program = "${self.packages.${system}.julia-backend}/bin/economic-toolkit";
          };
        };

        # Checks (tests)
        checks = {
          julia-tests = pkgs.stdenv.mkDerivation {
            name = "economic-toolkit-julia-tests";
            src = ./.;

            buildInputs = [ juliaWithPackages ];

            buildPhase = ''
              julia --project=. -e 'using Pkg; Pkg.test()'
            '';

            installPhase = ''
              mkdir -p $out
              echo "Tests passed" > $out/result
            '';
          };

          typescript-tests = pkgs.stdenv.mkDerivation {
            name = "economic-toolkit-typescript-tests";
            src = ./.;

            buildInputs = with pkgs; [ nodejs_20 ];

            buildPhase = ''
              npm ci
              npm test
            '';

            installPhase = ''
              mkdir -p $out
              echo "Tests passed" > $out/result
            '';
          };
        };

        # Formatter
        formatter = pkgs.nixpkgs-fmt;
      }
    );

  nixConfig = {
    extra-substituters = [
      "https://cache.nixos.org"
    ];
    extra-trusted-public-keys = [
      "cache.nixos.org-1:6NCHdD59X431o0gWypbMrAURkbJ16ZPMQFGspcDShjY="
    ];
  };
}
