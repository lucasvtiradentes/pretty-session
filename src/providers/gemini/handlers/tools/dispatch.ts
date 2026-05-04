import type { ParseResult } from '../../../../lib/result'
import { GeminiTool } from '../../constants'
import type { GeminiState } from '../../state'
import { handleDefaultTool } from './default'
import { handleReadFile } from './read'
import { handleGrepSearch } from './search'
import { handleUpdateTopic } from './topic'
import { handleWriteFile } from './write'

type ToolHandler = (toolCall: Record<string, unknown>, state: GeminiState, result: ParseResult) => void

const handlers: Record<string, ToolHandler> = {
	[GeminiTool.GrepSearch]: handleGrepSearch,
	[GeminiTool.ReadFile]: handleReadFile,
	[GeminiTool.UpdateTopic]: handleUpdateTopic,
	[GeminiTool.WriteFile]: handleWriteFile,
}

export function dispatchTool(toolCall: Record<string, unknown>, state: GeminiState, result: ParseResult) {
	const name = (toolCall.name as string) ?? ''
	const handler = handlers[name] ?? handleDefaultTool
	handler(toolCall, state, result)
}
