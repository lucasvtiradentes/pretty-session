import { parseJsonRecord } from '../../../../lib/json'
import type { ParseResult } from '../../../../lib/result'
import type { PlanItem, PlanStatus } from '../../constants'
import type { CodexState } from '../../state'
import { renderPlan } from '../render'

export function handleUpdatePlan(payload: Record<string, unknown>, state: CodexState, result: ParseResult) {
	const args = parseJsonRecord((payload.arguments as string) ?? '{}')
	if (!args) return
	const rawItems = (args.plan as Array<Record<string, unknown>>) ?? []
	const items: PlanItem[] = rawItems.map((it) => ({
		text: (it.step as string) ?? '',
		status: ((it.status as string) ?? 'pending') as PlanStatus,
	}))
	renderPlan(items, state, result)
}
