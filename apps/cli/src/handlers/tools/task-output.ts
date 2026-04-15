import type { ParseResult, ParserState } from "../base"

export function handleTaskOutput(inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const taskId = (inp.task_id as string) ?? ""
	const block = inp.block === true ? "blocking" : "non-blocking"
	result.add(`\n${state.sp}${r.blue(`[task-output] #${taskId} (${block})`)}\n`)
}
