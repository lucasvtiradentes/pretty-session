import { describe, expect, it } from "vitest"
import { RESULT_BODY } from "../expectations"
import { expected, fixturePath, promptPath, runE2E, sanitize } from "../helpers"

const dir = new URL(".", import.meta.url).pathname

describe("result e2e", () => {
	it("runs claude and parses result stats", () => {
		const output = runE2E(promptPath(dir), fixturePath(dir))
		expect(sanitize(output)).toBe(expected(RESULT_BODY))
	}, 120_000)
})
