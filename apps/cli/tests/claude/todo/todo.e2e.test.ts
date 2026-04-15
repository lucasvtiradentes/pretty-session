import { describe, expect, it } from "vitest"
import { TODO_BODY } from "../expectations"
import { expected, fixturePath, promptPath, runE2E, sanitize } from "../helpers"

const dir = new URL(".", import.meta.url).pathname

describe("todo e2e", () => {
	it("runs claude and parses TodoWrite tool", () => {
		const output = runE2E(promptPath(dir), fixturePath(dir))
		expect(sanitize(output)).toBe(expected(TODO_BODY))
	}, 120_000)
})
