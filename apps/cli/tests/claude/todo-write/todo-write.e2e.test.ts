import { describe, expect, it } from "vitest"
import { TODO_WRITE_BODY } from "../expectations"
import { expected, promptPath, runE2E, sanitize } from "../helpers"

const dir = new URL(".", import.meta.url).pathname

describe("todo-write e2e", () => {
	it("runs claude and parses TodoWrite tool", () => {
		const output = runE2E(promptPath(dir), dir)
		expect(sanitize(output)).toBe(expected(TODO_WRITE_BODY))
	}, 120_000)
})
