# Continuum Schemas

This directory is the authored home for **Continuum-owned shared contract
families**.

Continuum does **not** own every schema in the stack.

It owns only the families whose semantics must be shared across engines and
tools:

- shared observer/debugger contract families
- shared witness/receipt/reintegration families
- future shared lane/settlement families once they are authored here

It does **not** own:

- Echo-local engine schemas
- `git-warp`-local engine schemas
- `warp-ttd` session/control schemas that are product-local rather than shared
- Wesley-generated artifacts

Current authored family:

- `continuum-receipt-family.graphql`

Wesley compiles the schemas in this directory into Rust, TypeScript, manifests,
and codec artifacts. Echo, `git-warp`, and `warp-ttd` should consume generated
artifacts instead of re-authoring the same contracts by hand.
