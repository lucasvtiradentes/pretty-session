import { describe, expect, it } from 'vitest'
import { AGENT_STREAM_LINES } from '../expectations'
import { fixtureExists, replayFixture, streamPath, stripAnsi } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const fixture = streamPath(dir)

describe('codex agent - stream mode', () => {
	it.skipIf(!fixtureExists(fixture))('renders collab_tool_call spawn and wait result from stream', () => {
		const output = stripAnsi(replayFixture(fixture))
		for (const line of AGENT_STREAM_LINES) expect(output).toContain(line)
	})
})
