import { describe, expect, it } from 'vitest'
import { fixtureExists, replayFixture, sanitize, sessionPath } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const fixture = sessionPath(dir)

describe('gemini tools - session mode', () => {
	it.skipIf(!fixtureExists(fixture))('renders read/write/search tool calls', () => {
		const output = sanitize(replayFixture(fixture))
		expect(output).toContain('[Read] test.txt')
		expect(output).toContain('Hello world.')
		expect(output).toContain('[Write] new.txt')
		expect(output).toContain('+1 -0 lines')
		expect(output).toContain('[Search] world')
		expect(output).toContain('Found 1 match')
		expect(output).toContain('All done.')
	})
})
