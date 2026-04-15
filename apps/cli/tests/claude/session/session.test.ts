import { describe, expect, it } from "vitest"
import { SESSION_BODY } from "../expectations"
import { expected, fixtureExists, fixturePath, replayFixture, sanitize } from "../helpers"

const dir = new URL(".", import.meta.url).pathname
const fixture = fixturePath(dir)

describe("session", () => {
	it.skipIf(!fixtureExists(fixture))("parses session init and result", () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(SESSION_BODY))
	})
})
