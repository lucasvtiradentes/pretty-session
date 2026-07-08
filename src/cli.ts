#!/usr/bin/env node
import { createPackageCommandCliRunner } from 'unicommand'
import { CLI_BIN_NAMES, CLI_DESCRIPTION, VERSION } from './constants'

const cli = createPackageCommandCliRunner({
	binNames: CLI_BIN_NAMES,
	description: CLI_DESCRIPTION,
	help: formatHelpExamples,
	importMetaUrl: import.meta.url,
	version: VERSION,
})

export const runCli = cli.runCli

if (cli.isDirectRun()) {
	process.exit(await runCli())
}

function formatHelpExamples(binName: string) {
	return [
		'Examples:',
		`  claude -p "explain this code" --output-format stream-json | ${binName} parse claude`,
		`  cat ~/.claude/projects/.../session.jsonl | ${binName} parse claude`,
		`  codex exec "do something" --json | ${binName} parse codex`,
		`  cat ~/.codex/sessions/.../session.jsonl | ${binName} parse codex`,
		`  gemini -p "do something" --output-format stream-json | ${binName} parse gemini`,
		`  cat ~/.gemini/tmp/.../session.jsonl | ${binName} parse gemini`,
		`  ${binName} watch codex <path-or-session-id>`,
		`  ${binName} completion zsh`,
	].join('\n')
}
