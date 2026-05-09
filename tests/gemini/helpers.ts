import { execSync } from 'node:child_process'
import { copyFileSync, existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { SESSION_FOOTER, SESSION_HEADER } from './expectations'

const CLI_ROOT = resolve(dirname(new URL(import.meta.url).pathname), '../..')
const SANDBOX_BASE = resolve(CLI_ROOT, '.sandbox')
const CLI_PATH = resolve(CLI_ROOT, 'src/bin.ts')
const HOME = homedir()

const TEST_ENV = {
	...process.env,
	PTS_TOOL_RESULT_LINES: '5',
	GEMINI_CLI_TRUST_WORKSPACE: 'true',
}

// biome-ignore lint/suspicious/noControlCharactersInRegex: stripping ANSI escape codes
export const stripAnsi = (s: string) => s.replace(/\x1b\[[0-9;]*m/g, '')

export function replayFixture(fixturePath: string): string {
	return execSync(`npx tsx ${CLI_PATH} parse gemini < ${fixturePath}`, {
		encoding: 'utf-8',
		timeout: 30_000,
		cwd: CLI_ROOT,
		env: TEST_ENV,
	})
}

export function runE2E(promptOrPath: string, dir?: string): string {
	if (dir === undefined) {
		const escapedPrompt = promptOrPath.replace(/"/g, '\\"')
		return execSync(
			`gemini -p "${escapedPrompt}" --yolo --output-format stream-json 2>/dev/null | npx tsx ${CLI_PATH} parse gemini`,
			{ encoding: 'utf-8', timeout: 240_000, cwd: CLI_ROOT, env: TEST_ENV },
		)
	}

	const prompt = readFileSync(promptOrPath, 'utf-8').trim()
	const escapedPrompt = prompt.replace(/"/g, '\\"')
	const streamFile = resolve(dir, 'stream.jsonl')
	const testName = dir.split('/').filter(Boolean).pop() ?? 'default'
	const sandboxName = `gemini-${testName}`
	const sandboxDir = resolve(SANDBOX_BASE, sandboxName)
	execSync(`rm -rf ${sandboxDir} && mkdir -p ${sandboxDir} && git -C ${sandboxDir} init -q`)

	const output = execSync(
		`cd ${sandboxDir} && gemini -p "${escapedPrompt}" --yolo --output-format stream-json 2>/dev/null | tee ${streamFile} | npx tsx ${CLI_PATH} parse gemini`,
		{ encoding: 'utf-8', timeout: 240_000, cwd: CLI_ROOT, env: TEST_ENV },
	)

	const sessionSrc = findGeminiSession(sandboxName)
	if (!sessionSrc) throw new Error('failed to find generated Gemini session path')
	const dest = resolve(dir, 'session.jsonl')
	copyFileSync(sessionSrc, dest)
	execSync(`rm -rf ${sandboxDir}`)

	return output
}

function findGeminiSession(projectName: string): string | null {
	const dir = resolve(HOME, '.gemini', 'tmp', projectName, 'chats')
	if (!existsSync(dir)) return null
	try {
		const latest = execSync(`ls -t ${dir}/*.jsonl 2>/dev/null | head -1`, { encoding: 'utf-8' }).trim()
		return latest || null
	} catch {
		return null
	}
}

export function sanitize(output: string): string {
	return stripAnsi(output)
		.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g, '<UUID>')
		.replace(/model: [\w.-]*/g, 'model: <MODEL>')
		.replace(/\d+ turns/g, '<N> turns')
		.replace(/\d+ in \/ \d+ out/g, '<N> in / <N> out')
		.replace(/\n\[user\][\s\S]*?\n\n----\n/g, '')
}

export function expected(body: string): string {
	return SESSION_HEADER + body + SESSION_FOOTER
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
