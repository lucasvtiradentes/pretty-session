import { describe, expect, it } from 'vitest'
import { MULTI_TURN_BODY } from '../expectations'
import { expected, fixtureExists, replayFixture, sanitize, sessionPath } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const fixture = sessionPath(dir)

describe('codex multi-turn - session mode', () => {
	it.skipIf(!fixtureExists(fixture))('parses bash + edit from session', () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(MULTI_TURN_BODY))
	})
})
