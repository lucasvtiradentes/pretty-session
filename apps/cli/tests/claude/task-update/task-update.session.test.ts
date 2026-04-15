import { describe, expect, it } from "vitest"
import { TASK_UPDATE_BODY } from "../expectations"
import { expected, fixtureExists, replayFixture, sanitize, sessionPath } from "../helpers"

const dir = new URL(".", import.meta.url).pathname
const fixture = sessionPath(dir)

describe("task-update - session mode", () => {
	it.skipIf(!fixtureExists(fixture))("parses TaskUpdate tool", () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(TASK_UPDATE_BODY))
	})
})
