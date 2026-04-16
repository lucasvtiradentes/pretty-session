import type { ParseResult } from "../../../result"
import type { CodexState } from "../state"

export function handleUserMessage(payload: Record<string, unknown>, state: CodexState, result: ParseResult) {
	state.turnCount++
	if (!state.sessionShown) return
	const r = state.renderer
	const raw = (payload.message as string) ?? ""
	const text = raw.slice(0, 200)
	if (!text) return
	if (state.turnCount > 1) result.add(`\n${r.dim("----")}\n`)
	result.add(`\n${r.green("[user]")} ${text}`)
	if (raw.length > 200) result.add(r.dim("..."))
	result.add(`\n\n${r.dim("----")}\n`)
}
