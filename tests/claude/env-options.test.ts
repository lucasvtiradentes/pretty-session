import { execSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { stripAnsi } from './helpers'

const CLI_ROOT = resolve(dirname(new URL(import.meta.url).pathname), '../..')
const CLI_PATH = resolve(CLI_ROOT, 'src/bin.ts')

function parseClaude(input: string, env: Record<string, string>) {
	return stripAnsi(
		execSync(`npx tsx ${CLI_PATH} parse claude`, {
			cwd: CLI_ROOT,
			encoding: 'utf-8',
			env: { ...process.env, ...env },
			input,
		}),
	)
}

function assistantTool(name: string, input: Record<string, unknown>) {
	return `${JSON.stringify({
		type: 'assistant',
		message: {
			role: 'assistant',
			content: [{ type: 'tool_use', id: 'toolu_1', name, input }],
		},
	})}\n`
}

describe('Claude env options', () => {
	it('shows full subagent descriptions by default', () => {
		const description = 'a very long subagent description that should not be truncated by default'
		const output = parseClaude(
			assistantTool('Agent', {
				description,
				prompt: 'do work',
				subagent_type: 'worker',
			}),
			{},
		)

		expect(output).toContain(`[Agent] "${description}" (worker)`)
	})

	it('hides subagent prompts when disabled', () => {
		const output = parseClaude(
			assistantTool('Agent', {
				description: 'visible description',
				prompt: 'hidden prompt',
				subagent_type: 'worker',
			}),
			{ PTS_SHOW_SUBAGENT_PROMPT: 'false' },
		)

		expect(output).toContain('[Agent] "visible description" (worker)')
		expect(output).not.toContain('hidden prompt')
	})

	it('uses default task subject truncation', () => {
		const output = parseClaude(
			assistantTool('TaskCreate', {
				subject: 'x'.repeat(61),
			}),
			{},
		)

		expect(output).toContain(`[TaskCreate] "${'x'.repeat(60)}"`)
		expect(output).not.toContain(`[TaskCreate] "${'x'.repeat(61)}"`)
	})
})
