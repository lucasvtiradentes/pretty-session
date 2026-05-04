import { describe, expect, it } from 'vitest'
import { READ_BODY } from '../expectations'
import { expected, fixtureExists, replayFixture, sanitize, streamPath } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const fixture = streamPath(dir)

describe('read - stream mode', () => {
	it.skipIf(!fixtureExists(fixture))('parses Read tool from stream', () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(READ_BODY))
	})
})
