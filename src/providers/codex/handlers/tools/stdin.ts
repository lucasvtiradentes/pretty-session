import { parseJsonRecord } from '../../../../lib/json'
import type { ParseResult } from '../../../../lib/result'
import { CodexToolLabel } from '../../constants'
import type { CodexState } from '../../state'

export function handleStdin(payload: Record<string, unknown>, state: CodexState, result: ParseResult) {
	const args = parseJsonRecord((payload.arguments as string) ?? '{}')
	if (!args) return

	const sessionId = String(args.session_id ?? '')
	result.add(`\n${state.renderer.purple(`[${CodexToolLabel.Stdin}] session=${sessionId}`)}\n`)
}
