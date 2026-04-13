import type { ParseResult, ParserState } from "../base.js"

export function handleGlob(inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const pattern = (inp.pattern as string) ?? ""
	result.add(`\n${state.sp}${r.purple(`[Glob] ${pattern}`)}\n`)
}
