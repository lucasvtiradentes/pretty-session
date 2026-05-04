import { describe, expect, it } from "vitest"
import { MULTI_TURN_BODY } from "../expectations"
import { expectedStream, promptPath, runE2E, sanitize } from "../helpers"

const dir = new URL(".", import.meta.url).pathname

describe("codex multi-turn e2e", () => {
	it("runs codex and parses bash + edit in one turn", () => {
		const output = runE2E(promptPath(dir), dir)
		expect(sanitize(output)).toBe(expectedStream(MULTI_TURN_BODY))
	}, 120_000)
})
