import type { Program } from '@caporal/core'
import { getBashCompletionScript } from './bash'
import { getFishCompletionScript } from './fish'
import {
	type CompletionGroup,
	type CompletionOption,
	getCompletionBinNames,
	getOptionGroups,
	getRootCommands,
	getSubcommandGroups,
	isVisibleCompletionCommand,
} from './shared'
import { getZshCompletionScript } from './zsh'

export const COMPLETION_COMMAND_NAME = 'completion'

enum CompletionShell {
	Bash = 'bash',
	Fish = 'fish',
	Zsh = 'zsh',
}

const completionShells = Object.values(CompletionShell)

const completionScriptGenerators = {
	[CompletionShell.Bash]: getBashCompletionScript,
	[CompletionShell.Fish]: getFishCompletionScript,
	[CompletionShell.Zsh]: getZshCompletionScript,
} as const satisfies Record<
	CompletionShell,
	(
		binNames: string[],
		roots: CompletionGroup[],
		subcommands: Map<string, CompletionGroup[]>,
		options: Map<string, CompletionOption[]>,
	) => string
>

export function registerCompletionCommand(program: Program) {
	program
		.command(COMPLETION_COMMAND_NAME, 'Generate shell completion scripts')
		.argument('[shell]', 'Shell to generate completion for')
		.strict(false)
		.action(async ({ args, program }) => {
			const shell = args.shell ? String(args.shell) : ''
			if (isCompletionShell(shell)) {
				console.log(await getCompletionScript(program, shell))
				return 0
			}
			console.log(`error: unsupported shell '${shell || '<empty>'}'`)
			console.log(`supported: ${completionShells.join(', ')}`)
			return 1
		})
}

function isCompletionShell(value: string): value is CompletionShell {
	return (completionShells as readonly string[]).includes(value)
}

async function getCompletionScript(program: Program, shell: CompletionShell) {
	const commands = (await program.getAllCommands()).filter(isVisibleCompletionCommand)
	const roots = getRootCommands(commands)
	const subcommands = getSubcommandGroups(commands)
	subcommands.set(
		COMPLETION_COMMAND_NAME,
		completionShells.map((shell) => ({ name: shell, description: `Generate ${shell} completion` })),
	)
	const options = getOptionGroups(commands)
	return completionScriptGenerators[shell](getCompletionBinNames(program.getBin()), roots, subcommands, options)
}
