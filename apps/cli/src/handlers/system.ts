import { INDENT } from "../constants"
import type { ParseResult, ParserState } from "./base"

export function handleSystem(data: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer

	if (data.subtype === "init") {
		const sessionId = (data.session_id as string) ?? ""
		const cwd = ((data.cwd as string) ?? "").replace(/[\/_.]/g, "-")
		const model = (data.model as string) ?? ""
		const modelName = model.includes("-") ? model.split("-")[1] : model

		const lines = `[session]\n${INDENT}id:    ${sessionId}\n${INDENT}path:  ~/.claude/projects/${cwd}/${sessionId}.jsonl\n${INDENT}model: ${modelName}`
		result.add(`${r.dim(lines)}\n\n`)
	}
}
