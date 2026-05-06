import { describe, expect, it } from 'vitest'
import { fixtureExists, replayFixture, sanitize, sessionPath } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const fixture = sessionPath(dir)

describe('gemini shell - session mode', () => {
	it.skipIf(!fixtureExists(fixture))('renders run_shell_command from saved session', () => {
		const output = sanitize(replayFixture(fixture))
		expect(output).toContain('[Shell] echo hello-from-gemini && date')
	})
})
