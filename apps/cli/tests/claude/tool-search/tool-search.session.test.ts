import { describe, expect, it } from "vitest"
import { TOOL_SEARCH_BODY } from "../expectations"
import { expected, fixtureExists, replayFixture, sanitize, sessionPath } from "../helpers"

const dir = new URL(".", import.meta.url).pathname
const fixture = sessionPath(dir)

describe("tool-search - session mode", () => {
	it.skipIf(!fixtureExists(fixture))("parses ToolSearch tool", () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(TOOL_SEARCH_BODY))
	})
})
