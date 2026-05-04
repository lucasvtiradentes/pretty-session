import { describe, expect, it } from 'vitest'
import { Tool } from '../../../src/providers/claude/constants'
import { promptPath, runE2E, sanitize } from '../helpers'

const dir = new URL('.', import.meta.url).pathname

describe('notebook-edit e2e', () => {
	it('runs claude and parses NotebookEdit tool', () => {
		const output = sanitize(runE2E(promptPath(dir), dir))
		expect(output).toContain(`[${Tool.NotebookEdit}] <ABS_PATH>`)
		expect(output).toContain('Inserted cell <HEX> with print("test")')
		expect(output).toContain('[done]')
	}, 120_000)
})
