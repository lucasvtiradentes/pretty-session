import { describe, expect, it } from 'vitest'
import { PLAN_MIXED_STREAM_LINES } from '../expectations'
import { fixtureExists, replayFixture, streamPath, stripAnsi } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const fixture = streamPath(dir)

describe('codex plan-mixed - stream mode', () => {
	it.skipIf(!fixtureExists(fixture))(
		'renders completed and pending markers from stream (in_progress collapses to pending)',
		() => {
			const output = stripAnsi(replayFixture(fixture))
			for (const line of PLAN_MIXED_STREAM_LINES) expect(output).toContain(line)
		},
	)
})
