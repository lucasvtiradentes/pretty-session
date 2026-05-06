import { parseJsonRecord } from '../../../../lib/json'
import type { ParseResult } from '../../../../lib/result'
import type { CodexState } from '../../state'
import { renderBashStart } from '../render'

export function handleBash(payload: Record<string, unknown>, state: CodexState, result: ParseResult) {
	const args = parseJsonRecord((payload.arguments as string) ?? '{}')
	if (!args) return
	renderBashStart((args.cmd as string) ?? '', state, result)
}
