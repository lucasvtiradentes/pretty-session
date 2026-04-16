import { describe, expect, it } from "vitest"
import { MULTI_TURN_BODY } from "../expectations"
import { expectedStream, fixtureExists, replayFixture, sanitize, streamPath } from "../helpers"

const dir = new URL(".", import.meta.url).pathname
const fixture = streamPath(dir)

describe("codex multi-turn - stream mode", () => {
	it.skipIf(!fixtureExists(fixture))("parses bash + edit from stream", () => {
		expect(sanitize(replayFixture(fixture))).toBe(expectedStream(MULTI_TURN_BODY))
	})
})
