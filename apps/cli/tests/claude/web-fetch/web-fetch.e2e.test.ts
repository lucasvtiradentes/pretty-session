import { describe, expect, it } from "vitest"
import { Tool } from "../../../src/providers/claude/constants"
import { promptPath, runE2E, sanitize } from "../helpers"

const dir = new URL(".", import.meta.url).pathname

describe("web-fetch e2e", () => {
	it("runs claude and parses WebFetch tool", () => {
		const output = sanitize(runE2E(promptPath(dir), dir))
		expect(output).toContain(`[${Tool.WebFetch}] https://example.com`)
	}, 120_000)
})
