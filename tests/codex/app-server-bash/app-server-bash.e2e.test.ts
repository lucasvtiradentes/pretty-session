import { describe, expect, it } from 'vitest'
import { BASH_BODY } from '../expectations'
import { expectedStream, promptPath, runE2EAppServer, sanitize } from '../helpers'

const dir = new URL('.', import.meta.url).pathname

describe('codex app-server bash e2e', () => {
	it('runs omsd ask and parses Bash tool through the app-server live stream', () => {
		const output = runE2EAppServer(promptPath(dir), dir)
		expect(sanitize(output)).toBe(expectedStream(BASH_BODY))
	}, 120_000)
})
