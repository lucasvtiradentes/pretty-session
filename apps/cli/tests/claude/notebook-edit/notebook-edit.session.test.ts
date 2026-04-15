import { describe, expect, it } from "vitest"
import { NOTEBOOK_EDIT_BODY } from "../expectations"
import { expected, fixtureExists, replayFixture, sanitize, sessionPath } from "../helpers"

const dir = new URL(".", import.meta.url).pathname
const fixture = sessionPath(dir)

describe("notebook-edit - session mode", () => {
	it.skipIf(!fixtureExists(fixture))("parses NotebookEdit tool", () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(NOTEBOOK_EDIT_BODY))
	})
})
