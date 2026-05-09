#!/usr/bin/env bash
set -euo pipefail

: "${PROVIDER:?PROVIDER is required}"

case "$PROVIDER" in
	claude)
		source_dir="$HOME/.claude/projects"
		;;
	codex)
		source_dir="$HOME/.codex/sessions"
		;;
	gemini)
		source_dir="$HOME/.gemini/tmp"
		;;
	*)
		echo "provider must be claude, codex, or gemini" >&2
		exit 1
		;;
esac

rm -rf provider-session-files
mkdir -p provider-session-files

if [ -d "$source_dir" ]; then
	cp -R "$source_dir"/. provider-session-files/
fi
