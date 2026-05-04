import type { ParseResult } from "../../../../result"
import { Tool } from "../../constants"
import type { ParserState } from "../../state"

export function handleRead(inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const path = (inp.file_path as string) ?? ""
	result.add(`\n${state.sp}${r.green(`[${Tool.Read}] ${path}`)}\n`)
}
