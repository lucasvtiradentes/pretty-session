import { describe, expect, it } from 'vitest'
import { BASH_BODY } from '../expectations'
import { expectedStream, fixtureExists, replayFixture, sanitize, streamPath } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const fixture = streamPath(dir)

describe('codex app-server bash - stream mode', () => {
	it.skipIf(!fixtureExists(fixture))('parses Bash tool from app-server live stream', () => {
		expect(sanitize(replayFixture(fixture))).toBe(expectedStream(BASH_BODY))
	})
})
