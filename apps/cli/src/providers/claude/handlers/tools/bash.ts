import { Tool } from "../../constants"
import type { ParseResult, ParserState } from "../base"

export function handleBash(inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const cmd = (inp.command as string) ?? ""
	result.add(`\n${state.sp}${r.purple(`[${Tool.Bash}] ${cmd}`)}\n`)
}
