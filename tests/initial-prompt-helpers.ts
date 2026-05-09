import { execSync } from 'node:child_process'
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'

const CLI_ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..')
const CLI_PATH = resolve(CLI_ROOT, 'src/bin.ts')

// biome-ignore lint/suspicious/noControlCharactersInRegex: stripping ANSI escape codes
const stripAnsi = (s: string) => s.replace(/\x1b\[[0-9;]*m/g, '')

function runParse(provider: 'claude' | 'codex', input: string, home: string) {
	return stripAnsi(
		execSync(`npx tsx ${CLI_PATH} parse ${provider}`, {
			input,
			encoding: 'utf-8',
			cwd: CLI_ROOT,
			env: { ...process.env, HOME: home, USERPROFILE: home },
		}),
	)
}

export function replayClaudeStreamWithSession(streamFile: string, sessionFile: string) {
	const home = mkdtempSync(resolve(tmpdir(), 'pts-claude-home-'))
	const cwd = `${home}/workspace`
	let sessionId = ''
	const stream = readFileSync(streamFile, 'utf-8')
		.split('\n')
		.filter(Boolean)
		.map((line) => {
			const data = JSON.parse(line) as Record<string, unknown>
			if (data.type === 'system' && data.subtype === 'init') {
				sessionId = (data.session_id as string) ?? ''
				data.cwd = cwd
			}
			return JSON.stringify(data)
		})
		.join('\n')
	const project = cwd.replace(/[\/_.]/g, '-')
	const sessionDir = resolve(home, '.claude', 'projects', project)
	mkdirSync(sessionDir, { recursive: true })
	copyFileSync(sessionFile, resolve(sessionDir, `${sessionId}.jsonl`))
	return runParse('claude', stream, home)
}

export function replayCodexStreamWithSession(streamFile: string, sessionFile: string) {
	const home = mkdtempSync(resolve(tmpdir(), 'pts-codex-home-'))
	const lines = readFileSync(streamFile, 'utf-8').split('\n').filter(Boolean)
	let sessionId = ''
	let timestamp = ''
	let timezone = ''
	for (const line of lines) {
		const data = JSON.parse(line) as Record<string, unknown>
		const payload = (data.payload as Record<string, unknown>) ?? {}
		if (data.type === 'session_meta') {
			sessionId = (payload.id as string) ?? ''
			timestamp = (payload.timestamp as string) ?? ''
		}
		if (data.type === 'turn_context') timezone = (payload.timezone as string) ?? ''
	}
	const local = new Date(timestamp).toLocaleString('sv-SE', { timeZone: timezone })
	const [datePart, timePart] = local.split(' ')
	const [year, month, day] = datePart.split('-')
	const timeFormatted = timePart.replaceAll(':', '-')
	const sessionDir = resolve(home, '.codex', 'sessions', year, month, day)
	mkdirSync(sessionDir, { recursive: true })
	copyFileSync(sessionFile, resolve(sessionDir, `rollout-${datePart}T${timeFormatted}-${sessionId}.jsonl`))
	return runParse('codex', lines.join('\n'), home)
}
