import { describe, expect, it } from 'vitest'
import { AGENT_SESSION_LINES } from '../expectations'
import { fixtureExists, replayFixture, sessionPath, stripAnsi } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const fixture = sessionPath(dir)

describe('codex agent - session mode', () => {
	it.skipIf(!fixtureExists(fixture))('renders spawn_agent with agent_type from rollout', () => {
		const output = stripAnsi(replayFixture(fixture))
		for (const line of AGENT_SESSION_LINES) expect(output).toContain(line)
	})
})
