import type { ParseResult } from "../../../../lib/result"
import { Tool } from "../../constants"
import type { ParserState } from "../../state"

export function handleEdit(inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const path = (inp.file_path as string) ?? ""
	result.add(`\n${state.sp}${r.orange(`[${Tool.Edit}] ${path}`)}\n`)
}
