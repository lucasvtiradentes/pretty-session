import { describe, expect, it } from 'vitest'
import { EDIT_BODY } from '../expectations'
import { expected, fixtureExists, replayFixture, sanitize, sessionPath } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const fixture = sessionPath(dir)

describe('edit - session mode', () => {
	it.skipIf(!fixtureExists(fixture))('parses Edit tool', () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(EDIT_BODY))
	})
})
