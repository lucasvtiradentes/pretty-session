import { describe, expect, it } from "vitest"
import { RESULT_BODY } from "../expectations"
import { expected, fixtureExists, fixturePath, replayFixture, sanitize } from "../helpers"

const dir = new URL(".", import.meta.url).pathname
const fixture = fixturePath(dir)

describe("result", () => {
	it.skipIf(!fixtureExists(fixture))("parses result stats", () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(RESULT_BODY))
	})
})
