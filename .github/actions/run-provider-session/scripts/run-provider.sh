#!/usr/bin/env bash
set -euo pipefail

: "${BYPASS_PERMISSIONS:=true}"
: "${MODE:?MODE is required}"
: "${MODEL:=}"
: "${PROMPT:?PROMPT is required}"
: "${PROVIDER:?PROVIDER is required}"

write_output() {
	if [ "$MODE" = "pretty" ]; then
		tee provider-session-input.log | pnpm exec tsx src/bin.ts parse "$PROVIDER" | tee provider-session-pretty.log
	else
		tee provider-session-raw.log
	fi
}

run_provider() {
	case "$PROVIDER" in
		claude)
			flags=()
			if [ -n "$MODEL" ]; then
				flags+=(--model "$MODEL")
			fi
			if [ "$BYPASS_PERMISSIONS" = "true" ]; then
				flags+=(--dangerously-skip-permissions)
			fi
			claude -p "$PROMPT" --verbose --output-format stream-json "${flags[@]}" | write_output
			;;
		codex)
			flags=()
			if [ -n "$MODEL" ]; then
				flags+=(--model "$MODEL")
			fi
			if [ "$BYPASS_PERMISSIONS" = "true" ]; then
				flags+=(--dangerously-bypass-approvals-and-sandbox)
			fi
			codex exec "$PROMPT" --json "${flags[@]}" 2>/dev/null | write_output
			;;
		gemini)
			export GEMINI_CLI_TRUST_WORKSPACE=true
			flags=()
			if [ -n "$MODEL" ]; then
				flags+=(--model "$MODEL")
			fi
			if [ "$BYPASS_PERMISSIONS" = "true" ]; then
				flags+=(--yolo)
			fi
			gemini -p "$PROMPT" "${flags[@]}" --output-format stream-json 2>/dev/null | write_output
			;;
	esac
}

run_provider
