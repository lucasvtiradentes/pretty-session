import type { ParseResult, ParserState } from "../base"

export function handleGrep(inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const pattern = (inp.pattern as string) ?? ""
	let path = (inp.path as string) ?? ""
	let label: string
	if (path) {
		path = path.split("/").pop() ?? path
		label = `[grep] "${pattern}" in ${path}`
	} else {
		label = `[grep] "${pattern}"`
	}
	result.add(`\n${state.sp}${r.purple(label)}\n`)
}
