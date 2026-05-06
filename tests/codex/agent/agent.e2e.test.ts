import { describe, expect, it } from 'vitest'
import { AGENT_STREAM_LINES } from '../expectations'
import { promptPath, runE2E, stripAnsi } from '../helpers'

const dir = new URL('.', import.meta.url).pathname

describe('codex agent e2e', () => {
	it('runs codex and renders spawn_agent + wait collab tool calls', () => {
		const output = stripAnsi(runE2E(promptPath(dir), dir))
		for (const line of AGENT_STREAM_LINES) expect(output).toContain(line)
	}, 120_000)
})
