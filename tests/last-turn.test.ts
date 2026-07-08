import { execSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = new URL('..', import.meta.url).pathname
const cli = resolve(root, 'src/cli.ts')

function parseLastTurns(provider: string, fixture: string, count = 1): string {
	return execSync(`pnpm exec tsx ${cli} parse ${provider} ${fixture} --last-turns ${count}`, {
		cwd: root,
		encoding: 'utf8',
		env: { ...process.env, PTS_TOOL_RESULT_LINES: '5' },
		timeout: 30_000,
	})
}

describe('parse --last-turns', () => {
	it('keeps the latest real Claude user prompt instead of tool results', () => {
		const output = parseLastTurns('claude', 'tests/claude/todo-write/session.jsonl')
		expect(output).toContain('Use TodoWrite to create a todo list')
		expect(output).toContain('[TodoWrite]')
	})

	it('parses Codex sessions', () => {
		const output = parseLastTurns('codex', 'tests/codex/multi-turn/session.jsonl')
		expect(output).toContain('multi-turn test ok')
		expect(output).toContain('[Bash]')
	})

	it('parses Pi sessions', () => {
		const output = parseLastTurns('pi', 'tests/pi/edit/session.jsonl')
		expect(output).toContain('id:    019eaa69-dbca-7eaf-b555-b615bee3a6aa')
		expect(output).toContain('model: openai-codex/gpt-5.5')
		expect(output).toContain('edit-target.txt')
		expect(output).toContain('[edit]')
	})

	it('parses Gemini sessions', () => {
		const output = parseLastTurns('gemini', 'tests/gemini/write/session.jsonl')
		expect(output).toContain('create a file at path new.txt')
		expect(output).toContain('[Write]')
	})

	it('accepts a turn count', () => {
		const dir = mkdtempSync(resolve(tmpdir(), 'ptsd-last-turns-'))
		const fixture = resolve(dir, 'session.jsonl')
		writeFileSync(
			fixture,
			[
				JSON.stringify({ type: 'session', id: 'session-1' }),
				JSON.stringify({ type: 'model_change', provider: 'test-provider', modelId: 'test-model' }),
				JSON.stringify({
					type: 'message',
					message: { role: 'user', content: [{ type: 'text', text: 'first prompt' }] },
				}),
				JSON.stringify({
					type: 'message',
					message: { role: 'assistant', content: [{ type: 'text', text: 'first answer' }] },
				}),
				JSON.stringify({
					type: 'message',
					message: { role: 'user', content: [{ type: 'text', text: 'second prompt' }] },
				}),
				JSON.stringify({
					type: 'message',
					message: { role: 'assistant', content: [{ type: 'text', text: 'second answer' }] },
				}),
			].join('\n'),
		)

		try {
			const latest = parseLastTurns('pi', fixture)
			expect(latest).not.toContain('first prompt')
			expect(latest).toContain('second prompt')

			const latestTwo = parseLastTurns('pi', fixture, 2)
			expect(latestTwo).toContain('first prompt')
			expect(latestTwo).toContain('second prompt')
		} finally {
			rmSync(dir, { recursive: true, force: true })
		}
	})
})
