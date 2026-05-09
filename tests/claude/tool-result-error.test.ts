import { describe, expect, it } from 'vitest'
import { ParseResult } from '../../src/lib/result'
import { handleUserMessage } from '../../src/providers/claude/handlers/user'
import { ParserState } from '../../src/providers/claude/state'
import { stripAnsi } from './helpers'

function renderToolResult(content: string) {
	const state = new ParserState()
	const result = new ParseResult()
	handleUserMessage(
		{
			message: {
				content: [{ type: 'tool_result', content }],
			},
		},
		state,
		result,
	)
	return stripAnsi(result.getOutput())
}

describe('Claude tool result errors', () => {
	it('does not treat source code containing tool_use_error as a tool error', () => {
		const output = renderToolResult(
			[
				"1\tif (toolContent.includes('<tool_use_error>')) {",
				'2\t\tconst value: Record<string, unknown> = {}',
				'3\t}',
			].join('\n'),
		)

		expect(output).toBe('')
		expect(output).not.toContain('✗')
	})

	it('renders wrapped tool_use_error payloads as errors', () => {
		const output = renderToolResult('<tool_use_error>File not found</tool_use_error>')

		expect(output).toContain('✗ File not found')
	})
})
