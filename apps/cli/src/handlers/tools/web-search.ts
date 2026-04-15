import { Tool } from "../../constants"
import type { ParseResult, ParserState } from "../base"

export function handleWebSearch(inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const query = (inp.query as string) ?? ""
	result.add(`\n${state.sp}${r.purple(`[${Tool.WebSearch}] "${query}"`)}\n`)
}
