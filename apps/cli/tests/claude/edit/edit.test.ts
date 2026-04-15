import { describe, expect, it } from "vitest"
import { EDIT_BODY } from "../expectations"
import { expected, fixtureExists, fixturePath, replayFixture, sanitize } from "../helpers"

const dir = new URL(".", import.meta.url).pathname
const fixture = fixturePath(dir)

describe("edit", () => {
	it.skipIf(!fixtureExists(fixture))("parses Edit tool", () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(EDIT_BODY))
	})
})
