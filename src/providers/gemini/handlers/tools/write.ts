import type { ParseResult } from '../../../../lib/result'
import { GeminiToolLabel } from '../../constants'
import type { GeminiState } from '../../state'
import { renderToolHeader, renderToolPreview } from '../render'

export function handleWriteFile(toolCall: Record<string, unknown>, state: GeminiState, result: ParseResult) {
	const args = (toolCall.args as Record<string, unknown>) ?? {}
	renderToolHeader(GeminiToolLabel.WriteFile, (args.file_path as string) ?? '', 'orange', state, result)

	const display = (toolCall.resultDisplay as Record<string, unknown>) ?? {}
	const stat = (display.diffStat as Record<string, number>) ?? {}
	const added = stat.model_added_lines ?? 0
	const removed = stat.model_removed_lines ?? 0
	if (added || removed) renderToolPreview(`+${added} -${removed} lines`, state, result)
}
