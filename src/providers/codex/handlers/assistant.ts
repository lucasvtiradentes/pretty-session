import type { ParseResult } from "../../../result"
import type { CodexState } from "../state"
import { showSession } from "./session"

export function handleAssistant(payload: Record<string, unknown>, state: CodexState, result: ParseResult) {
	if (!state.sessionShown) showSession(state, result)

	const content = payload.content as Array<Record<string, unknown>>
	if (!Array.isArray(content)) return

	for (const block of content) {
		if (block.type !== "output_text") continue
		const raw = ((block.text as string) ?? "").replace(/^\n+|\n+$/g, "")
		if (!raw) continue
		const rendered = state.renderer.renderMarkdown(raw).replace(/\n+$/, "")
		if (rendered) result.add(`\n${rendered}\n`)
	}
}
