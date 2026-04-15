import type { ParseResult, ParserState } from "../base"

export function handleRead(inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const path = (inp.file_path as string) ?? ""
	result.add(`\n${state.sp}${r.green(`[read] ${path}`)}\n`)
}
