import { describe, expect, it } from 'vitest'
import { PLAN_BODY_LINES } from '../expectations'
import { fixtureExists, replayFixture, sessionPath, stripAnsi } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const fixture = sessionPath(dir)

describe('codex plan - session mode', () => {
	it.skipIf(!fixtureExists(fixture))('renders update_plan as a checklist', () => {
		const output = stripAnsi(replayFixture(fixture))
		for (const line of PLAN_BODY_LINES) expect(output).toContain(line)
	})
})
