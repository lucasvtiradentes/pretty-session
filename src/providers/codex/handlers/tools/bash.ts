import type { ParseResult } from "../../../../result"
import type { CodexState } from "../../state"

export function handleBash(payload: Record<string, unknown>, state: CodexState, result: ParseResult) {
	const r = state.renderer
	let cmd = ""
	try {
		const args = JSON.parse((payload.arguments as string) ?? "{}")
		cmd = (args.cmd as string) ?? ""
	} catch {
		return
	}

	result.add(`\n${r.purple(`[Bash] ${cmd}`)}\n`)
}
