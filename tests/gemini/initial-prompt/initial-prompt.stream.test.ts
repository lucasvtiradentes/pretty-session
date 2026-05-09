import { describe, expect, it } from 'vitest'
import { replayFixture, streamPath, stripAnsi } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const fixture = streamPath(dir)

describe('gemini initial prompt - stream mode', () => {
	it('renders the initial user prompt from stream fixture', () => {
		const output = stripAnsi(replayFixture(fixture))
		expect(output).toContain('[user] Reply with exactly initial-prompt-ok and nothing else.')
		expect(output).toContain('initial-prompt-ok')
	})
})
