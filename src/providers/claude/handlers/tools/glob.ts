import type { ParseResult } from "../../../../result"
import { Tool } from "../../constants"
import type { ParserState } from "../../state"

export function handleGlob(inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const pattern = (inp.pattern as string) ?? ""
	result.add(`\n${state.sp}${r.purple(`[${Tool.Glob}] ${pattern}`)}\n`)
}
