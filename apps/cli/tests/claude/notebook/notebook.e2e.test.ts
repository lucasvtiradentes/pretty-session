import { describe, expect, it } from "vitest"
import { NOTEBOOK_BODY } from "../expectations"
import { expected, promptPath, runE2E, sanitize } from "../helpers"

const dir = new URL(".", import.meta.url).pathname

describe("notebook e2e", () => {
	it("runs claude and parses NotebookEdit tool", () => {
		const output = runE2E(promptPath(dir), dir)
		expect(sanitize(output)).toBe(expected(NOTEBOOK_BODY))
	}, 120_000)
})
