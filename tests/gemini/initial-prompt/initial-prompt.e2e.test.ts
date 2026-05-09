import { describe, expect, it } from 'vitest'
import { fixtureExists, promptPath, runE2E, sessionPath, streamPath, stripAnsi } from '../helpers'

const dir = new URL('.', import.meta.url).pathname

describe('gemini initial prompt e2e', () => {
	it('generates fixtures and renders the initial user prompt', () => {
		const output = stripAnsi(runE2E(promptPath(dir), dir))
		expect(output).toContain('[user] Reply with exactly initial-prompt-ok and nothing else.')
		expect(output).toContain('initial-prompt-ok')
		expect(fixtureExists(sessionPath(dir))).toBe(true)
		expect(fixtureExists(streamPath(dir))).toBe(true)
	}, 240_000)
})
