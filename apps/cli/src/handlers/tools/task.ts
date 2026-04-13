import type { ParseResult, ParserState } from "../base.js"

export function handleTask(inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const prompt = ((inp.prompt as string) ?? (inp.description as string) ?? "").slice(0, 50)
	const model = (inp.model as string) ?? "sonnet"
	const label = `[Task] "${prompt}" (${model})`
	result.add(`\n${state.sp}${r.blue(label)}\n`)
	if (state.mode === "stream") {
		state.incrementDepth()
		result.add(`${state.sp}${r.sectionOpen()}\n`)
	}
}
