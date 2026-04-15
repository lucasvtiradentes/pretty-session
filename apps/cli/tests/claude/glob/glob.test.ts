import { describe, expect, it } from "vitest"
import { GLOB_BODY } from "../expectations"
import { expected, fixtureExists, fixturePath, replayFixture, sanitize } from "../helpers"

const dir = new URL(".", import.meta.url).pathname
const fixture = fixturePath(dir)

describe("glob", () => {
	it.skipIf(!fixtureExists(fixture))("parses Glob tool", () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(GLOB_BODY))
	})
})
