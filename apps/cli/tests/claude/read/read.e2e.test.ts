import { describe, expect, it } from "vitest"
import { Tool } from "../../../src/constants"
import { promptPath, runE2E, sanitize } from "../helpers"

const dir = new URL(".", import.meta.url).pathname

describe("read e2e", () => {
	it("runs claude and parses Read tool", () => {
		const output = sanitize(runE2E(promptPath(dir), dir))
		expect(output).toContain(`[${Tool.Read}] <ABS_PATH>\n   → <N>\tread tool works`)
		expect(output).toContain("[done]")
	}, 120_000)
})
