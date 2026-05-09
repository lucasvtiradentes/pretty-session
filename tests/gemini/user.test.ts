import { execSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { stripAnsi } from './helpers'

const CLI_ROOT = resolve(dirname(new URL(import.meta.url).pathname), '../..')
const CLI_PATH = resolve(CLI_ROOT, 'src/bin.ts')

function runParse(input: string) {
	return stripAnsi(
		execSync(`npx tsx ${CLI_PATH} parse gemini`, {
			input,
			encoding: 'utf-8',
			cwd: CLI_ROOT,
			env: { ...process.env, GEMINI_CLI_TRUST_WORKSPACE: 'true' },
		}),
	)
}

describe('gemini user messages', () => {
	it('renders multiple saved user messages', () => {
		const output = runParse(
			[
				JSON.stringify({ kind: 'main', sessionId: 'session-1' }),
				JSON.stringify({ type: 'user', content: [{ text: 'first prompt' }] }),
				JSON.stringify({ type: 'gemini', content: 'first answer', model: 'gemini-test' }),
				JSON.stringify({ type: 'user', content: [{ text: 'second prompt' }] }),
				JSON.stringify({ type: 'gemini', content: 'second answer', model: 'gemini-test' }),
			].join('\n'),
		)

		expect(output).toContain('[user] first prompt')
		expect(output).toContain('[user] second prompt')
	})

	it('renders array-shaped stream user content', () => {
		const output = runParse(
			[
				JSON.stringify({ type: 'init', session_id: 'session-1', model: 'gemini-test' }),
				JSON.stringify({ type: 'message', role: 'user', content: [{ text: 'array prompt' }] }),
				JSON.stringify({ type: 'message', role: 'assistant', content: 'array answer' }),
			].join('\n'),
		)

		expect(output).toContain('[user] array prompt')
	})
})
