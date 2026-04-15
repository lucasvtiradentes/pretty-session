import { describe, expect, it } from "vitest"
import { TASK_BODY } from "../expectations"
import { expected, fixtureExists, replayFixture, sanitize, sessionPath } from "../helpers"

const dir = new URL(".", import.meta.url).pathname
const fixture = sessionPath(dir)

describe("task - session mode", () => {
	it.skipIf(!fixtureExists(fixture))("parses Task tool", () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(TASK_BODY))
	})
})
