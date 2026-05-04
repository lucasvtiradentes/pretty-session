import type { Program } from "@caporal/core"
import { Provider } from "../constants"
import { streamLines } from "../lib/stream"
import { CodexState, finalizeCodex, parseCodexLine } from "../providers/codex"

const description = "Format Codex stream or saved session JSONL"

export function registerCodexCommand(program: Program) {
	program
		.command(Provider.Codex, description)
		.strict(false)
		.action(() => {
			const state = new CodexState()
			streamLines({
				parseLine: (line) => parseCodexLine(line, state),
				finalize: () => finalizeCodex(state),
			})
		})
}
