import { INDENT } from '../../../constants'
import type { ParseResult } from '../../../lib/result'
import { getClaudeDisplaySessionPath, getClaudeSessionPath } from '../../../lib/session-paths'
import { SystemSubtype } from '../constants'
import type { ParserState } from '../state'

export function handleSystem(data: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer

	if (data.subtype === SystemSubtype.Init) {
		if (state.sessionShown) return
		state.sessionShown = true
		const sessionId = (data.session_id as string) ?? ''
		const rawCwd = (data.cwd as string) ?? ''
		const model = (data.model as string) ?? ''
		const modelName = model.replace(/^claude-/, '')
		state.sessionFilePath = getClaudeSessionPath(rawCwd, sessionId)
		const displayPath = getClaudeDisplaySessionPath(rawCwd, sessionId, state.sessionFilePath)

		let lines = `[session]\n${INDENT}id:    ${sessionId}`
		if (displayPath) lines += `\n${INDENT}path:  ${displayPath}`
		lines += `\n${INDENT}model: ${modelName}`
		result.add(`${r.dim(lines)}\n\n${r.dim('----')}\n`)
	}
}
