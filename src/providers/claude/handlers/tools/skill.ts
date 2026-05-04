import type { ParseResult } from "../../../../result"
import { Tool } from "../../constants"
import type { ParserState } from "../../state"

export function handleSkill(inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const skill = (inp.skill as string) ?? ""
	const args = (inp.args as string) ?? ""
	const label = args ? `[${Tool.Skill}] ${skill} ${args}` : `[${Tool.Skill}] ${skill}`
	result.add(`\n${state.sp}${r.blue(label)}\n`)
}
