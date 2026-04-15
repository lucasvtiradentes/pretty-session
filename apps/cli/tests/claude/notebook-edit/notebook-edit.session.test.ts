import { describe, expect, it } from "vitest"
import { Tool } from "../../../src/constants"
import { fixtureExists, replayFixture, sanitize, sessionPath } from "../helpers"

const dir = new URL(".", import.meta.url).pathname
const fixture = sessionPath(dir)

describe("notebook-edit - session mode", () => {
	it.skipIf(!fixtureExists(fixture))("parses NotebookEdit tool", () => {
		const output = sanitize(replayFixture(fixture))
		expect(output).toContain(`[${Tool.NotebookEdit}] <ABS_PATH>`)
		expect(output).toContain('Inserted cell <HEX> with print("test")')
		expect(output).toContain("[done]")
	})
})
