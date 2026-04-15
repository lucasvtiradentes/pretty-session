import { describe, expect, it } from "vitest"
import { WRITE_BODY } from "../expectations"
import { expected, fixtureExists, fixturePath, replayFixture, sanitize } from "../helpers"

const dir = new URL(".", import.meta.url).pathname
const fixture = fixturePath(dir)

describe("write", () => {
	it.skipIf(!fixtureExists(fixture))("parses Write tool", () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(WRITE_BODY))
	})
})
