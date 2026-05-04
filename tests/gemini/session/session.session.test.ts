import { describe, expect, it } from "vitest"
import { expected, fixtureExists, replayFixture, sanitize, sessionPath } from "../helpers"

const dir = new URL(".", import.meta.url).pathname
const fixture = sessionPath(dir)

describe("gemini session - session mode", () => {
	it.skipIf(!fixtureExists(fixture))("parses saved session", () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected("fixture-gemini-ok"))
	})
})
