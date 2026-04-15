import { describe, expect, it } from "vitest"
import { fixtureExists, replayFixture, sanitize, streamPath } from "../helpers"

const dir = new URL(".", import.meta.url).pathname
const fixture = streamPath(dir)

describe("notebook-edit - stream mode", () => {
	it.skipIf(!fixtureExists(fixture))("parses NotebookEdit tool from stream", () => {
		const output = sanitize(replayFixture(fixture))
		expect(output).toContain("[notebook-edit] <ABS_PATH>")
		expect(output).toContain('Inserted cell <HEX> with print("test")')
		expect(output).toContain("[done]")
	})
})
