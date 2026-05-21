# BEARING

## Current Hill

Turn Continuum into a clean coordination spine for the active stack.

Right now that means:

- freezing repo purpose so it does not drift back into "third system" mode
- extracting the strongest salvage from old Continuum into active design work
- establishing METHOD lanes and signposts
- deciding the first real coordination artifacts this repo should own
- freezing the explicit Continuum invariants so sibling runtime work and shared
  contract work do not drift apart in different repos

## Not This Hill

- not a new substrate
- not a replacement for Echo
- not a replacement for `git-warp`
- not a shadow contract compiler next to Wesley

## Optic Admission Coordination

Continuum owns the role map for optic admission, not a premature shared
protocol family. Current split:

- Wesley compiles artifacts and registration descriptors.
- Echo registers artifacts, returns runtime-local handles, admits or obstructs
  invocations, instruments access, and emits witnesses/readings.
- Authority layers issue grants and capability presentations.
- Applications hide artifact handles, basis references, and runtime coordinates
  behind product-facing adapters.

Do not freeze shared protocol contracts for this lane until the compiled
artifact, registration, invocation, and witness path is proven in the owning
repos.
