# RingStar

RingStar is an offline football career simulator. Its backend is written in Haskell and compiled to WebAssembly (WASM) so the game can run entirely in a browser without network access. A lightweight frontend provides a simple interface for managing your team and progressing through seasons.

## Build Prerequisites

- GHC with WebAssembly support
- WASI SDK or a similar toolchain for building Haskell to WASM
- A modern web browser
- Optional: Node.js for local development helpers

## Installation

1. Clone this repository.
2. Build the backend with your Haskell build tool (e.g., `stack build` or `cabal build`) targeting WASM.
3. Open the `index.html` file from the frontend in your browser to start the simulator.

## Project Structure

```
README.md       - Project overview and instructions
src/            - Haskell source code for the core simulator
frontend/       - HTML, CSS and JavaScript for the interface
wasm/           - Compiled WebAssembly artifacts
```

