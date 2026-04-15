import { describe, expect, it } from "vitest"
import { promptPath, runE2E, sanitize } from "../helpers"

const dir = new URL(".", import.meta.url).pathname

describe("skill e2e", () => {
	it("runs claude and parses Skill tool", () => {
		const output = sanitize(runE2E(promptPath(dir), dir))
		expect(output).toContain("[skill] simple-skill\n   → Launching skill: simple-skill")
		expect(output).toContain("[done]")
	}, 120_000)
})
