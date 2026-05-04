import type { Command, Program } from "@caporal/core"
import { CLI_BIN_NAMES } from "./constants"

export const COMPLETION_COMMAND_NAME = "completion"

type CompletionGroup = {
	description?: string
	name: string
}

type CompletionOption = {
	description?: string
	long?: string
	names: string[]
	short?: string
}

enum CompletionShell {
	Bash = "bash",
	Fish = "fish",
	Zsh = "zsh",
}

const completionShells = Object.values(CompletionShell)
const globalOptions: CompletionOption[] = [
	{ description: "Show help", long: "help", names: ["-h", "--help"], short: "h" },
	{ description: "Show version", long: "version", names: ["-v", "--version"], short: "v" },
]
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
		.command(COMPLETION_COMMAND_NAME, "Generate shell completion scripts")
		.argument("[shell]", "Shell to generate completion for")
		.strict(false)
		.action(async ({ args, program }) => {
			const shell = args.shell ? String(args.shell) : ""
			if (isCompletionShell(shell)) {
				console.log(await getCompletionScript(program, shell))
				return 0
			}
			console.log(`error: unsupported shell '${shell || "<empty>"}'`)
			console.log(`supported: ${completionShells.join(", ")}`)
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
	const options = getOptionGroups(commands)
	return completionScriptGenerators[shell](getCompletionBinNames(program.getBin()), roots, subcommands, options)
}

function isVisibleCompletionCommand(command: Command) {
	return command.visible
}

function getCompletionBinNames(binName: string) {
	const names = [binName, ...CLI_BIN_NAMES]
	return [...new Set(names)]
}

function getZshCompletionScript(
	binNames: string[],
	roots: CompletionGroup[],
	subcommands: Map<string, CompletionGroup[]>,
	options: Map<string, CompletionOption[]>,
) {
	const functionName = getFunctionName(binNames[0] ?? "pretty-session")
	return `#compdef ${binNames.join(" ")}

${functionName}() {
  local -a commands
  commands=(
${formatZshItems(roots)}
  )
  local -a global_options
  global_options=(
${formatZshOptionItems(globalOptions)}
  )
${formatSubcommandArrays(subcommands)}
${formatZshOptionArrays(options)}

  if [[ "$words[CURRENT]" == -* ]]; then
    _describe '${binNames[0]} options' global_options
    return
  fi

  if (( CURRENT == 2 )); then
    _describe '${binNames[0]} commands' commands
    return
  fi

  case $words[2] in
${formatZshCompletionCases(binNames[0] ?? "pretty-session", subcommands, options)}
  esac
}

compdef ${functionName} ${binNames.join(" ")}`
}

function getBashCompletionScript(
	binNames: string[],
	roots: CompletionGroup[],
	subcommands: Map<string, CompletionGroup[]>,
	options: Map<string, CompletionOption[]>,
) {
	const functionName = getFunctionName(binNames[0] ?? "pretty-session")
	return `${functionName}() {
  local cur root subcommand
  cur="\${COMP_WORDS[COMP_CWORD]}"
  root="\${COMP_WORDS[1]}"
  subcommand="\${COMP_WORDS[2]}"
  COMPREPLY=()

  if [[ "$cur" == -* ]]; then
    COMPREPLY=($(compgen -W "${optionWords(globalOptions)}" -- "$cur"))
    return
  fi

  case "$COMP_CWORD" in
    1)
      COMPREPLY=($(compgen -W "${roots.map((item) => item.name).join(" ")}" -- "$cur"))
      ;;
    2)
      case "\${COMP_WORDS[1]}" in
${formatBashSubcommandCases(subcommands)}
      esac
      ;;
  esac
}

${binNames.map((binName) => `complete -F ${functionName} ${binName}`).join("\n")}`
}

function getFishCompletionScript(
	binNames: string[],
	roots: CompletionGroup[],
	subcommands: Map<string, CompletionGroup[]>,
	options: Map<string, CompletionOption[]>,
) {
	return binNames.map((binName) => getFishCompletionForBin(binName, roots, subcommands, options)).join("\n")
}

function getFishCompletionForBin(
	binName: string,
	roots: CompletionGroup[],
	subcommands: Map<string, CompletionGroup[]>,
	options: Map<string, CompletionOption[]>,
) {
	const rootNames = roots.map((item) => item.name).join(" ")
	return `function __${commandKey(binName)}_seen_command
  set -l tokens (commandline -opc)
  for token in $tokens[2..-1]
    switch $token
      case ${rootNames}
        return 0
    end
  end
  return 1
end

function __${commandKey(binName)}_using_command
  set -l tokens (commandline -opc)
  test (count $tokens) -ge 2; and test "$tokens[2]" = "$argv[1]"
end

function __${commandKey(binName)}_using_subcommand
  set -l tokens (commandline -opc)
  test (count $tokens) -ge 3; and test "$tokens[2]" = "$argv[1]"; and test "$tokens[3]" = "$argv[2]"
end

complete -c ${binName} -f
${formatFishRootCompletions(binName, roots)}
${formatFishSubcommandCompletions(binName, subcommands)}
${formatFishOptionCompletions(binName, subcommands, options)}
${formatFishGlobalOptionCompletions(binName)}`
}

function getRootCommands(commands: Command[]) {
	const roots = new Map<string, CompletionGroup>()

	for (const command of commands) {
		const parts = command.name.split(" ")
		const root = parts[0]
		if (!root || roots.has(root)) continue

		roots.set(root, {
			name: root,
			description: command.description,
		})
	}

	return [...roots.values()]
}

function getSubcommandGroups(commands: Command[]) {
	const groups = new Map<string, CompletionGroup[]>()

	for (const command of commands) {
		const [root, subcommand] = command.name.split(" ")
		if (!root || !subcommand) continue

		const group = groups.get(root) ?? []
		if (!group.some((item) => item.name === subcommand)) {
			group.push({ name: subcommand, description: command.description })
		}
		groups.set(root, group)
	}

	groups.set(
		COMPLETION_COMMAND_NAME,
		completionShells.map((shell) => ({
			name: shell,
			description: `Generate ${shell} completion`,
		})),
	)

	return groups
}

function getOptionGroups(commands: Command[]) {
	const groups = new Map<string, CompletionOption[]>()

	for (const command of commands) {
		const options = command.options.filter((option) => option.visible)
		if (options.length === 0) continue

		groups.set(
			command.name,
			options.map((option) => ({
				description: option.description,
				long: option.longName,
				names: option.allNotations,
				short: option.shortName,
			})),
		)
	}

	return groups
}

function formatZshItems(items: CompletionGroup[]) {
	return items.map((item) => `    '${escapeZshItem(item)}'`).join("\n")
}

function formatZshOptionItems(items: CompletionOption[]) {
	return items
		.flatMap((item) =>
			item.names.map((name) => ({
				description: item.description,
				name,
			})),
		)
		.map((item) => `    '${escapeZshItem(item)}'`)
		.join("\n")
}

function formatSubcommandArrays(groups: Map<string, CompletionGroup[]>) {
	return [...groups.entries()]
		.map(
			([root, items]) => `
  local -a ${commandKey(root)}_commands
  ${commandKey(root)}_commands=(
${formatZshItems(items)}
  )`,
		)
		.join("\n")
}

function formatZshOptionArrays(groups: Map<string, CompletionOption[]>) {
	return [...groups.entries()]
		.map(
			([command, items]) => `
  local -a ${commandKey(command)}_options
  ${commandKey(command)}_options=(
${formatZshOptionItems(items)}
  )`,
		)
		.join("\n")
}

function formatZshCompletionCases(
	binName: string,
	subcommands: Map<string, CompletionGroup[]>,
	options: Map<string, CompletionOption[]>,
) {
	const rootCommands = new Set(
		[...subcommands.keys(), ...[...options.keys()].map((command) => command.split(" ")[0])].filter(
			(command): command is string => Boolean(command),
		),
	)

	return [...rootCommands]
		.filter(Boolean)
		.map((root) => {
			const rootOptions = options.get(root)
			if (rootOptions) {
				return `    ${root})
      _describe '${binName} ${root} options' ${commandKey(root)}_options
      ;;`
			}

			const subcommandCases = (subcommands.get(root) ?? [])
				.map((item) => {
					const key = `${root} ${item.name}`
					if (!options.has(key)) return ""
					return `        ${item.name})
          _describe '${binName} ${root} ${item.name} options' ${commandKey(key)}_options
          ;;`
				})
				.filter(Boolean)
				.join("\n")

			return `    ${root})
      if (( CURRENT == 3 )) && [[ $words[CURRENT] != -* ]]; then
        _describe '${binName} ${root} commands' ${commandKey(root)}_commands
        return
      fi
      case $words[3] in
${subcommandCases}
      esac
      ;;`
		})
		.join("\n")
}

function formatBashSubcommandCases(groups: Map<string, CompletionGroup[]>) {
	return [...groups.entries()]
		.map(
			([root, items]) => `        ${root})
          COMPREPLY=($(compgen -W "${items.map((item) => item.name).join(" ")}" -- "$cur"))
          ;;`,
		)
		.join("\n")
}

function formatBashOptionCases(subcommands: Map<string, CompletionGroup[]>, options: Map<string, CompletionOption[]>) {
	const rootCommands = [...options.keys()].filter((command) => !command.includes(" "))
	const rootCases = rootCommands.map(
		(command) => `      ${command})
        COMPREPLY=($(compgen -W "${optionWords(options.get(command) ?? [])}" -- "$cur"))
        ;;`,
	)

	const subcommandRootCases = [...subcommands.keys()]
		.filter((root) => [...options.keys()].some((command) => command.startsWith(`${root} `)))
		.map((root) => {
			const cases = (subcommands.get(root) ?? [])
				.filter((item) => options.has(`${root} ${item.name}`))
				.map(
					(item) => `        ${item.name})
          COMPREPLY=($(compgen -W "${optionWords(options.get(`${root} ${item.name}`) ?? [])}" -- "$cur"))
          ;;`,
				)
				.join("\n")
			return `      ${root})
        case "$subcommand" in
${cases}
        esac
        ;;`
		})

	return [...rootCases, ...subcommandRootCases].join("\n")
}

function formatFishRootCompletions(binName: string, roots: CompletionGroup[]) {
	return roots
		.map(
			(item) =>
				`complete -c ${binName} -f -n "not __${commandKey(binName)}_seen_command" -a ${quoteFish(item.name)} -d ${quoteFish(item.description ?? "")}`,
		)
		.join("\n")
}

function formatFishSubcommandCompletions(binName: string, groups: Map<string, CompletionGroup[]>) {
	return [...groups.entries()]
		.flatMap(([root, items]) =>
			items.map(
				(item) =>
					`complete -c ${binName} -f -n "__${commandKey(binName)}_using_command ${quoteFish(root)}" -a ${quoteFish(item.name)} -d ${quoteFish(item.description ?? "")}`,
			),
		)
		.join("\n")
}

function formatFishOptionCompletions(
	binName: string,
	subcommands: Map<string, CompletionGroup[]>,
	options: Map<string, CompletionOption[]>,
) {
	return [...options.entries()]
		.flatMap(([command, items]) => {
			const parts = command.split(" ")
			const condition =
				parts.length === 1
					? `__${commandKey(binName)}_using_command ${quoteFish(parts[0] ?? "")}`
					: `__${commandKey(binName)}_using_subcommand ${quoteFish(parts[0] ?? "")} ${quoteFish(parts[1] ?? "")}`
			if (parts.length > 1 && !(subcommands.get(parts[0] ?? "") ?? []).some((item) => item.name === parts[1])) {
				return []
			}

			return items.map((item) => {
				const flags = [item.short ? `-s ${quoteFish(item.short)}` : "", item.long ? `-l ${quoteFish(item.long)}` : ""]
					.filter(Boolean)
					.join(" ")
				return `complete -c ${binName} -f -n "${condition}" ${flags} -d ${quoteFish(item.description ?? "")}`
			})
		})
		.join("\n")
}

function formatFishGlobalOptionCompletions(binName: string) {
	return globalOptions
		.map((item) => {
			const flags = [item.short ? `-s ${quoteFish(item.short)}` : "", item.long ? `-l ${quoteFish(item.long)}` : ""]
				.filter(Boolean)
				.join(" ")
			return `complete -c ${binName} -f ${flags} -d ${quoteFish(item.description ?? "")}`
		})
		.join("\n")
}

function optionWords(items: CompletionOption[]) {
	return items.flatMap((item) => item.names).join(" ")
}

function commandKey(command: string) {
	return command.replace(/\W+/g, "_")
}

function getFunctionName(binName: string) {
	return `_${commandKey(binName)}_completion`
}

function escapeZshItem(item: CompletionGroup) {
	const text = item.description ? `${item.name}:${item.description}` : item.name
	return text.replace(/'/g, "'\\''")
}

function quoteFish(value: string) {
	return `'${value.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`
}
