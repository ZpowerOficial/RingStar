{
  description = "RingStar project";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs";

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
    in {
      packages.${system}.default = pkgs.stdenv.mkDerivation {
        name = "ringstar";
        src = self;
      };

      devShells.${system}.default = pkgs.mkShell {
        buildInputs = [ pkgs.ghc pkgs.cabal-install ];
      };
    };
}
