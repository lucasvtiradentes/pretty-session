import { describe, expect, it } from 'vitest'
import { READ_BODY } from '../expectations'
import { expected, fixtureExists, replayFixture, sanitize, sessionPath } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const fixture = sessionPath(dir)

describe('read - session mode', () => {
	it.skipIf(!fixtureExists(fixture))('parses Read tool', () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(READ_BODY))
	})
})
