import type { Renderer } from "./renderer"
import type { ParseResult } from "./result"

export function appendRenderedMarkdown(text: string, renderer: Renderer, result: ParseResult): void {
	const trimmed = text.replace(/^\n+|\n+$/g, "")
	if (!trimmed) return
	const rendered = renderer.renderMarkdown(trimmed).replace(/\n+$/, "")
	if (rendered) result.add(`\n${rendered}\n`)
}
