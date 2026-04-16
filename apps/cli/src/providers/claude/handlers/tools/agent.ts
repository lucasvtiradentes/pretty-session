import { INDENT } from "../../../../constants"
import { Tool } from "../../constants"
import type { ParseResult, ParserState } from "../base"

export function handleAgent(inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const description = ((inp.description as string) ?? "").slice(0, 50)
	const prompt = (inp.prompt as string) ?? ""
	const subagentType = (inp.subagent_type as string) ?? ""
	const label = subagentType ? `[${Tool.Agent}] "${description}" (${subagentType})` : `[${Tool.Agent}] "${description}"`
	result.add(`\n${state.sp}${r.blue(label)}\n`)
	if (prompt) {
		for (const line of prompt.split("\n")) {
			result.add(`${state.sp}${r.dim(`${INDENT}${line}`)}\n`)
		}
	}
	if (state.mode === "stream") {
		state.incrementDepth()
	}
}
