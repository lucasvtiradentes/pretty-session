import { INDENT, SHOW_SUBAGENT_PROMPT } from '../../../../constants'
import type { ParseResult } from '../../../../lib/result'
import { ParserMode, Tool } from '../../constants'
import type { ParserState } from '../../state'

export function handleAgent(inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const description = (inp.description as string) ?? ''
	const prompt = (inp.prompt as string) ?? ''
	const subagentType = (inp.subagent_type as string) ?? ''
	const descriptionPart = description ? ` "${description}"` : ''
	const typePart = subagentType ? ` (${subagentType})` : ''
	const label = `[${Tool.Agent}]${descriptionPart}${typePart}`
	result.add(`\n${state.sp}${r.blue(label)}\n`)
	if (SHOW_SUBAGENT_PROMPT && prompt) {
		for (const line of prompt.split('\n')) {
			result.add(`${state.sp}${r.dim(`${INDENT}${line}`)}\n`)
		}
	}
	if (state.mode === ParserMode.Stream) {
		state.incrementDepth()
	}
}
