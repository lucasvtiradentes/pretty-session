import { AGENT_DESCRIPTION_MAX_CHARS, INDENT } from "../../../../constants"
import type { ParseResult } from "../../../../result"
import { ParserMode, Tool } from "../../constants"
import type { ParserState } from "../../state"

export function handleAgent(inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const description = ((inp.description as string) ?? "").slice(0, AGENT_DESCRIPTION_MAX_CHARS)
	const prompt = (inp.prompt as string) ?? ""
	const subagentType = (inp.subagent_type as string) ?? ""
	const label = subagentType ? `[${Tool.Agent}] "${description}" (${subagentType})` : `[${Tool.Agent}] "${description}"`
	result.add(`\n${state.sp}${r.blue(label)}\n`)
	if (prompt) {
		for (const line of prompt.split("\n")) {
			result.add(`${state.sp}${r.dim(`${INDENT}${line}`)}\n`)
		}
	}
	if (state.mode === ParserMode.Stream) {
		state.incrementDepth()
	}
}
