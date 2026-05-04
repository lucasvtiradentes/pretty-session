import { Tool } from "../../constants"
import type { ParseResult, ParserState } from "../base"

export function handleToolSearch(inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const query = (inp.query as string) ?? ""
	result.add(`\n${state.sp}${r.purple(`[${Tool.ToolSearch}] "${query}"`)}\n`)
}
