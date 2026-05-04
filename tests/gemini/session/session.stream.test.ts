import { describe, expect, it } from "vitest"
import { expected, fixtureExists, replayFixture, sanitize, streamPath } from "../helpers"

const dir = new URL(".", import.meta.url).pathname
const fixture = streamPath(dir)

describe("gemini session - stream mode", () => {
	it.skipIf(!fixtureExists(fixture))("parses stream output", () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected("fixture-gemini-stream-ok"))
	})
})
