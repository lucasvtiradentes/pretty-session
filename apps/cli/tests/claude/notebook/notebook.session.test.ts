import { describe, expect, it } from "vitest"
import { NOTEBOOK_BODY } from "../expectations"
import { expected, fixtureExists, replayFixture, sanitize, sessionPath } from "../helpers"

const dir = new URL(".", import.meta.url).pathname
const fixture = sessionPath(dir)

describe("notebook - session mode", () => {
	it.skipIf(!fixtureExists(fixture))("parses NotebookEdit tool", () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(NOTEBOOK_BODY))
	})
})
