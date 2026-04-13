import type { ParseResult, ParserState } from "../base.js"

export function handleRead(inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const path = (inp.file_path as string) ?? ""
	result.add(`\n${state.sp}${r.green(`[Read] ${path}`)}\n`)
}
