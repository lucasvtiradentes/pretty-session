import { describe, expect, it } from "vitest"
import { GLOB_BODY } from "../expectations"
import { expected, fixtureExists, replayFixture, sanitize, streamPath } from "../helpers"

const dir = new URL(".", import.meta.url).pathname
const fixture = streamPath(dir)

describe("glob - stream mode", () => {
	it.skipIf(!fixtureExists(fixture))("parses Glob tool from stream", () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(GLOB_BODY))
	})
})
