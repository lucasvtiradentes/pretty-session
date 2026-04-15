import { describe, expect, it } from "vitest"
import { READ_BODY } from "../expectations"
import { expected, fixtureExists, fixturePath, replayFixture, sanitize } from "../helpers"

const dir = new URL(".", import.meta.url).pathname
const fixture = fixturePath(dir)

describe("read", () => {
	it.skipIf(!fixtureExists(fixture))("parses Read tool", () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(READ_BODY))
	})
})
