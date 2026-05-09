import { describe, expect, it } from 'vitest'
import { promptPath, runE2E, sanitize } from '../helpers'

const dir = new URL('.', import.meta.url).pathname

describe('codex bash e2e', () => {
	it('runs codex and parses Bash tool', () => {
		const output = runE2E(promptPath(dir), dir)
		const sanitized = sanitize(output)
		expect(sanitized).toContain('[Bash] echo "hello from codex test" && date')
		expect(sanitized).toContain('→ <DATE>')
	}, 120_000)
})
