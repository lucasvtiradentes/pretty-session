import { createRequire } from 'node:module'
import type { Program as CaporalProgram } from '@caporal/core'
import { COMPLETION_COMMAND_NAME, registerCompletionCommand } from './commands/completion/register'
import { registerParseCommand } from './commands/parse'
import { registerWatchCommand } from './commands/watch'
import { CLI_NAME, VERSION } from './constants'

let programInstance: CaporalProgram | undefined
let programInstanceBin: string | undefined

export async function runCli(args = process.argv.slice(2), binName = CLI_NAME) {
	try {
		const result = await getProgram(binName).run(args.length === 0 ? ['--help'] : args)
		return typeof result === 'number' && result > 0 ? result : 0
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error)
		console.log(`error: ${message}`)
		return 1
	}
}

function getProgram(binName: string): CaporalProgram {
	if (!programInstance || programInstanceBin !== binName) {
		programInstance = createProgram(binName)
		programInstanceBin = binName
	}
	return programInstance
}

function createProgram(binName: string): CaporalProgram {
	const program = new (getProgramConstructor())()
		.bin(binName)
		.name(binName)
		.description('Pretty formatter for AI coding agent sessions')
		.version(VERSION)
		.disableGlobalOption('--no-color')
		.disableGlobalOption('--quiet')
		.disableGlobalOption('--silent')
		.disableGlobalOption('-v')
		.disableGlobalOption('-V')
		.option('-v, --version', 'Show version', {
			global: true,
			action: () => {
				console.log(VERSION)
				return false
			},
		})

	registerParseCommand(program)
	registerWatchCommand(program)
	registerCompletionCommand(program)
	program.help(formatHelpExamples(binName))

	return program
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
		`  ${binName} ${COMPLETION_COMMAND_NAME} zsh`,
	].join('\n')
}

function getProgramConstructor() {
	const require = createRequire(import.meta.url)
	const module = require('@caporal/core') as {
		Program?: new () => CaporalProgram
		default?: { Program?: new () => CaporalProgram }
	}
	const Program = module.Program ?? module.default?.Program
	if (!Program) throw new Error('Caporal Program constructor not found')
	return Program
}
