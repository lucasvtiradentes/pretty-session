import { describe, expect, it } from "vitest"
import { WEB_SEARCH_BODY } from "../expectations"
import { expected, promptPath, runE2E, sanitize } from "../helpers"

const dir = new URL(".", import.meta.url).pathname

describe("web-search e2e", () => {
	it("runs claude and parses WebSearch tool", () => {
		const output = runE2E(promptPath(dir), dir)
		expect(sanitize(output)).toBe(expected(WEB_SEARCH_BODY))
	}, 120_000)
})
