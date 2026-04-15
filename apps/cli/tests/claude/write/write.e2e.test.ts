import { describe, expect, it } from "vitest"
import { WRITE_BODY } from "../expectations"
import { expected, fixturePath, promptPath, runE2E, sanitize } from "../helpers"

const dir = new URL(".", import.meta.url).pathname

describe("write e2e", () => {
	it("runs claude and parses Write tool", () => {
		const output = runE2E(promptPath(dir), fixturePath(dir))
		expect(sanitize(output)).toBe(expected(WRITE_BODY))
	}, 120_000)
})
