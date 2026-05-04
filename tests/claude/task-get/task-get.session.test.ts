import { describe, expect, it } from "vitest"
import { TASK_GET_BODY } from "../expectations"
import { expected, fixtureExists, replayFixture, sanitize, sessionPath } from "../helpers"

const dir = new URL(".", import.meta.url).pathname
const fixture = sessionPath(dir)

describe("task-get - session mode", () => {
	it.skipIf(!fixtureExists(fixture))("parses TaskGet tool", () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(TASK_GET_BODY))
	})
})
