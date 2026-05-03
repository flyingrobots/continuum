continuum_repo_root() {
    cd "$BATS_TEST_DIRNAME/../.." && pwd
}

continuum_setup_wesley_cli() {
    CONTINUUM_REPO_ROOT="${CONTINUUM_REPO_ROOT:-$(continuum_repo_root)}"
    CLI_PATH="${WESLEY_CLI_PATH:-$CONTINUUM_REPO_ROOT/../wesley/packages/wesley-host-node/bin/wesley.mjs}"

    if [[ ! -f "$CLI_PATH" ]]; then
        skip "set WESLEY_CLI_PATH or keep sibling Wesley at ../wesley"
    fi

    local continuum_module="$CONTINUUM_REPO_ROOT/wesley/continuum-cli-module.mjs"
    if [[ ! -f "$continuum_module" ]]; then
        skip "missing Continuum Wesley module at $continuum_module"
    fi

    case ":${WESLEY_MODULES:-}:" in
        *":$continuum_module:"*) ;;
        "::") export WESLEY_MODULES="$continuum_module" ;;
        *) export WESLEY_MODULES="$continuum_module:$WESLEY_MODULES" ;;
    esac
}

assert_success() {
    if [[ "$status" -ne 0 ]]; then
        echo "expected success, got status $status"
        echo "$output"
        return 1
    fi
}

assert_failure() {
    if [[ "$status" -eq 0 ]]; then
        echo "expected failure, got success"
        echo "$output"
        return 1
    fi
}

assert_output() {
    if [[ "${1:-}" == "--partial" ]]; then
        shift
        if [[ "$output" != *"$1"* ]]; then
            echo "expected output to contain: $1"
            echo "$output"
            return 1
        fi
        return 0
    fi

    if [[ "$output" != "${1:-}" ]]; then
        echo "expected output: ${1:-}"
        echo "$output"
        return 1
    fi
}

refute_output() {
    if [[ "${1:-}" == "--partial" ]]; then
        shift
        if [[ "$output" == *"$1"* ]]; then
            echo "expected output not to contain: $1"
            echo "$output"
            return 1
        fi
        return 0
    fi

    if [[ "$output" == "${1:-}" ]]; then
        echo "expected output to differ from: ${1:-}"
        echo "$output"
        return 1
    fi
}

assert_file_exist() {
    if [[ ! -f "$1" ]]; then
        echo "expected file to exist: $1"
        return 1
    fi
}

assert_file_not_exist() {
    if [[ -e "$1" ]]; then
        echo "expected path not to exist: $1"
        return 1
    fi
}
