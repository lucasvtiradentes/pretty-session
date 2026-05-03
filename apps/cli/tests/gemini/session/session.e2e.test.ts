import { describe, expect, it } from "vitest"
import { runE2E, sanitize } from "../helpers"

describe("gemini session - e2e", () => {
	it("parses live stream output", () => {
		const output = sanitize(runE2E("Reply with only e2e-gemini-ok"))
		expect(output).toContain("e2e-gemini-ok")
		expect(output).toContain("[done]")
	}, 120_000)
})
