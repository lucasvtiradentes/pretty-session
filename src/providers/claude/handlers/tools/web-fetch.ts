import type { ParseResult } from '../../../../lib/result'
import { Tool } from '../../constants'
import type { ParserState } from '../../state'

export function handleWebFetch(inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const url = (inp.url as string) ?? ''
	result.add(`\n${state.sp}${r.purple(`[${Tool.WebFetch}] ${url}`)}\n`)
}
