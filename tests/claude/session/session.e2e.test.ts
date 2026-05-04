import { describe, expect, it } from "vitest"

import { expected, promptPath, runE2E, sanitize } from "../helpers"

const dir = new URL(".", import.meta.url).pathname

describe("session e2e", () => {
	it("runs claude and parses session init", () => {
		const output = runE2E(promptPath(dir), dir)
		expect(sanitize(output)).toBe(expected(""))
	}, 120_000)
})
