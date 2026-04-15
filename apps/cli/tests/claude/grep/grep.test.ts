import { describe, expect, it } from "vitest"
import { GREP_BODY } from "../expectations"
import { expected, fixtureExists, fixturePath, replayFixture, sanitize } from "../helpers"

const dir = new URL(".", import.meta.url).pathname
const fixture = fixturePath(dir)

describe("grep", () => {
	it.skipIf(!fixtureExists(fixture))("parses Grep tool", () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(GREP_BODY))
	})
})
