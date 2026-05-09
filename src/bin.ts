import { realpathSync } from 'node:fs'
import { createRequire } from 'node:module'
import { basename } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import type { Program as CaporalProgram } from '@caporal/core'
import { cliCommands } from './cli/catalog'
import { registerProgram } from './cli/register'
import { COMPLETION_COMMAND_NAME } from './commands/completion/register'
import { CLI_NAME, VERSION } from './constants'
import { env } from './env'

let programInstance: CaporalProgram | undefined
let programInstanceBin: string | undefined

const require = createRequire(import.meta.url)
const caporal = require('@caporal/core') as {
	Program?: new () => CaporalProgram
	default?: { Program?: new () => CaporalProgram }
}
const Program = caporal.Program ?? caporal.default?.Program
if (!Program) throw new Error('Caporal Program constructor not found')
const ProgramConstructor = Program

function isDirectRun() {
	if (!process.argv[1]) return false

	try {
		return realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))
	} catch {
		return import.meta.url === pathToFileURL(process.argv[1]).href
	}
}

function getProgramBin() {
	if (env.PRETTY_SESSION_PROG_NAME) return env.PRETTY_SESSION_PROG_NAME
	if (isDirectRun() && process.argv[1]) return basename(process.argv[1])
	return CLI_NAME
}

async function runCli(args = process.argv.slice(2), binName = CLI_NAME) {
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
	const program = new ProgramConstructor()
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

	registerProgram(program, cliCommands)
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

const exitCode = await runCli(process.argv.slice(2), getProgramBin())
if (exitCode > 0) process.exit(exitCode)
