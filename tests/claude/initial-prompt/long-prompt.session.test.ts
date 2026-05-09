import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { replayFixture, stripAnsi } from '../helpers'

describe('initial prompt - long session prompt', () => {
	it('renders the full initial user prompt without truncation', () => {
		const prompt = `start ${'x'.repeat(260)} end`
		const fixture = join(mkdtempSync(join(tmpdir(), 'pts-long-prompt-')), 'session.jsonl')
		writeFileSync(
			fixture,
			[
				JSON.stringify({
					type: 'queue-operation',
					operation: 'enqueue',
					timestamp: '2026-05-09T15:04:30.144Z',
					sessionId: 'long-prompt',
					content: prompt,
				}),
				JSON.stringify({
					type: 'queue-operation',
					operation: 'dequeue',
					timestamp: '2026-05-09T15:04:30.144Z',
					sessionId: 'long-prompt',
				}),
				JSON.stringify({
					parentUuid: null,
					isSidechain: false,
					type: 'user',
					message: { role: 'user', content: prompt },
					uuid: 'user-1',
					timestamp: '2026-05-09T15:04:30.148Z',
					cwd: '/tmp',
					sessionId: 'long-prompt',
				}),
				JSON.stringify({
					parentUuid: 'user-1',
					isSidechain: false,
					type: 'assistant',
					message: {
						model: 'claude',
						id: 'msg-1',
						type: 'message',
						role: 'assistant',
						content: [{ type: 'text', text: 'ok' }],
						usage: { input_tokens: 1, output_tokens: 1 },
					},
					uuid: 'assistant-1',
					timestamp: '2026-05-09T15:04:32.836Z',
					sessionId: 'long-prompt',
				}),
			].join('\n'),
		)

		const output = stripAnsi(replayFixture(fixture))
		expect(output).toContain(`[user] ${prompt}`)
		expect(output).not.toContain('...')
	})
})
