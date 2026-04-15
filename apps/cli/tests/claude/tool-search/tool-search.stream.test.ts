import { describe, expect, it } from "vitest"
import { fixtureExists, replayFixture, sanitize, streamPath } from "../helpers"

const dir = new URL(".", import.meta.url).pathname
const fixture = streamPath(dir)

describe("tool-search - stream mode", () => {
	it.skipIf(!fixtureExists(fixture))("parses ToolSearch tool from stream", () => {
		const output = sanitize(replayFixture(fixture))
		expect(output).toContain('[tool-search] "select:WebFetch"')
	})
})
