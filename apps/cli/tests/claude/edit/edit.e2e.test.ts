import { describe, expect, it } from "vitest"
import { EDIT_BODY } from "../expectations"
import { expected, fixturePath, promptPath, runE2E, sanitize } from "../helpers"

const dir = new URL(".", import.meta.url).pathname

describe("edit e2e", () => {
	it("runs claude and parses Edit tool", () => {
		const output = runE2E(promptPath(dir), fixturePath(dir))
		expect(sanitize(output)).toBe(expected(EDIT_BODY))
	}, 120_000)
})
