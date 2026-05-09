import { INDENT } from '../../../constants'
import type { ParseResult } from '../../../lib/result'
import { SystemSubtype } from '../constants'
import type { ParserState } from '../state'

export function formatClaudeProjectName(cwd: string) {
	return cwd.replace(/[\/_.]/g, '-')
}

export function getClaudeSessionPath(cwd: string, sessionId: string) {
	if (!cwd || !sessionId || cwd.includes('<')) return ''
	const home = process.env.HOME ?? ''
	if (!home) return ''
	return `${home}/.claude/projects/${formatClaudeProjectName(cwd)}/${sessionId}.jsonl`
}

export function handleSystem(data: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer

	if (data.subtype === SystemSubtype.Init) {
		if (state.sessionShown) return
		state.sessionShown = true
		const sessionId = (data.session_id as string) ?? ''
		const rawCwd = (data.cwd as string) ?? ''
		const cwd = formatClaudeProjectName(rawCwd)
		const model = (data.model as string) ?? ''
		const modelName = model.replace(/^claude-/, '')
		state.sessionFilePath = getClaudeSessionPath(rawCwd, sessionId)

		const lines = `[session]\n${INDENT}id:    ${sessionId}\n${INDENT}path:  ~/.claude/projects/${cwd}/${sessionId}.jsonl\n${INDENT}model: ${modelName}`
		result.add(`${r.dim(lines)}\n\n`)
	}
}
