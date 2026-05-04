# TTD Compiler Schemas

This directory holds schemas owned by the Continuum Wesley TTD compiler module.

- `ttd-ir.schema.json` describes the compiler's emitted TTD IR shape.

Do not treat this directory as the authored home for product protocol schemas:

- `warp-ttd` owns the host-neutral debugger protocol SDL.
- Echo owns Echo runtime, CAS, and WASM ABI schema truth.
- Continuum `schemas/` owns shared cross-engine contract families.
- Generic Wesley owns only generic compiler and evidence schemas.
