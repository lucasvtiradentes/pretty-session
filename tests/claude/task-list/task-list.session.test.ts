import { describe, expect, it } from 'vitest'
import { TASK_LIST_BODY } from '../expectations'
import { expected, fixtureExists, replayFixture, sanitize, sessionPath } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const fixture = sessionPath(dir)

describe('task-list - session mode', () => {
	it.skipIf(!fixtureExists(fixture))('parses TaskList tool', () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(TASK_LIST_BODY))
	})
})
