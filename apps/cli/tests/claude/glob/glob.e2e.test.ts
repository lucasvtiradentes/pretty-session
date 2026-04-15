import { describe, expect, it } from "vitest"
import { GLOB_BODY } from "../expectations"
import { expected, promptPath, runE2E, sanitize } from "../helpers"

const dir = new URL(".", import.meta.url).pathname

describe("glob e2e", () => {
	it("runs claude and parses Glob tool", () => {
		const output = runE2E(promptPath(dir), dir)
		expect(sanitize(output)).toBe(expected(GLOB_BODY))
	}, 120_000)
})
