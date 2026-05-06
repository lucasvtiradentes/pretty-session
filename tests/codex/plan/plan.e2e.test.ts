import { describe, expect, it } from 'vitest'
import { PLAN_BODY_LINES } from '../expectations'
import { promptPath, runE2E, stripAnsi } from '../helpers'

const dir = new URL('.', import.meta.url).pathname

describe('codex plan e2e', () => {
	it('runs codex and renders update_plan as a checklist', () => {
		const output = stripAnsi(runE2E(promptPath(dir), dir))
		for (const line of PLAN_BODY_LINES) expect(output).toContain(line)
	}, 120_000)
})
