import { describe, expect, it } from 'vitest'
import { PLAN_MIXED_SESSION_LINES } from '../expectations'
import { fixtureExists, replayFixture, sessionPath, stripAnsi } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const fixture = sessionPath(dir)

describe('codex plan-mixed - session mode', () => {
	it.skipIf(!fixtureExists(fixture))('renders pending, in_progress and completed markers from rollout', () => {
		const output = stripAnsi(replayFixture(fixture))
		for (const line of PLAN_MIXED_SESSION_LINES) expect(output).toContain(line)
	})
})
