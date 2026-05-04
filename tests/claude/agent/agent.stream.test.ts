import { describe, expect, it } from "vitest"
import { AGENT_BODY } from "../expectations"
import { expected, fixtureExists, replayFixture, sanitize, streamPath } from "../helpers"

const dir = new URL(".", import.meta.url).pathname
const fixture = streamPath(dir)

describe("agent - stream mode", () => {
	it.skipIf(!fixtureExists(fixture))("parses Agent tool from stream", () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(AGENT_BODY))
	})
})
