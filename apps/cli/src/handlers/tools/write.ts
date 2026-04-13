import type { ParseResult, ParserState } from "../base.js"

export function handleWrite(inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const path = (inp.file_path as string) ?? ""
	result.add(`\n${state.sp}${r.orange(`[Write] ${path}`)}\n`)
}
