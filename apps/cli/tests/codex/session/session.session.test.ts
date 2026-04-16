import { describe, expect, it } from "vitest"
import { expected, fixtureExists, replayFixture, sanitize, sessionPath } from "../helpers"

const dir = new URL(".", import.meta.url).pathname
const fixture = sessionPath(dir)

describe("codex session - session mode", () => {
	it.skipIf(!fixtureExists(fixture))("parses session init from session", () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(""))
	})
})
