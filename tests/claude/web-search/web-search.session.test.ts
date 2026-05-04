import { describe, expect, it } from 'vitest'
import { Tool } from '../../../src/providers/claude/constants'
import { fixtureExists, replayFixture, sanitize, sessionPath } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const fixture = sessionPath(dir)

describe('web-search - session mode', () => {
	it.skipIf(!fixtureExists(fixture))('parses WebSearch tool', () => {
		const output = sanitize(replayFixture(fixture))
		expect(output).toContain(`[${Tool.WebSearch}] "vitest testing framework"`)
	})
})
