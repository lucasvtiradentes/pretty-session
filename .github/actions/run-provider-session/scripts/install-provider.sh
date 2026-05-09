#!/usr/bin/env bash
set -euo pipefail

case "$PROVIDER" in
	claude)
		curl -fsSL https://claude.ai/install.sh | bash
		;;
	codex)
		npm install -g @openai/codex
		;;
	gemini)
		npm install -g @google/gemini-cli
		;;
esac
