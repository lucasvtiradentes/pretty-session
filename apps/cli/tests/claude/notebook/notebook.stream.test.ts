import { describe, expect, it } from "vitest"
import { NOTEBOOK_BODY } from "../expectations"
import { expected, fixtureExists, replayFixture, sanitize, streamPath } from "../helpers"

const dir = new URL(".", import.meta.url).pathname
const fixture = streamPath(dir)

describe("notebook - stream mode", () => {
	it.skipIf(!fixtureExists(fixture))("parses NotebookEdit tool from stream", () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(NOTEBOOK_BODY))
	})
})
