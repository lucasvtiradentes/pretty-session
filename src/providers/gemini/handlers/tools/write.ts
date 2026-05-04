import { INDENT } from '../../../../constants'
import type { ParseResult } from '../../../../lib/result'
import { GeminiToolLabel } from '../../constants'
import type { GeminiState } from '../../state'

export function handleWriteFile(toolCall: Record<string, unknown>, state: GeminiState, result: ParseResult) {
	const r = state.renderer
	const args = (toolCall.args as Record<string, unknown>) ?? {}
	const filePath = (args.file_path as string) ?? ''
	result.add(`\n${r.orange(`[${GeminiToolLabel.WriteFile}] ${filePath}`)}\n`)

	const display = (toolCall.resultDisplay as Record<string, unknown>) ?? {}
	const stat = (display.diffStat as Record<string, number>) ?? {}
	const added = stat.model_added_lines ?? 0
	const removed = stat.model_removed_lines ?? 0
	if (added || removed) {
		result.add(`${INDENT}${r.dim(`→ +${added} -${removed} lines`)}\n`)
	}
}
