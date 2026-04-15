import { describe, expect, it } from "vitest"
import { SESSION_BODY } from "../expectations"
import { expected, fixturePath, promptPath, runE2E, sanitize } from "../helpers"

const dir = new URL(".", import.meta.url).pathname

describe("session e2e", () => {
	it("runs claude and parses session init", () => {
		const output = runE2E(promptPath(dir), fixturePath(dir))
		expect(sanitize(output)).toBe(expected(SESSION_BODY))
	}, 120_000)
})
