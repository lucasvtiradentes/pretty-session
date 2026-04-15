import { describe, expect, it } from "vitest"
import { TODO_BODY } from "../expectations"
import { expected, fixtureExists, fixturePath, replayFixture, sanitize } from "../helpers"

const dir = new URL(".", import.meta.url).pathname
const fixture = fixturePath(dir)

describe("todo", () => {
	it.skipIf(!fixtureExists(fixture))("parses TodoWrite tool", () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(TODO_BODY))
	})
})
