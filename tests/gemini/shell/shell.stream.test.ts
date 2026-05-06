import { describe, expect, it } from 'vitest'
import { fixtureExists, replayFixture, sanitize, streamPath } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const fixture = streamPath(dir)

describe('gemini shell - stream mode', () => {
	it.skipIf(!fixtureExists(fixture))('renders run_shell_command from stream tool_use', () => {
		const output = sanitize(replayFixture(fixture))
		expect(output).toContain('[Shell] echo hello-from-gemini && date')
	})
})
