import { describe, expect, it } from "vitest"
import { fixtureExists, replayFixture, sanitize, streamPath } from "../helpers"

const dir = new URL(".", import.meta.url).pathname
const fixture = streamPath(dir)

describe("web-search - stream mode", () => {
	it.skipIf(!fixtureExists(fixture))("parses WebSearch tool from stream", () => {
		const output = sanitize(replayFixture(fixture))
		expect(output).toContain('[web-search] "vitest testing framework"')
	})
})
