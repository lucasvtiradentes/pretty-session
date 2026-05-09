#!/usr/bin/env bash
set -euo pipefail

case "$PROVIDER" in
	claude | codex | gemini) ;;
	*)
		echo "provider must be claude, codex, or gemini" >&2
		exit 1
		;;
esac

case "$MODE" in
	raw | pretty) ;;
	*)
		echo "mode must be raw or pretty" >&2
		exit 1
		;;
esac
