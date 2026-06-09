import { describe, expect, it } from 'vitest'
import { EDIT_BODY } from '../expectations'
import { expected, fixtureExists, replayFixture, sanitize, streamPath } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const fixture = streamPath(dir)

describe('pi edit - stream mode', () => {
	it.skipIf(!fixtureExists(fixture))('parses edit from stream', () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(EDIT_BODY))
	})
})
