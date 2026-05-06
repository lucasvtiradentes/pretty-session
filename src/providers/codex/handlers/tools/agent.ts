import { parseJsonRecord } from '../../../../lib/json'
import type { ParseResult } from '../../../../lib/result'
import type { CodexState } from '../../state'
import { renderAgent } from '../render'

export function handleSpawnAgent(payload: Record<string, unknown>, state: CodexState, result: ParseResult) {
	const args = parseJsonRecord((payload.arguments as string) ?? '{}')
	if (!args) return
	const agentType = (args.agent_type as string) ?? ''
	const message = (args.message as string) ?? ''
	renderAgent(agentType, message, state, result)
}
