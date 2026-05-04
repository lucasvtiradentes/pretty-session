import { describe, expect, it } from 'vitest'
import { Tool } from '../../../src/providers/claude/constants'
import { promptPath, runE2E, sanitize } from '../helpers'

const dir = new URL('.', import.meta.url).pathname

describe('edit e2e', () => {
	it('runs claude and parses Edit tool', () => {
		const output = sanitize(runE2E(promptPath(dir), dir))
		expect(output).toContain(`[${Tool.Write}] <ABS_PATH>\n   → File created successfully at: <ABS_PATH>`)
		expect(output).toContain(`[${Tool.Edit}] <ABS_PATH>`)
		expect(output).toContain('[done]')
	}, 120_000)
})
