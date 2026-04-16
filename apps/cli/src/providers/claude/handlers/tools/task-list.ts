import { Tool } from "../../constants"
import type { ParseResult, ParserState } from "../base"

export function handleTaskList(_inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	result.add(`\n${state.sp}${r.blue(`[${Tool.TaskList}]`)}\n`)
}
