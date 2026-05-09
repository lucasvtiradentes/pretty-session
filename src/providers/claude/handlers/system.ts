import { join } from 'node:path'
import { INDENT } from '../../../constants'
import { getHomeDir, toTildePath } from '../../../lib/home'
import type { ParseResult } from '../../../lib/result'
import { SystemSubtype } from '../constants'
import type { ParserState } from '../state'

function formatClaudeProjectName(cwd: string) {
	return cwd.replace(/[\/_.]/g, '-')
}

function getClaudeSessionPath(cwd: string, sessionId: string) {
	if (!cwd || !sessionId || cwd.includes('<')) return ''
	const home = getHomeDir()
	if (!home) return ''
	return join(home, '.claude', 'projects', formatClaudeProjectName(cwd), `${sessionId}.jsonl`)
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

		let lines = `[session]\n${INDENT}id:    ${sessionId}`
		if (state.sessionFilePath) lines += `\n${INDENT}path:  ${toTildePath(state.sessionFilePath)}`
		lines += `\n${INDENT}model: ${modelName}`
		result.add(`${r.dim(lines)}\n\n`)
	}
}
