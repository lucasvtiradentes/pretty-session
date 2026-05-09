import { readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { Provider } from '../constants'
import { getHomeDir, joinTildePath, toTildePath } from './home'

const PROVIDER_SESSION_ROOTS = {
	[Provider.Claude]: ['.claude', 'projects'],
	[Provider.Codex]: ['.codex', 'sessions'],
	[Provider.Gemini]: ['.gemini', 'tmp'],
} as const

export function getProviderSessionRoot(provider: Provider, home = getHomeDir()) {
	return join(home, ...PROVIDER_SESSION_ROOTS[provider])
}

function getProviderTildeSessionRoot(provider: Provider) {
	return joinTildePath(...PROVIDER_SESSION_ROOTS[provider])
}

function getProviderTildeSessionPath(provider: Provider, ...segments: string[]) {
	return `${getProviderTildeSessionRoot(provider)}/${segments.join('/')}`
}

function formatClaudeProjectName(cwd: string) {
	return cwd.replace(/[\\/_.]/g, '-')
}

export function getClaudeSessionPath(cwd: string, sessionId: string, home = getHomeDir()) {
	if (!cwd || !sessionId || cwd.includes('<')) return ''
	return join(getProviderSessionRoot(Provider.Claude, home), formatClaudeProjectName(cwd), `${sessionId}.jsonl`)
}

export function getClaudeDisplaySessionPath(cwd: string, sessionId: string, sessionFilePath: string) {
	if (sessionFilePath) return toTildePath(sessionFilePath)
	if (!cwd || !sessionId) return ''
	return getProviderTildeSessionPath(Provider.Claude, formatClaudeProjectName(cwd), `${sessionId}.jsonl`)
}

function formatCodexSessionDate(timestamp: string, timezone: string) {
	if (!timestamp || !timezone) return undefined
	const local = new Date(timestamp).toLocaleString('sv-SE', { timeZone: timezone })
	const [datePart, timePart] = local.split(' ')
	if (!datePart || !timePart) return undefined
	const [year, month, day] = datePart.split('-')
	const timeFormatted = timePart.replaceAll(':', '-')
	return { datePart, day, month, timeFormatted, year }
}

export function getCodexSessionPath(timestamp: string, timezone: string, sessionId: string, home = getHomeDir()) {
	if (!sessionId) return ''
	const date = formatCodexSessionDate(timestamp, timezone)
	if (!date) return ''
	return join(
		getProviderSessionRoot(Provider.Codex, home),
		date.year,
		date.month,
		date.day,
		`rollout-${date.datePart}T${date.timeFormatted}-${sessionId}.jsonl`,
	)
}

export function findTodaysCodexSessionPath(sessionId: string, home = getHomeDir()) {
	if (!sessionId) return ''
	const now = new Date()
	const year = String(now.getFullYear())
	const month = String(now.getMonth() + 1).padStart(2, '0')
	const day = String(now.getDate()).padStart(2, '0')
	const dir = resolve(getProviderSessionRoot(Provider.Codex, home), year, month, day)
	try {
		const match = readdirSync(dir).find((file) => file.includes(sessionId) && file.endsWith('.jsonl'))
		if (match) return resolve(dir, match)
	} catch {}
	return ''
}
