import { describe, expect, it } from "vitest"

import { expected, fixtureExists, replayFixture, sanitize, streamPath } from "../helpers"

const dir = new URL(".", import.meta.url).pathname
const fixture = streamPath(dir)

describe("result - stream mode", () => {
	it.skipIf(!fixtureExists(fixture))("parses result stats from stream", () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(""))
	})
})
