import { Tool } from "../../constants"
import type { ParseResult, ParserState } from "../base"

export function handleWebFetch(inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const url = (inp.url as string) ?? ""
	result.add(`\n${state.sp}${r.purple(`[${Tool.WebFetch}] ${url}`)}\n`)
}
