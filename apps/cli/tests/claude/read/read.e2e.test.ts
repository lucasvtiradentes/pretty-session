import { describe, expect, it } from "vitest"
import { READ_BODY } from "../expectations"
import { expected, fixturePath, promptPath, runE2E, sanitize } from "../helpers"

const dir = new URL(".", import.meta.url).pathname

describe("read e2e", () => {
	it("runs claude and parses Read tool", () => {
		const output = runE2E(promptPath(dir), fixturePath(dir))
		expect(sanitize(output)).toBe(expected(READ_BODY))
	}, 120_000)
})
