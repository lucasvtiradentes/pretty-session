import { describe, expect, it } from "vitest"
import { Tool } from "../../../src/providers/claude/constants"
import { fixtureExists, replayFixture, sanitize, sessionPath } from "../helpers"

const dir = new URL(".", import.meta.url).pathname
const fixture = sessionPath(dir)

describe("web-fetch - session mode", () => {
	it.skipIf(!fixtureExists(fixture))("parses WebFetch tool", () => {
		const output = sanitize(replayFixture(fixture))
		expect(output).toContain(`[${Tool.WebFetch}] https://example.com`)
	})
})
