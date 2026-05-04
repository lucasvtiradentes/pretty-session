import type { ParseResult } from "../../../../result"
import { Tool } from "../../constants"
import type { ParserState } from "../../state"

export function handleTaskUpdate(inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const taskId = (inp.taskId as string) ?? ""
	const status = (inp.status as string) ?? ""
	const label = `[${Tool.TaskUpdate}] #${taskId} → ${status}`
	result.add(`\n${state.sp}${r.blue(label)}\n`)
}
