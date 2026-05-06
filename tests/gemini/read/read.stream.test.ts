import { describe, expect, it } from 'vitest'
import { fixtureExists, replayFixture, sanitize, streamPath } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const fixture = streamPath(dir)

describe('gemini read - stream mode', () => {
	it.skipIf(!fixtureExists(fixture))('renders read_file from stream tool_use', () => {
		const output = sanitize(replayFixture(fixture))
		expect(output).toContain('[Read] README.md')
	})
})
