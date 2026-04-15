import { Tool } from "../../constants"
import type { ParseResult, ParserState } from "../base"

export function handleNotebook(inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const path = (inp.notebook_path as string) ?? ""
	result.add(`\n${state.sp}${r.orange(`[${Tool.NotebookEdit}] ${path}`)}\n`)
}
