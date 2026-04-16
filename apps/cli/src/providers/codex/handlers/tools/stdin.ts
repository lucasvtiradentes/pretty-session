import type { ParseResult } from "../../../../result"
import type { CodexState } from "../../state"

export function handleStdin(payload: Record<string, unknown>, state: CodexState, result: ParseResult) {
	const r = state.renderer
	let sessionId = ""
	try {
		const args = JSON.parse((payload.arguments as string) ?? "{}")
		sessionId = String(args.session_id ?? "")
	} catch {
		return
	}

	result.add(`\n${r.purple(`[Stdin] session=${sessionId}`)}\n`)
}
