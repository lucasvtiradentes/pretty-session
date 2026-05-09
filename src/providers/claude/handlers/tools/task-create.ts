import type { ParseResult } from '../../../../lib/result'
import { Tool } from '../../constants'
import type { ParserState } from '../../state'

export function handleTaskCreate(inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const subject = ((inp.subject as string) ?? '').slice(0, 60)
	const label = `[${Tool.TaskCreate}] "${subject}"`
	result.add(`\n${state.sp}${r.blue(label)}\n`)
}
