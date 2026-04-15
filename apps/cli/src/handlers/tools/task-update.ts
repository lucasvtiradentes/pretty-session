import type { ParseResult, ParserState } from "../base"

export function handleTaskUpdate(inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const taskId = (inp.taskId as string) ?? ""
	const status = (inp.status as string) ?? ""
	const label = `[task-update] #${taskId} → ${status}`
	result.add(`\n${state.sp}${r.blue(label)}\n`)
}
