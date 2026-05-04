import { realpathSync } from "node:fs"
import { createRequire } from "node:module"
import { basename } from "node:path"
import { createInterface } from "node:readline"
import { fileURLToPath, pathToFileURL } from "node:url"
import type { Program as CaporalProgram } from "@caporal/core"
import { COMPLETION_COMMAND_NAME, registerCompletionCommand } from "./completion"
import { CLI_NAME, PROVIDER_VALUES, Provider, VERSION } from "./constants"
import { ParserState } from "./providers/claude/handlers/base"
import { parseJsonLine } from "./providers/claude/parser"
import { CodexState, finalizeCodex, parseCodexLine } from "./providers/codex/parser"
import { GeminiState, finalizeGemini, parseGeminiLine } from "./providers/gemini/parser"
import type { ParseResult } from "./result"

let programInstance: CaporalProgram | undefined
let programInstanceBin: string | undefined

export async function runCli(args = process.argv.slice(2)) {
	try {
		const result = await getProgram().run(args.length === 0 ? ["--help"] : args)
		return typeof result === "number" && result > 0 ? result : 0
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error)
		console.log(`error: ${message}`)
		return 1
	}
}

function getProgram(): CaporalProgram {
	const binName = getProgramBin()
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
		.description("Pretty formatter for AI coding agent sessions")
		.version(VERSION)
		.disableGlobalOption("--no-color")
		.disableGlobalOption("--quiet")
		.disableGlobalOption("--silent")
		.disableGlobalOption("-v")
		.disableGlobalOption("-V")
		.option("-v, --version", "Show version", {
			global: true,
			action: () => {
				console.log(VERSION)
				return false
			},
		})

	for (const provider of PROVIDER_VALUES) {
		program
			.command(provider, getProviderDescription(provider as Provider))
			.strict(false)
			.action(() => runProvider(provider as Provider))
	}

	registerCompletionCommand(program)
	program.help(formatHelpExamples(binName))

	return program
}

const providerDescriptions = {
	[Provider.Claude]: "Format Claude Code stream or saved session JSONL",
	[Provider.Codex]: "Format Codex stream or saved session JSONL",
	[Provider.Gemini]: "Format Gemini stream or saved session JSONL",
} as const satisfies Record<Provider, string>

function getProviderDescription(provider: Provider) {
	return providerDescriptions[provider]
}

function formatHelpExamples(binName: string) {
	return [
		"Examples:",
		`  claude -p "explain this code" --output-format stream-json | ${binName} claude`,
		`  cat ~/.claude/projects/.../session.jsonl | ${binName} claude`,
		`  codex exec "do something" --json | ${binName} codex`,
		`  cat ~/.codex/sessions/.../session.jsonl | ${binName} codex`,
		`  gemini -p "do something" --output-format stream-json | ${binName} gemini`,
		`  cat ~/.gemini/tmp/.../session.jsonl | ${binName} gemini`,
		`  ${binName} ${COMPLETION_COMMAND_NAME} zsh`,
	].join("\n")
}

function runProvider(provider: Provider) {
	const { parseLine, onClose } = createParser(provider)
	const rl = createInterface({ input: process.stdin })

	rl.on("line", (line) => {
		const trimmed = line.trim()
		if (trimmed) {
			const output = parseLine(trimmed).getOutput()
			if (output) process.stdout.write(output)
		}
	})

	if (onClose) {
		const finalize = onClose
		rl.on("close", () => {
			const output = finalize().getOutput()
			if (output) process.stdout.write(output)
		})
	}
}

function createParser(provider: Provider): { parseLine: (line: string) => ParseResult; onClose?: () => ParseResult } {
	switch (provider) {
		case Provider.Claude: {
			const state = new ParserState()
			return { parseLine: (line) => parseJsonLine(line, state) }
		}
		case Provider.Codex: {
			const state = new CodexState()
			return { parseLine: (line) => parseCodexLine(line, state), onClose: () => finalizeCodex(state) }
		}
		case Provider.Gemini: {
			const state = new GeminiState()
			return { parseLine: (line) => parseGeminiLine(line, state), onClose: () => finalizeGemini(state) }
		}
	}
}

function getProgramBin() {
	if (process.env.PRETTY_SESSION_PROG_NAME) return process.env.PRETTY_SESSION_PROG_NAME
	if (isDirectRun() && process.argv[1]) return basename(process.argv[1])
	return CLI_NAME
}

function isDirectRun() {
	if (!process.argv[1]) return false

	try {
		return realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))
	} catch {
		return import.meta.url === pathToFileURL(process.argv[1]).href
	}
}

function getProgramConstructor() {
	const require = createRequire(import.meta.url)
	const module = require("@caporal/core") as {
		Program?: new () => CaporalProgram
		default?: { Program?: new () => CaporalProgram }
	}
	const Program = module.Program ?? module.default?.Program
	if (!Program) throw new Error("Caporal Program constructor not found")
	return Program
}

const exitCode = await runCli()
if (exitCode > 0) process.exit(exitCode)
