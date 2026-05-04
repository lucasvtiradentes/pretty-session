import { describe, expect, it } from 'vitest'
import { TODO_WRITE_BODY } from '../expectations'
import { expected, fixtureExists, replayFixture, sanitize, streamPath } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const fixture = streamPath(dir)

describe('todo-write - stream mode', () => {
	it.skipIf(!fixtureExists(fixture))('parses TodoWrite tool from stream', () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(TODO_WRITE_BODY))
	})
})
