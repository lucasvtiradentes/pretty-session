import type { ParseResult } from '../../../../lib/result'
import { Tool } from '../../constants'
import type { ParserState } from '../../state'

export function handleTaskOutput(inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const taskId = (inp.task_id as string) ?? ''
	const block = inp.block === true ? 'blocking' : 'non-blocking'
	result.add(`\n${state.sp}${r.blue(`[${Tool.TaskOutput}] #${taskId} (${block})`)}\n`)
}
