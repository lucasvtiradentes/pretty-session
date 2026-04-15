import { describe, expect, it } from "vitest"
import { BASH_BODY } from "../expectations"
import { expected, fixtureExists, fixturePath, replayFixture, sanitize } from "../helpers"

const dir = new URL(".", import.meta.url).pathname
const fixture = fixturePath(dir)

describe("bash", () => {
	it.skipIf(!fixtureExists(fixture))("parses Bash tool", () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(BASH_BODY))
	})
})
