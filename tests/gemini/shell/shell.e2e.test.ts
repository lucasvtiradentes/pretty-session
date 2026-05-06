import { describe, expect, it } from 'vitest'
import { promptPath, runE2E, sanitize } from '../helpers'

const dir = new URL('.', import.meta.url).pathname

describe('gemini shell - e2e', () => {
	it('runs gemini and renders run_shell_command tool', () => {
		const output = sanitize(runE2E(promptPath(dir), dir))
		expect(output).toContain('[Shell] echo hello-from-gemini && date')
	}, 240_000)
})
