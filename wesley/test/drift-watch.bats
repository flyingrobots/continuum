#!/usr/bin/env bats

load 'test_helper'

setup() {
    TEST_TEMP_DIR="$(mktemp -d -t wesley-bats-XXXXXX)"
    cd "$TEST_TEMP_DIR"

    continuum_setup_wesley_cli
    CONTINUUM_SCHEMA="$CONTINUUM_REPO_ROOT/schemas/continuum-receipt-family.graphql"
}

teardown() {
    if [[ -d "${MIRROR_TEMP_DIR:-}" ]]; then
        rm -rf "$MIRROR_TEMP_DIR"
    fi
    if [[ -d "$TEST_TEMP_DIR" ]]; then
        rm -rf "$TEST_TEMP_DIR"
    fi
}

release_receipt_family_bundle() {
    node "$CLI_PATH" contract release \
        --family receipt-family \
        --release 0.1.0 \
        --schema "$CONTINUUM_SCHEMA" \
        --bundle-out out/proof >/dev/null
}

make_mirror_dir() {
    MIRROR_TEMP_DIR="$(mktemp -d -t wesley-mirror-XXXXXX)"
    export MIRROR_TEMP_DIR
}

@test "drift-watch help works" {
    run node "$CLI_PATH" drift-watch --help
    assert_success
    assert_output --partial "Inspect local Continuum outputs and nearby mirrors for contract drift"
    assert_output --partial "--mirror-root"
    assert_output --partial "--report-out"
}

@test "drift-watch passes for coherent receipt-family mirrors" {
    release_receipt_family_bundle

    make_mirror_dir
    mkdir -p "$MIRROR_TEMP_DIR/mock"
    cp out/proof/targets/echo/mock/summary.json "$MIRROR_TEMP_DIR/mock/summary.json"

    run node "$CLI_PATH" drift-watch \
        --scope receipt-family \
        --schema "$CONTINUUM_SCHEMA" \
        --out-dir out/proof \
        --ttd-dir out/proof/targets/warp-ttd \
        --echo-dir out/proof/targets/echo \
        --mirror-root "$MIRROR_TEMP_DIR" \
        --json

    assert_success
    echo "$output" | jq -e '.success == true and .result.status == "pass" and .result.summary.failed == 0' >/dev/null
    echo "$output" | jq -e '.result.judgmentProfile.profilePackage == "continuum/wesley/profile" and .result.judgmentProfile.enginePackage == "@wesley/holmes"' >/dev/null
    echo "$output" | jq -e '.result.surfaces.mirrors[0].surfaceCount == 1 and (.result.failures.mirror | length == 0)' >/dev/null
}

@test "drift-watch accepts a single mirror surface file" {
    release_receipt_family_bundle

    make_mirror_dir
    mkdir -p "$MIRROR_TEMP_DIR/mock"
    cp out/proof/targets/echo/mock/summary.json "$MIRROR_TEMP_DIR/mock/summary.json"

    run node "$CLI_PATH" drift-watch \
        --scope receipt-family \
        --schema "$CONTINUUM_SCHEMA" \
        --out-dir out/proof \
        --ttd-dir out/proof/targets/warp-ttd \
        --echo-dir out/proof/targets/echo \
        --mirror-root "$MIRROR_TEMP_DIR/mock/summary.json" \
        --json

    assert_success
    echo "$output" | jq -e '.result.surfaces.mirrors[0].surfaceCount == 1 and .result.surfaces.mirrors[0].surfaces[0].kind == "echo-summary"' >/dev/null
}

@test "drift-watch fails when a mirror summary drifts from the authored schema hash" {
    release_receipt_family_bundle

    make_mirror_dir
    mkdir -p "$MIRROR_TEMP_DIR/mock"
    cp out/proof/targets/echo/mock/summary.json "$MIRROR_TEMP_DIR/mock/summary.json"
    node - <<'NODE'
const fs = require('fs');
const path = `${process.env.MIRROR_TEMP_DIR}/mock/summary.json`;
const summary = JSON.parse(fs.readFileSync(path, 'utf8'));
summary.schemaHash = '0000000000000000000000000000000000000000000000000000000000000000';
fs.writeFileSync(path, JSON.stringify(summary, null, 2) + '\n');
NODE

    run node "$CLI_PATH" drift-watch \
        --scope receipt-family \
        --schema "$CONTINUUM_SCHEMA" \
        --out-dir out/proof \
        --ttd-dir out/proof/targets/warp-ttd \
        --echo-dir out/proof/targets/echo \
        --mirror-root "$MIRROR_TEMP_DIR" \
        --report-out out/proof/witness/drift-watch.json

    assert_failure
    assert_output --partial "Continuum drift watch failed"
    run jq -e '.checks[] | select(.id == "mirror.1.surface-1.hash-coherence" and .status == "fail")' out/proof/witness/drift-watch.json
    assert_success
}

@test "drift-watch fails when a mirror root exposes only unpinned contract declarations" {
    release_receipt_family_bundle

    make_mirror_dir
    cat > "$MIRROR_TEMP_DIR/protocol.ts" <<'EOF'
export interface Receipt {
  receiptId: string;
}

export interface DeliveryObservation {
  observationId: string;
}
EOF

    run node "$CLI_PATH" drift-watch \
        --scope receipt-family \
        --schema "$CONTINUUM_SCHEMA" \
        --out-dir out/proof \
        --ttd-dir out/proof/targets/warp-ttd \
        --echo-dir out/proof/targets/echo \
        --mirror-root "$MIRROR_TEMP_DIR" \
        --report-out out/proof/witness/drift-watch.json

    assert_failure
    assert_output --partial "Continuum drift watch failed"
    run jq -e '.checks[] | select(.id == "mirror.1.provenance" and .status == "fail")' out/proof/witness/drift-watch.json
    assert_success
}
