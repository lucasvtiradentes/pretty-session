import type { ParseResult, ParserState } from "../base"

export function handleTaskCreate(inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const subject = ((inp.subject as string) ?? "").slice(0, 60)
	const label = `[TaskCreate] "${subject}"`
	result.add(`\n${state.sp}${r.blue(label)}\n`)
}

export function handleTaskUpdate(inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const taskId = (inp.taskId as string) ?? ""
	const status = (inp.status as string) ?? ""
	const label = `[TaskUpdate] #${taskId} → ${status}`
	result.add(`\n${state.sp}${r.blue(label)}\n`)
}
