import { describe, expect, it } from "vitest"
import { GREP_BODY } from "../expectations"
import { expected, promptPath, runE2E, sanitize } from "../helpers"

const dir = new URL(".", import.meta.url).pathname

describe("grep e2e", () => {
	it("runs claude and parses Grep tool", () => {
		const output = runE2E(promptPath(dir), dir)
		expect(sanitize(output)).toBe(expected(GREP_BODY))
	}, 120_000)
})
