import { describe, expect, it } from 'vitest'
import { promptPath, runE2E, sanitize } from '../helpers'

const dir = new URL('.', import.meta.url).pathname

describe('gemini search - e2e', () => {
	it('runs gemini and renders grep_search tool', () => {
		const output = sanitize(runE2E(promptPath(dir), dir))
		expect(output).toContain('[Search] version')
	}, 240_000)
})
