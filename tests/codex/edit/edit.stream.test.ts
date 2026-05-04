import { describe, expect, it } from 'vitest'
import { EDIT_BODY } from '../expectations'
import { expectedStream, fixtureExists, replayFixture, sanitize, streamPath } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const fixture = streamPath(dir)

describe('codex edit - stream mode', () => {
	it.skipIf(!fixtureExists(fixture))('parses Edit tool from stream', () => {
		expect(sanitize(replayFixture(fixture))).toBe(expectedStream(EDIT_BODY))
	})
})
