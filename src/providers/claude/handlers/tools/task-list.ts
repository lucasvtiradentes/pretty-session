import type { ParseResult } from '../../../../lib/result'
import { Tool } from '../../constants'
import type { ParserState } from '../../state'

export function handleTaskList(_inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	result.add(`\n${state.sp}${r.blue(`[${Tool.TaskList}]`)}\n`)
}
