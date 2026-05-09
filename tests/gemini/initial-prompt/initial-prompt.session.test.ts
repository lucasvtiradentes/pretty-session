import { describe, expect, it } from 'vitest'
import { replayFixture, sessionPath, stripAnsi } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const fixture = sessionPath(dir)

describe('gemini initial prompt - session mode', () => {
	it('renders the initial user prompt from session fixture', () => {
		const output = stripAnsi(replayFixture(fixture))
		expect(output).toContain('[user] Reply with exactly initial-prompt-ok and nothing else.')
		expect(output).toContain('initial-prompt-ok')
	})
})
