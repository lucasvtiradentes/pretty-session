import {
	ParseResult,
	type ParserState,
	handleAssistantMessage,
	handleResult,
	handleStreamEvent,
	handleSystem,
	handleUserMessage,
} from "./handlers/index.js"

export function parseJsonLine(line: string, state: ParserState): ParseResult {
	const result = new ParseResult()

	let data: Record<string, unknown>
	try {
		data = JSON.parse(line)
	} catch {
		return result
	}

	const msgType = (data.type as string) ?? ""

	if (msgType === "system") handleSystem(data, state, result)
	else if (msgType === "stream_event") handleStreamEvent(data, state, result)
	else if (msgType === "user") handleUserMessage(data, state, result)
	else if (msgType === "assistant") handleAssistantMessage(data, state, result)
	else if (msgType === "result") handleResult(data, state, result)
	else if (msgType === "error") {
		const errorMsg = (data.error as string) ?? "unknown error"
		result.add(`\n${state.sp}${state.renderer.red(`[error] ${errorMsg}`)}`)
	}

	return result
}
