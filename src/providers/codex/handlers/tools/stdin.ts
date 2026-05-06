import { parseJsonRecord } from '../../../../lib/json'
import type { ParseResult } from '../../../../lib/result'
import type { CodexState } from '../../state'
import { renderStdin } from '../render'

export function handleStdin(payload: Record<string, unknown>, state: CodexState, result: ParseResult) {
	const args = parseJsonRecord((payload.arguments as string) ?? '{}')
	if (!args) return
	renderStdin(String(args.session_id ?? ''), state, result)
}
