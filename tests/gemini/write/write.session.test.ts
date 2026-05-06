import { describe, expect, it } from 'vitest'
import { fixtureExists, replayFixture, sanitize, sessionPath } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const fixture = sessionPath(dir)

describe('gemini write - session mode', () => {
	it.skipIf(!fixtureExists(fixture))('renders write_file from saved session', () => {
		const output = sanitize(replayFixture(fixture))
		expect(output).toContain('[Write] new.txt')
	})
})
