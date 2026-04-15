import type { ParseResult, ParserState } from "../base"

export function handleTaskStop(inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const taskId = (inp.task_id as string) ?? ""
	result.add(`\n${state.sp}${r.blue(`[task-stop] #${taskId}`)}\n`)
}
