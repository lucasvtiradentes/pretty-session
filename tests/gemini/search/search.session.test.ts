import { describe, expect, it } from 'vitest'
import { fixtureExists, replayFixture, sanitize, sessionPath } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const fixture = sessionPath(dir)

describe('gemini search - session mode', () => {
	it.skipIf(!fixtureExists(fixture))('renders grep_search from saved session', () => {
		const output = sanitize(replayFixture(fixture))
		expect(output).toContain('[Search] version')
	})
})
