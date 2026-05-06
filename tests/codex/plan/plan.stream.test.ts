import { describe, expect, it } from 'vitest'
import { PLAN_BODY_LINES } from '../expectations'
import { fixtureExists, replayFixture, streamPath, stripAnsi } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const fixture = streamPath(dir)

describe('codex plan - stream mode', () => {
	it.skipIf(!fixtureExists(fixture))('renders todo_list item as a checklist from stream', () => {
		const output = stripAnsi(replayFixture(fixture))
		for (const line of PLAN_BODY_LINES) expect(output).toContain(line)
	})
})
