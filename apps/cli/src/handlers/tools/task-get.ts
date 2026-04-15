import { Tool } from "../../constants"
import type { ParseResult, ParserState } from "../base"

export function handleTaskGet(inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const taskId = (inp.taskId as string) ?? ""
	result.add(`\n${state.sp}${r.blue(`[${Tool.TaskGet}] #${taskId}`)}\n`)
}
