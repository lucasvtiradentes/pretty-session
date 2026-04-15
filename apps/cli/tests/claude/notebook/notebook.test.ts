import { describe, expect, it } from "vitest"
import { NOTEBOOK_BODY } from "../expectations"
import { expected, fixtureExists, fixturePath, replayFixture, sanitize } from "../helpers"

const dir = new URL(".", import.meta.url).pathname
const fixture = fixturePath(dir)

describe("notebook", () => {
	it.skipIf(!fixtureExists(fixture))("parses NotebookEdit tool", () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(NOTEBOOK_BODY))
	})
})
