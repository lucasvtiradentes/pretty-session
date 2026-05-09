import { describe, expect, it } from 'vitest'
import { formatToolOutput } from '../src/lib/format'
import { AnsiRenderer } from '../src/lib/renderer'
import { ParseResult } from '../src/lib/result'

const ansiPattern = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, 'g')
const stripAnsi = (value: string) => value.replace(ansiPattern, '')

describe('tool previews', () => {
	it('does not render single-line tool output when previews are disabled', () => {
		const result = new ParseResult()

		formatToolOutput('single line output', new AnsiRenderer(), result)

		expect(stripAnsi(result.getOutput())).toBe('')
	})

	it('does not render multiline tool output when previews are disabled', () => {
		const result = new ParseResult()

		formatToolOutput('line 1\nline 2', new AnsiRenderer(), result)

		expect(stripAnsi(result.getOutput())).toBe('')
	})
})
