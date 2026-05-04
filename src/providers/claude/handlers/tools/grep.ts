import type { ParseResult } from "../../../../lib/result"
import { Tool } from "../../constants"
import type { ParserState } from "../../state"

export function handleGrep(inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const pattern = (inp.pattern as string) ?? ""
	let path = (inp.path as string) ?? ""
	let label: string
	if (path) {
		path = path.split("/").pop() ?? path
		label = `[${Tool.Grep}] "${pattern}" in ${path}`
	} else {
		label = `[${Tool.Grep}] "${pattern}"`
	}
	result.add(`\n${state.sp}${r.purple(label)}\n`)
}
