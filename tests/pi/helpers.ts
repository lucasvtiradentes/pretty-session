import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { Provider } from '../../src/constants'
import { resolveSessionSource } from '../../src/lib/session-source'
import { scrubFixture } from '../scrub'
import { SESSION_FOOTER, SESSION_HEADER } from './expectations'

const CLI_ROOT = resolve(dirname(new URL(import.meta.url).pathname), '../..')
const CLI_PATH = resolve(CLI_ROOT, 'src/bin.ts')
const HOME = homedir()
const TEST_ENV = { ...process.env, PI_SKIP_VERSION_CHECK: '1', PTS_TOOL_RESULT_LINES: '5' }

export function replayFixture(fixturePath: string): string {
	return execFileSync('npx', ['tsx', CLI_PATH, 'parse', 'pi'], {
		cwd: CLI_ROOT,
		encoding: 'utf-8',
		env: TEST_ENV,
		input: readFileSync(fixturePath),
	})
}

export async function runE2E(
	promptPath: string,
	dir: string,
	options: { tools?: string; files?: Record<string, string> } = {},
) {
	const prompt = readFileSync(promptPath, 'utf-8').trim()
	const streamFile = resolve(dir, 'stream.jsonl')
	const testName = dir.split('/').filter(Boolean).pop() ?? 'default'
	const sandboxDir = resolve(tmpdir(), `pretty-session-pi-${testName}-${Date.now()}`)
	mkdirSync(sandboxDir, { recursive: true })
	for (const [file, content] of Object.entries(options.files ?? {})) writeFileSync(resolve(sandboxDir, file), content)

	try {
		const stdout = execFileSync(
			'pi',
			[
				'--mode',
				'json',
				'--no-extensions',
				'--no-prompt-templates',
				'--no-context-files',
				'--no-approve',
				'--tools',
				options.tools ?? 'read,write,edit,bash',
				'-p',
				prompt,
			],
			{ cwd: sandboxDir, encoding: 'utf-8', env: TEST_ENV, timeout: 120_000 },
		)
		writeFileSync(streamFile, stdout)
		const sessionId = extractSessionId(stdout)
		if (!sessionId) throw new Error('failed to find generated Pi session id')
		const sessionSrc = await resolveSessionSource(Provider.Pi, sessionId)
		copyFileSync(sessionSrc, resolve(dir, 'session.jsonl'))
		scrubPiFixture(streamFile)
		scrubPiFixture(resolve(dir, 'session.jsonl'))

		return replayFixture(streamFile)
	} finally {
		rmSync(sandboxDir, { force: true, recursive: true })
	}
}

function extractSessionId(output: string) {
	for (const line of output.split('\n')) {
		if (!line.trim()) continue
		try {
			const record = JSON.parse(line) as Record<string, unknown>
			if (record.type === 'session' && typeof record.id === 'string') return record.id
		} catch {}
	}
}

function scrubPiFixture(filePath: string) {
	scrubFixture(filePath)
	const cleaned = readFileSync(filePath, 'utf-8')
		.split('\n')
		.filter(Boolean)
		.map((line) => {
			try {
				return JSON.stringify(scrubPiRecord(JSON.parse(line) as Record<string, unknown>))
			} catch {
				return line
			}
		})
		.join('\n')
	writeFileSync(filePath, `${cleaned}\n`)
}

function scrubPiRecord(record: Record<string, unknown>) {
	if (record.type === 'session') return { ...record, cwd: '<CWD>' }
	return record
}

export function sanitize(output: string): string {
	return stripAnsi(output)
		.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g, '<ID>')
		.replace(/id:\s+[^\n]+/g, 'id:    <ID>')
		.replace(/cwd:\s+[^\n]+/g, 'cwd:   <CWD>')
		.replace(/model: [\w.-]+\/[\w.-]+/g, 'model: <MODEL>')
		.replace(/\d+ turns/g, '<N> turns')
		.replace(/\d+ in \/ \d+ out/g, '<N> in / <N> out')
		.replace(/\d+ bytes/g, '<N> bytes')
		.replace(new RegExp(escapeRegExp(HOME), 'g'), '~')
		.replace(/\n\[user\][\s\S]*?\n\n----\n/g, '\n')
		.replace(/\n+\[done\]/g, '\n\n[done]')
		.replace(/----\n{2,}/g, '----\n\n')
}

export function expected(body: string): string {
	return SESSION_HEADER + body.replace(/^\n+/, '') + SESSION_FOOTER
}

export function fixtureExists(path: string): boolean {
	return existsSync(path)
}

export function sessionPath(dir: string): string {
	return resolve(dir, 'session.jsonl')
}

export function streamPath(dir: string): string {
	return resolve(dir, 'stream.jsonl')
}

export function promptPath(dir: string): string {
	return resolve(dir, 'prompt.md')
}

function stripAnsi(value: string) {
	const ansiPattern = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, 'g')
	return value.replace(ansiPattern, '')
}

function escapeRegExp(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
