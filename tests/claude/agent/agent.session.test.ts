import { describe, expect, it } from "vitest"
import { AGENT_BODY } from "../expectations"
import { expected, fixtureExists, replayFixture, sanitize, sessionPath } from "../helpers"

const dir = new URL(".", import.meta.url).pathname
const fixture = sessionPath(dir)

describe("agent - session mode", () => {
	it.skipIf(!fixtureExists(fixture))("parses Agent tool", () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(AGENT_BODY))
	})
})
