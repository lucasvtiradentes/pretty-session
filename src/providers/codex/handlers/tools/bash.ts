import { parseJsonRecord } from '../../../../lib/json'
import type { ParseResult } from '../../../../lib/result'
import { CodexToolLabel } from '../../constants'
import type { CodexState } from '../../state'

export function handleBash(payload: Record<string, unknown>, state: CodexState, result: ParseResult) {
	const args = parseJsonRecord((payload.arguments as string) ?? '{}')
	if (!args) return

	const cmd = (args.cmd as string) ?? ''
	result.add(`\n${state.renderer.purple(`[${CodexToolLabel.Bash}] ${cmd}`)}\n`)
}
