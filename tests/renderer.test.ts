import { describe, expect, it } from 'vitest'
import { AnsiRenderer } from '../src/lib/renderer'

describe('AnsiRenderer', () => {
	it('renders inline code as bold without inverse background', () => {
		const renderer = new AnsiRenderer()
		const output = renderer.renderMarkdown('Use `value` and **strong** text')

		expect(output).toContain('\x1b[1mvalue\x1b[0m')
		expect(output).toContain('\x1b[1mstrong\x1b[0m')
		expect(output).not.toContain('\x1b[7m')
	})

	it('uses bold-only style for streamed code spans', () => {
		const renderer = new AnsiRenderer()

		expect(renderer.styleCode()).toBe('\x1b[1m')
		expect(renderer.styleBoldCode()).toBe('\x1b[1m')
	})
})
