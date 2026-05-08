import { execSync } from 'node:child_process'
import { copyFileSync, existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { scrubFixture } from '../scrub'
import { SESSION_FOOTER, SESSION_HEADER } from './expectations'

const CLI_ROOT = resolve(dirname(new URL(import.meta.url).pathname), '../..')
const SANDBOX_BASE = resolve(CLI_ROOT, '.sandbox')
const CLI_PATH = resolve(CLI_ROOT, 'src/bin.ts')
const HOME = process.env.HOME ?? ''

const TEST_ENV = { ...process.env, PS_TOOL_RESULT_MAX_CHARS: '300', PS_READ_PREVIEW_LINES: '5' }

// biome-ignore lint/suspicious/noControlCharactersInRegex: stripping ANSI escape codes
export const stripAnsi = (s: string) => s.replace(/\x1b\[[0-9;]*m/g, '')

export function replayFixture(fixturePath: string): string {
	const output = execSync(`cat ${fixturePath} | npx tsx ${CLI_PATH} parse claude`, {
		encoding: 'utf-8',
		timeout: 30_000,
		cwd: CLI_ROOT,
		env: TEST_ENV,
	})
	return stripPnpmBanner(output)
}

export function runE2E(promptPath: string, dir: string): string {
	const prompt = readFileSync(promptPath, 'utf-8').trim()
	const escapedPrompt = prompt.replace(/"/g, '\\"')
	const streamFile = resolve(dir, 'stream.jsonl')
	const model = 'claude-sonnet-4-6'
	const testName = dir.split('/').filter(Boolean).pop() ?? 'default'
	const sandboxDir = resolve(SANDBOX_BASE, testName)
	execSync(`rm -rf ${sandboxDir} && mkdir -p ${sandboxDir}`)

	const output = execSync(
		`cd ${sandboxDir} && claude -p "${escapedPrompt}" --model ${model} --verbose --output-format stream-json --dangerously-skip-permissions | tee ${streamFile} | npx tsx ${CLI_PATH} parse claude`,
		{ encoding: 'utf-8', timeout: 120_000, cwd: CLI_ROOT, env: TEST_ENV },
	)

	const cleaned = stripPnpmBanner(output)

	const sessionSrc = extractSessionPath(cleaned)
	if (sessionSrc) {
		const dest = resolve(dir, 'session.jsonl')
		copyFileSync(sessionSrc, dest)
		scrubFixture(dest)
	}

	scrubFixture(streamFile)
	execSync(`rm -rf ${sandboxDir}`)

	return cleaned
}

function extractSessionPath(output: string): string | null {
	// biome-ignore lint/suspicious/noControlCharactersInRegex: stripping ANSI escape codes
	const clean = output.replace(/\x1b\[[0-9;]*m/g, '')
	const match = clean.match(/path:\s+(~\/\.claude\/[^\s]+\.jsonl)/)
	if (!match) return null
	return match[1].replace('~', HOME)
}

function stripPnpmBanner(output: string): string {
	// biome-ignore lint/suspicious/noControlCharactersInRegex: matching ANSI escape codes
	const marker = output.search(/(\x1b\[\d+m)?\[session\]/)
	if (marker === -1) return output
	return output.slice(marker)
}

export function sanitize(output: string): string {
	return (
		output
			// biome-ignore lint/suspicious/noControlCharactersInRegex: stripping ANSI escape codes
			.replace(/\x1b\[[0-9;]*m/g, '')
			.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g, '<UUID>')
			.replace(/~\/\.claude\/projects\/[^\s]+\.jsonl/g, '~/.claude/projects/<CWD>/<UUID>.jsonl')
			.replace(/model: [\w-]+/g, 'model: <MODEL>')
			.replace(/\d+\.\d+s/g, '<DURATION>s')
			.replace(/\$[\d.]+/g, '$<COST>')
			.replace(/\d+ turns/g, '<N> turns')
			.replace(/\d+ in \/ \d+ out/g, '<N> in / <N> out')
			.replace(/\[rerun: b\d+\]/g, '')
			.replace(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun) \w+\s+\d+ [\d:]+ [+-]?\w+ \d+/g, '<DATE>')
			.replace(/\b[0-9a-f]{8}\b/g, '<HEX>')
			.replace(/\/(?:Users|home|root|tmp)\b[^\s]*/g, '<ABS_PATH>')
			.replace(/\btmp-[\w-]+\.(?:txt|ipynb)/g, '<ABS_PATH>')
			.replace(/\/[^\s]+\.txt/g, '<PATH>.txt')
			.replace(/\/[^\s]+\.ipynb/g, '<PATH>.ipynb')
			.replace(/\/[^\s]+\.json\b/g, '<PATH>.json')
			.replace(/\/[^\s]+\.ts\b/g, '<PATH>.ts')
			.replace(/\d+\t/g, '<N>\t')
			.replace(/→ \(Bash completed with no output\)/g, '→')
			.replace(/→ \n/g, '→\n')
			.replace(/^ +→\n/gm, '')
			.replace(/^(?!\[|\s{3}|\n$)[^\n]+\n?/gm, '')
			.replace(/(model: <MODEL>\n)\n+(?=\[(?!done\]))/g, '$1\n\n')
			.replace(/\n+\[done\]/g, '\n\n[done]')
			.replace(/(\[Grep\][^\n]*\n\s*→ )No files found/g, '$1No matches found')
	)
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
