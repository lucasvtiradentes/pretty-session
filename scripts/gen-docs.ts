import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { commandDefinitionsFromModules, loadCommandModules } from 'unicommand'
import type { CommandDefinition } from 'unicommand'

const readmePath = 'README.md'
const startMarker = '<!-- <DYNFIELD:COMMANDS> -->'
const endMarker = '<!-- </DYNFIELD:COMMANDS> -->'
const docsBinName = 'pts'

const readme = readFileSync(readmePath, 'utf8')
const generated = generateCommandDocs(await readCommandDefinitions())

if (countOccurrences(readme, startMarker) !== 1 || countOccurrences(readme, endMarker) !== 1) {
	throw new Error(`README.md must contain ${startMarker} and ${endMarker}`)
}

writeFileSync(readmePath, replaceBetween(readme, startMarker, endMarker, generated), 'utf8')

async function readCommandDefinitions() {
	return commandDefinitionsFromModules(await loadCommandModules(join(process.cwd(), 'src', 'commands')))
}

function generateCommandDocs(commands: readonly CommandDefinition[]) {
	const groups = [...parentCommands(commands)].map(([parent, subcommands]) => parentCommandDocs(parent, subcommands))
	const standaloneCommands = commands.filter((command) => !command.name.includes(' '))
	if (standaloneCommands.length > 0) groups.push(otherCommandDocs(standaloneCommands))
	const lines = groups.flatMap((commandLines, index) => {
		return index === 0 ? commandLines : ['', ...commandLines]
	})
	return ['```sh', ...lines, '```'].join('\n')
}

function parentCommands(commands: readonly CommandDefinition[]) {
	const groups = new Map<string, CommandDefinition[]>()
	for (const command of commands) {
		const [parent, subcommand] = command.name.split(' ')
		if (!parent || !subcommand) continue
		groups.set(parent, [...(groups.get(parent) ?? []), command])
	}
	return [...groups.entries()].sort(([left], [right]) => left.localeCompare(right))
}

function parentCommandDocs(parent: string, commands: readonly CommandDefinition[]) {
	return [`# ${parent} commands`, ...commands.flatMap((command) => commandDocs(command))]
}

function commandDocs(command: CommandDefinition) {
	return [commandUsage(command.name, usageSuffix(command))]
}

function otherCommandDocs(commands: readonly CommandDefinition[]) {
	return ['# other commands', ...commands.flatMap((command) => commandDocs(command))]
}

function commandUsage(commandPath: string, suffix: string) {
	return `${docsBinName} ${commandPath}${suffix}`
}

function usageSuffix(command: CommandDefinition) {
	const args = command.arguments?.map((arg) => arg.synopsis) ?? []
	const options = command.options?.map((option) => optionUsage(option)) ?? []
	return [...args, ...options].length > 0 ? ` ${[...args, ...options].join(' ')}` : ''
}

function optionUsage(option: NonNullable<CommandDefinition['options']>[number]) {
	const synopsis = option.value ? `--${option.name} ${option.value}` : `--${option.name}`
	return option.config?.required ? synopsis : `[${synopsis}]`
}

function replaceBetween(source: string, start: string, end: string, replacement: string) {
	const before = source.slice(0, source.indexOf(start) + start.length)
	const after = source.slice(source.indexOf(end))
	return `${before}\n${replacement}\n${after}`
}

function countOccurrences(source: string, value: string) {
	return source.split(value).length - 1
}
