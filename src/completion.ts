import { CLI_NAME, PROVIDER_VALUES } from "./constants"

type CompletionShell = "bash" | "fish" | "zsh"

const completionShells = ["bash", "fish", "zsh"] as const satisfies readonly CompletionShell[]

const flags = [
	{ description: "Show help", fishOption: "-s h", name: "-h" },
	{ description: "Show help", fishOption: "-l help", name: "--help" },
	{ description: "Show version", fishOption: "-s v", name: "-v" },
	{ description: "Show version", fishOption: "-l version", name: "--version" },
]

export function isCompletionShell(value: string): value is CompletionShell {
	return completionShells.includes(value as CompletionShell)
}

export function getSupportedCompletionShells() {
	return [...completionShells]
}

export function getCompletionScript(shell: CompletionShell) {
	switch (shell) {
		case "bash":
			return getBashCompletionScript()
		case "fish":
			return getFishCompletionScript()
		case "zsh":
			return getZshCompletionScript()
	}
}

function getZshCompletionScript() {
	return `#compdef ${CLI_NAME}

_${CLI_NAME}() {
  local -a commands
  commands=(
${formatZshItems([
	...PROVIDER_VALUES.map((provider) => ({ name: provider, description: "Format provider output" })),
	{ name: "completion", description: "Generate shell completion scripts" },
])}
  )

  local -a shells
  shells=(
${formatZshItems(completionShells.map((shell) => ({ name: shell, description: `Generate ${shell} completion` })))}
  )

  local -a flags
  flags=(
${formatZshItems(flags)}
  )

  if [[ "$words[CURRENT]" == -* ]]; then
    _describe '${CLI_NAME} options' flags
    return
  fi

  if (( CURRENT == 2 )); then
    _describe '${CLI_NAME} commands' commands
    return
  fi

  case $words[2] in
    completion)
      _describe '${CLI_NAME} shells' shells
      ;;
  esac
}

compdef _${CLI_NAME} ${CLI_NAME}`
}

function getBashCompletionScript() {
	return `_${CLI_NAME}_completion() {
  local cur previous
  cur="\${COMP_WORDS[COMP_CWORD]}"
  previous="\${COMP_WORDS[COMP_CWORD-1]}"
  COMPREPLY=()

  if [[ "$cur" == -* ]]; then
    COMPREPLY=($(compgen -W "${flags.map((flag) => flag.name).join(" ")}" -- "$cur"))
    return
  fi

  if [[ "$previous" == "completion" ]]; then
    COMPREPLY=($(compgen -W "${completionShells.join(" ")}" -- "$cur"))
    return
  fi

  case "$COMP_CWORD" in
    1)
      COMPREPLY=($(compgen -W "${[...PROVIDER_VALUES, "completion"].join(" ")}" -- "$cur"))
      ;;
  esac
}

complete -F _${CLI_NAME}_completion ${CLI_NAME}`
}

function getFishCompletionScript() {
	const commands = [...PROVIDER_VALUES, "completion"].join(" ")

	return `complete -c ${CLI_NAME} -f
${PROVIDER_VALUES.map((provider) => `complete -c ${CLI_NAME} -n "not __fish_seen_subcommand_from ${commands}" -a "${provider}" -d "Format provider output"`).join("\n")}
complete -c ${CLI_NAME} -n "not __fish_seen_subcommand_from ${commands}" -a "completion" -d "Generate shell completion scripts"
${completionShells.map((shell) => `complete -c ${CLI_NAME} -n "__fish_seen_subcommand_from completion" -a "${shell}" -d "Generate ${shell} completion"`).join("\n")}
${flags.map((flag) => `complete -c ${CLI_NAME} ${flag.fishOption} -d "${flag.description}"`).join("\n")}`
}

function formatZshItems(items: Array<{ description: string; name: string }>) {
	return items.map((item) => `    '${escapeZshItem(item)}'`).join("\n")
}

function escapeZshItem(item: { description: string; name: string }) {
	return `${item.name.replaceAll("'", "'\\''")}:${item.description.replaceAll("'", "'\\''")}`
}
