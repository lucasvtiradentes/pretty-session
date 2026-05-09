#!/usr/bin/env bash
set -euo pipefail

case "$PROVIDER" in
	codex)
		if [ -n "${CODEX_AUTH_JSON:-}" ]; then
			mkdir -p ~/.codex
			echo "$CODEX_AUTH_JSON" > ~/.codex/auth.json
		fi
		;;
	gemini)
		if [ -n "${GEMINI_CREDENTIALS:-}" ]; then
			mkdir -p ~/.gemini
			printf '%s' "$GEMINI_CREDENTIALS" > ~/.gemini/oauth_creds.json
			chmod 600 ~/.gemini/oauth_creds.json
			echo '{"security":{"auth":{"selectedType":"oauth-personal"}}}' > ~/.gemini/settings.json
		fi
		;;
esac
