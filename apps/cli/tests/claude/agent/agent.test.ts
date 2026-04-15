import { describe, expect, it } from "vitest"
import { AGENT_BODY } from "../expectations"
import { expected, fixtureExists, fixturePath, replayFixture, sanitize } from "../helpers"

const dir = new URL(".", import.meta.url).pathname
const fixture = fixturePath(dir)

describe("agent", () => {
	it.skipIf(!fixtureExists(fixture))("parses Agent tool", () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(AGENT_BODY))
	})
})
