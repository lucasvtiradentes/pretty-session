import { describe, expect, it } from "vitest"
import { BASH_BODY } from "../expectations"
import { expectedStream, promptPath, runE2E, sanitize } from "../helpers"

const dir = new URL(".", import.meta.url).pathname

describe("codex bash e2e", () => {
	it("runs codex and parses Bash tool", () => {
		const output = runE2E(promptPath(dir), dir)
		expect(sanitize(output)).toBe(expectedStream(BASH_BODY))
	}, 120_000)
})
