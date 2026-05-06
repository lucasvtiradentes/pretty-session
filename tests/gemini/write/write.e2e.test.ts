import { describe, expect, it } from 'vitest'
import { promptPath, runE2E, sanitize } from '../helpers'

const dir = new URL('.', import.meta.url).pathname

describe('gemini write - e2e', () => {
	it('runs gemini and renders write_file tool', () => {
		const output = sanitize(runE2E(promptPath(dir), dir))
		expect(output).toContain('[Write] new.txt')
	}, 240_000)
})
