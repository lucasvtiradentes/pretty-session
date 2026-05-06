import { describe, expect, it } from 'vitest'
import { PLAN_MIXED_STREAM_LINES } from '../expectations'
import { promptPath, runE2E, stripAnsi } from '../helpers'

const dir = new URL('.', import.meta.url).pathname

describe('codex plan-mixed e2e', () => {
	it('runs codex and renders the plan checklist with mixed statuses', () => {
		const output = stripAnsi(runE2E(promptPath(dir), dir))
		for (const line of PLAN_MIXED_STREAM_LINES) expect(output).toContain(line)
	}, 120_000)
})
