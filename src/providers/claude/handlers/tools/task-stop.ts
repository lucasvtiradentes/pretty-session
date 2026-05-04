import type { ParseResult } from '../../../../lib/result'
import { Tool } from '../../constants'
import type { ParserState } from '../../state'

export function handleTaskStop(inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const taskId = (inp.task_id as string) ?? ''
	result.add(`\n${state.sp}${r.blue(`[${Tool.TaskStop}] #${taskId}`)}\n`)
}
