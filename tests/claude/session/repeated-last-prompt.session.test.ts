import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { replayFixture, stripAnsi } from '../helpers'

describe('session - repeated last-prompt records', () => {
	it('renders the done footer once at the end', () => {
		const fixture = join(mkdtempSync(join(tmpdir(), 'pts-last-prompt-')), 'session.jsonl')
		writeFileSync(
			fixture,
			[
				JSON.stringify({
					parentUuid: null,
					isSidechain: false,
					type: 'user',
					message: { role: 'user', content: 'review this' },
					uuid: 'user-1',
					timestamp: '2026-05-09T15:04:30.148Z',
					cwd: '/tmp',
					sessionId: 'last-prompt',
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
						content: [{ type: 'text', text: 'first' }],
						usage: { input_tokens: 1, cache_read_input_tokens: 2, cache_creation_input_tokens: 3, output_tokens: 4 },
					},
					uuid: 'assistant-1',
					timestamp: '2026-05-09T15:04:32.836Z',
					sessionId: 'last-prompt',
				}),
				JSON.stringify({
					type: 'last-prompt',
					lastPrompt: 'review this',
					leafUuid: 'assistant-1',
					sessionId: 'last-prompt',
				}),
				JSON.stringify({
					parentUuid: 'assistant-1',
					isSidechain: false,
					type: 'assistant',
					message: {
						model: 'claude',
						id: 'msg-2',
						type: 'message',
						role: 'assistant',
						content: [{ type: 'text', text: 'second' }],
						usage: { input_tokens: 5, cache_read_input_tokens: 6, cache_creation_input_tokens: 7, output_tokens: 8 },
					},
					uuid: 'assistant-2',
					timestamp: '2026-05-09T15:04:35.836Z',
					sessionId: 'last-prompt',
				}),
				JSON.stringify({
					type: 'last-prompt',
					lastPrompt: 'review this',
					leafUuid: 'assistant-2',
					sessionId: 'last-prompt',
				}),
				JSON.stringify({
					type: 'last-prompt',
					lastPrompt: 'review this',
					leafUuid: 'assistant-2',
					sessionId: 'last-prompt',
				}),
			].join('\n'),
		)

		const output = stripAnsi(replayFixture(fixture))
		expect(output.match(/\[done\]/g)).toHaveLength(1)
		expect(output).toContain('[done] 0.0s, $0.0000, 1 turns, 18 in / 8 out')
	})
})
