import type { ParseResult, ParserState } from "../base.js"

export function handleBash(inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const cmd = (inp.command as string) ?? ""
	result.add(`\n${state.sp}${r.purple(`[Bash] ${cmd}`)}\n`)
}
