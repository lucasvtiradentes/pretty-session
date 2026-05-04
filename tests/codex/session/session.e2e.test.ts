import { describe, expect, it } from 'vitest'
import { expectedStream, promptPath, runE2E, sanitize } from '../helpers'

const dir = new URL('.', import.meta.url).pathname

describe('codex session e2e', () => {
	it('runs codex and parses session init', () => {
		const output = runE2E(promptPath(dir), dir)
		expect(sanitize(output)).toBe(expectedStream(''))
	}, 120_000)
})
