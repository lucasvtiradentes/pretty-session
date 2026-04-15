import type { ParseResult, ParserState } from "../base"

export function handleTaskCreate(inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const subject = ((inp.subject as string) ?? "").slice(0, 60)
	const label = `[task-create] "${subject}"`
	result.add(`\n${state.sp}${r.blue(label)}\n`)
}
