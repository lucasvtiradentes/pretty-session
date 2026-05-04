import { describe, expect, it } from 'vitest'
import { Tool } from '../../../src/providers/claude/constants'
import { promptPath, runE2E, sanitize } from '../helpers'

const dir = new URL('.', import.meta.url).pathname

describe('tool-search e2e', () => {
	it('runs claude and parses ToolSearch tool', () => {
		const output = sanitize(runE2E(promptPath(dir), dir))
		expect(output).toContain(`[${Tool.ToolSearch}] "select:WebFetch"`)
	}, 120_000)
})
