import { describe, expect, it } from "vitest"
import { Tool } from "../../../src/providers/claude/constants"
import { fixtureExists, replayFixture, sanitize, streamPath } from "../helpers"

const dir = new URL(".", import.meta.url).pathname
const fixture = streamPath(dir)

describe("skill - stream mode", () => {
	it.skipIf(!fixtureExists(fixture))("parses Skill tool from stream", () => {
		const output = sanitize(replayFixture(fixture))
		expect(output).toContain(`[${Tool.Skill}] simple-skill`)
	})
})
