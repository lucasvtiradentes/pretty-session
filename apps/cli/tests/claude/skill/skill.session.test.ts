import { describe, expect, it } from "vitest"
import { SKILL_BODY } from "../expectations"
import { expected, fixtureExists, replayFixture, sanitize, sessionPath } from "../helpers"

const dir = new URL(".", import.meta.url).pathname
const fixture = sessionPath(dir)

describe("skill - session mode", () => {
	it.skipIf(!fixtureExists(fixture))("parses Skill tool", () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(SKILL_BODY))
	})
})
