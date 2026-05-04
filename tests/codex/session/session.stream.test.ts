import { describe, expect, it } from 'vitest'
import { expectedStream, fixtureExists, replayFixture, sanitize, streamPath } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const fixture = streamPath(dir)

describe('codex session - stream mode', () => {
	it.skipIf(!fixtureExists(fixture))('parses session init from stream', () => {
		expect(sanitize(replayFixture(fixture))).toBe(expectedStream(''))
	})
})
