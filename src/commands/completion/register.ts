import { defineCommand, defineSubCommand } from '../../cli/define'
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

export const completionCommand = defineCommand({
	name: COMPLETION_COMMAND_NAME,
	description: 'Generate shell completion scripts',
	action: () => {
		console.log(`Available shells: ${completionShells.join(', ')}`)
		return 0
	},
	subcommands: completionShells.map((shell) =>
		defineSubCommand({
			name: shell,
			description: `Generate ${shell} completion script`,
			action: async ({ program }) => {
				console.log(await getCompletionScript(program, shell))
				return 0
			},
		}),
	),
})

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

async function getCompletionScript(program: import('@caporal/core').Program, shell: CompletionShell) {
	const commands = (await program.getAllCommands()).filter(isVisibleCompletionCommand)
	const roots = getRootCommands(commands)
	const subcommands = getSubcommandGroups(commands)
	const options = getOptionGroups(commands)
	return completionScriptGenerators[shell](getCompletionBinNames(program.getBin()), roots, subcommands, options)
}
