import type { ParseResult, ParserState } from "../base"

export function handleEdit(name: string, inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const path = (inp.file_path as string) ?? ""
	result.add(`\n${state.sp}${r.orange(`[${name}] ${path}`)}\n`)
}
