#!/usr/bin/env bats

load 'test_helper'

setup() {
    TEST_TEMP_DIR="$(mktemp -d -t wesley-bats-XXXXXX)"
    cd "$TEST_TEMP_DIR"

    continuum_setup_wesley_cli
    CONTINUUM_SCHEMA="$CONTINUUM_REPO_ROOT/schemas/continuum-receipt-family.graphql"
}

teardown() {
    if [[ -d "$TEST_TEMP_DIR" ]]; then
        rm -rf "$TEST_TEMP_DIR"
    fi
}

@test "contract release help works" {
    run node "$CLI_PATH" contract release --help
    assert_success
    assert_output --partial "Assemble one versioned contract bundle from one authored family"
    assert_output --partial "--family"
    assert_output --partial "--bundle-out"
}

@test "contract release assembles a witnessed bundle" {
    cp "$CONTINUUM_SCHEMA" schema.graphql

    run node "$CLI_PATH" contract release \
        --profile continuum \
        --family receipt-family \
        --schema schema.graphql \
        --release 0.1.0 \
        --bundle-out out/bundle \
        --json

    assert_success
    local json="$output"
    assert_json "$json" '.success == true and .result.profile == "continuum" and .result.family == "receipt-family" and .result.witness.status == "pass"'
    assert_file_exist out/bundle/bundle.json
    assert_file_exist out/bundle/source/authority.json
    assert_file_exist out/bundle/source/admitted.graphql
    assert_file_exist out/bundle/realization/manifest.json
    assert_file_exist out/bundle/witness/conformance.json
    assert_file_exist out/bundle/targets/warp-ttd/manifest/manifest.json
    assert_file_exist out/bundle/targets/echo/ir.json
    run jq -e '.kind == "wesley.contract.bundle.v1" and (.compatibility.consumers | length) == 2' out/bundle/bundle.json
    assert_success
}

@test "contract sync copies declared projections into warp-ttd and echo roots" {
    cp "$CONTINUUM_SCHEMA" schema.graphql
    node "$CLI_PATH" contract release \
        --profile continuum \
        --family receipt-family \
        --schema schema.graphql \
        --release 0.1.0 \
        --bundle-out out/bundle >/dev/null

    mkdir -p consumers/warp-ttd consumers/echo/packages/ttd-protocol-ts

    run node "$CLI_PATH" contract sync \
        --profile continuum \
        --bundle out/bundle \
        --consumer warp-ttd \
        --repo consumers/warp-ttd \
        --json
    assert_success
    local warp_json="$output"
    assert_json "$warp_json" '.success == true and .result.consumer == "warp-ttd" and .result.fileCount > 2 and .result.verification.status == "pass"'
    assert_file_exist consumers/warp-ttd/manifest/manifest.json
    assert_file_exist consumers/warp-ttd/typescript/index.ts
    assert_file_exist out/bundle/witness/sync-warp-ttd.json

    run node "$CLI_PATH" contract sync \
        --profile continuum \
        --bundle out/bundle \
        --consumer echo \
        --repo consumers/echo \
        --json
    assert_success
    local echo_json="$output"
    assert_json "$echo_json" '.success == true and .result.consumer == "echo" and .result.fileCount == 4 and .result.verification.status == "pass"'
    assert_file_exist consumers/echo/packages/ttd-protocol-ts/index.ts
    assert_file_exist consumers/echo/packages/ttd-protocol-ts/zod.ts
    assert_file_exist out/bundle/witness/sync-echo.json
}

@test "contract sync prunes destination-only generated files" {
    cp "$CONTINUUM_SCHEMA" schema.graphql
    node "$CLI_PATH" contract release \
        --profile continuum \
        --family receipt-family \
        --schema schema.graphql \
        --release 0.1.0 \
        --bundle-out out/bundle >/dev/null

    mkdir -p consumers/echo/packages/ttd-protocol-ts
    cat > consumers/echo/packages/ttd-protocol-ts/manual.ts <<'EOF'
export interface Receipt {
  receiptId: string;
}
EOF

    run node "$CLI_PATH" contract sync \
        --profile continuum \
        --bundle out/bundle \
        --consumer echo \
        --repo consumers/echo \
        --json

    assert_success
    local json="$output"
    assert_json "$json" '.success == true and .result.consumer == "echo" and .result.removedFileCount == 1 and .result.verification.status == "pass"'
    assert_file_not_exist consumers/echo/packages/ttd-protocol-ts/manual.ts
    assert_file_exist out/bundle/witness/sync-echo.json
}

@test "contract sync rejects unsafe bundle projection paths" {
    cp "$CONTINUUM_SCHEMA" schema.graphql
    node "$CLI_PATH" contract release \
        --profile continuum \
        --family receipt-family \
        --schema schema.graphql \
        --release 0.1.0 \
        --bundle-out out/bundle >/dev/null

    jq '.compatibility.consumers[0].projections[0].toRoot = "../escaped"' \
        out/bundle/bundle.json > out/bundle/bundle.tmp
    mv out/bundle/bundle.tmp out/bundle/bundle.json
    mkdir -p consumers/warp-ttd

    run node "$CLI_PATH" contract sync \
        --profile continuum \
        --bundle out/bundle \
        --consumer warp-ttd \
        --repo consumers/warp-ttd

    assert_failure
    assert_output --partial "unsafe projection.toRoot"
}

@test "contract sync reports malformed bundle JSON with context" {
    mkdir -p out/bundle consumers/warp-ttd
    printf '{not-json' > out/bundle/bundle.json

    run node "$CLI_PATH" contract sync \
        --profile continuum \
        --bundle out/bundle \
        --consumer warp-ttd \
        --repo consumers/warp-ttd

    assert_failure
    assert_output --partial "Contract bundle at out/bundle/bundle.json is not valid JSON"
}
