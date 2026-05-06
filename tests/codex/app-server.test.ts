import { describe, expect, it } from 'vitest'
import { CodexState, finalizeCodex, parseCodexLine } from '../../src/providers/codex'

const ansiPattern = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, 'g')
const stripAnsi = (value: string) => value.replace(ansiPattern, '')

describe('codex app-server parser', () => {
	it('parses app-server output forwarded by agent-session-kit', () => {
		const state = new CodexState()
		let output = ''

		output += parseCodexLine(
			JSON.stringify({
				id: 2,
				result: {
					thread: {
						id: 'thread-1',
						path: '~/.codex/sessions/test.jsonl',
					},
					model: 'gpt-5.5',
				},
			}),
			state,
		).getOutput()
		output += parseCodexLine(
			JSON.stringify({
				method: 'item/agentMessage/delta',
				params: {
					delta: 'ask-codex-ok',
				},
			}),
			state,
		).getOutput()
		output += parseCodexLine(
			JSON.stringify({
				method: 'thread/tokenUsage/updated',
				params: {
					tokenUsage: {
						total: {
							inputTokens: 12,
							cachedInputTokens: 5,
							outputTokens: 6,
							reasoningOutputTokens: 2,
						},
					},
				},
			}),
			state,
		).getOutput()
		output += parseCodexLine(
			JSON.stringify({
				method: 'turn/completed',
				params: {},
			}),
			state,
		).getOutput()
		output += finalizeCodex(state).getOutput()

		expect(stripAnsi(output)).toContain('id:    thread-1')
		expect(stripAnsi(output)).toContain('model: codex')
		expect(stripAnsi(output)).toContain('ask-codex-ok')
		expect(stripAnsi(output)).toContain('[done] 1 turns, 17 in / 8 out')
	})

	it('renders bash tool calls and outputs from live app-server item events', () => {
		const state = new CodexState()
		let output = ''

		output += parseCodexLine(
			JSON.stringify({
				id: 2,
				result: { thread: { id: 'thread-2' }, model: 'gpt-5.5' },
			}),
			state,
		).getOutput()
		output += parseCodexLine(
			JSON.stringify({
				method: 'item/started',
				params: { item: { type: 'agentMessage', id: 'msg_1', text: '' } },
			}),
			state,
		).getOutput()
		output += parseCodexLine(
			JSON.stringify({
				method: 'item/agentMessage/delta',
				params: { delta: 'About to run ls.' },
			}),
			state,
		).getOutput()
		output += parseCodexLine(
			JSON.stringify({
				method: 'item/completed',
				params: { item: { type: 'agentMessage', id: 'msg_1', text: 'About to run ls.' } },
			}),
			state,
		).getOutput()
		output += parseCodexLine(
			JSON.stringify({
				method: 'item/started',
				params: {
					item: {
						type: 'commandExecution',
						id: 'call_1',
						command: "/bin/zsh -lc 'ls /tmp'",
						aggregatedOutput: null,
						status: 'inProgress',
					},
				},
			}),
			state,
		).getOutput()
		output += parseCodexLine(
			JSON.stringify({
				method: 'item/completed',
				params: {
					item: {
						type: 'commandExecution',
						id: 'call_1',
						command: "/bin/zsh -lc 'ls /tmp'",
						aggregatedOutput: 'fileA\nfileB\n',
						status: 'completed',
						exitCode: 0,
					},
				},
			}),
			state,
		).getOutput()
		output += parseCodexLine(
			JSON.stringify({
				method: 'item/started',
				params: { item: { type: 'agentMessage', id: 'msg_2', text: '' } },
			}),
			state,
		).getOutput()
		output += parseCodexLine(
			JSON.stringify({
				method: 'item/agentMessage/delta',
				params: { delta: 'Done.' },
			}),
			state,
		).getOutput()
		output += parseCodexLine(
			JSON.stringify({
				method: 'item/completed',
				params: { item: { type: 'agentMessage', id: 'msg_2', text: 'Done.' } },
			}),
			state,
		).getOutput()
		output += parseCodexLine(
			JSON.stringify({
				method: 'turn/completed',
				params: {},
			}),
			state,
		).getOutput()
		output += finalizeCodex(state).getOutput()

		const clean = stripAnsi(output)
		expect(clean).toContain('id:    thread-2')
		expect(clean).toContain('About to run ls.')
		expect(clean).toContain('[Bash] ls /tmp')
		expect(clean).toContain('→ fileA')
		expect(clean).toContain('→ fileB')
		expect(clean).toContain('Done.')

		const aboutIdx = clean.indexOf('About to run ls.')
		const bashIdx = clean.indexOf('[Bash] ls /tmp')
		const fileAIdx = clean.indexOf('→ fileA')
		const doneIdx = clean.indexOf('Done.')
		expect(aboutIdx).toBeGreaterThan(0)
		expect(bashIdx).toBeGreaterThan(aboutIdx)
		expect(fileAIdx).toBeGreaterThan(bashIdx)
		expect(doneIdx).toBeGreaterThan(fileAIdx)
	})

	it('does not duplicate text when only deltas are emitted (legacy flow)', () => {
		const state = new CodexState()
		let output = ''

		output += parseCodexLine(
			JSON.stringify({
				id: 2,
				result: { thread: { id: 'thread-3' }, model: 'gpt-5.5' },
			}),
			state,
		).getOutput()
		output += parseCodexLine(
			JSON.stringify({
				method: 'item/agentMessage/delta',
				params: { delta: 'unique-text-marker' },
			}),
			state,
		).getOutput()
		output += parseCodexLine(JSON.stringify({ method: 'turn/completed', params: {} }), state).getOutput()
		output += finalizeCodex(state).getOutput()

		const clean = stripAnsi(output)
		const occurrences = clean.split('unique-text-marker').length - 1
		expect(occurrences).toBe(1)
	})

	it('renders write_stdin tool calls from rollout function_call', () => {
		const state = new CodexState()
		let output = ''

		output += parseCodexLine(
			JSON.stringify({ type: 'session_meta', payload: { id: 'thread-stdin', timestamp: '2026-05-06T00:00:00.000Z' } }),
			state,
		).getOutput()
		output += parseCodexLine(
			JSON.stringify({ type: 'turn_context', payload: { model: 'gpt-5.5', timezone: 'UTC' } }),
			state,
		).getOutput()
		output += parseCodexLine(
			JSON.stringify({
				type: 'response_item',
				payload: {
					type: 'function_call',
					name: 'write_stdin',
					arguments: JSON.stringify({ session_id: 'shell-abc', stdin: 'echo hi\n' }),
				},
			}),
			state,
		).getOutput()
		output += parseCodexLine(
			JSON.stringify({
				type: 'response_item',
				payload: { type: 'message', role: 'assistant', content: [{ type: 'output_text', text: 'sent.' }] },
			}),
			state,
		).getOutput()
		output += finalizeCodex(state).getOutput()

		const clean = stripAnsi(output)
		expect(clean).toContain('id:    thread-stdin')
		expect(clean).toContain('[Stdin] session=shell-abc')
		expect(clean).toContain('sent.')
	})

	it('renders todo_list items as a checklist when emitted by item.completed', () => {
		const state = new CodexState()
		let output = ''

		output += parseCodexLine(JSON.stringify({ type: 'thread.started', thread_id: 'thread-plan' }), state).getOutput()
		output += parseCodexLine(JSON.stringify({ type: 'turn.started' }), state).getOutput()
		output += parseCodexLine(
			JSON.stringify({
				type: 'item.completed',
				item: {
					id: 'plan-1',
					type: 'todo_list',
					items: [
						{ text: 'a', completed: true },
						{ text: 'b', completed: false },
					],
				},
			}),
			state,
		).getOutput()
		output += parseCodexLine(
			JSON.stringify({ type: 'turn.completed', usage: { input_tokens: 1, output_tokens: 1 } }),
			state,
		).getOutput()
		output += finalizeCodex(state).getOutput()

		const clean = stripAnsi(output)
		expect(clean).toContain('[Plan]')
		expect(clean).toContain('[x] a')
		expect(clean).toContain('[ ] b')
	})
})
