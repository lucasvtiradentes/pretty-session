import { describe, expect, it } from 'vitest'
import { WRITE_BODY } from '../expectations'
import { expected, fixtureExists, replayFixture, sanitize, streamPath } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const fixture = streamPath(dir)

describe('write - stream mode', () => {
	it.skipIf(!fixtureExists(fixture))('parses Write tool from stream', () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(WRITE_BODY))
	})
})
