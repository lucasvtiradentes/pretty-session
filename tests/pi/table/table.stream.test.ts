import { describe, expect, it } from 'vitest'
import { TABLE_BODY } from '../expectations'
import { expected, fixtureExists, replayFixture, sanitize, streamPath } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const fixture = streamPath(dir)

describe('pi table - stream mode', () => {
	it.skipIf(!fixtureExists(fixture))('parses table from stream', () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(TABLE_BODY))
	})
})
