import type { ParseResult, ParserState } from "../base.js"

export function handleGrep(inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const pattern = (inp.pattern as string) ?? ""
	let path = (inp.path as string) ?? ""
	let label: string
	if (path) {
		path = path.split("/").pop() ?? path
		label = `[Grep] "${pattern}" in ${path}`
	} else {
		label = `[Grep] "${pattern}"`
	}
	result.add(`\n${state.sp}${r.purple(label)}\n`)
}
