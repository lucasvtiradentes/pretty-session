import { describe, expect, it } from "vitest"
import { TODO_BODY } from "../expectations"
import { expected, fixtureExists, replayFixture, sanitize, sessionPath } from "../helpers"

const dir = new URL(".", import.meta.url).pathname
const fixture = sessionPath(dir)

describe("todo - session mode", () => {
	it.skipIf(!fixtureExists(fixture))("parses TodoWrite tool", () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(TODO_BODY))
	})
})
