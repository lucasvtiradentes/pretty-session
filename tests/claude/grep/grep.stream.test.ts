import { describe, expect, it } from 'vitest'
import { GREP_BODY } from '../expectations'
import { expected, fixtureExists, replayFixture, sanitize, streamPath } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const fixture = streamPath(dir)

describe('grep - stream mode', () => {
	it.skipIf(!fixtureExists(fixture))('parses Grep tool from stream', () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(GREP_BODY))
	})
})
