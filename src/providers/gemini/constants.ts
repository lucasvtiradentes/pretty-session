export const GEMINI_DEFAULT_MODEL = 'gemini'

export enum GeminiMessageType {
	Gemini = 'gemini',
	Init = 'init',
	Message = 'message',
	Result = 'result',
	ToolUse = 'tool_use',
	ToolResult = 'tool_result',
}

export enum GeminiUpdateType {
	AgentMessageChunk = 'agent_message_chunk',
	UsageUpdate = 'usage_update',
	ToolCall = 'tool_call',
	ToolCallUpdate = 'tool_call_update',
}

export enum GeminiToolKind {
	Execute = 'execute',
	Read = 'read',
	Edit = 'edit',
	Search = 'search',
	Think = 'think',
	Delete = 'delete',
	Move = 'move',
	Other = 'other',
}

export enum GeminiRole {
	Assistant = 'assistant',
}

export const GEMINI_SESSION_UPDATE_METHOD = 'session/update'
export const GEMINI_SAVED_KIND_MAIN = 'main'

export enum GeminiTool {
	GrepSearch = 'grep_search',
	ReadFile = 'read_file',
	UpdateTopic = 'update_topic',
	WriteFile = 'write_file',
	RunShellCommand = 'run_shell_command',
}

export enum GeminiToolLabel {
	GrepSearch = 'Search',
	ReadFile = 'Read',
	UpdateTopic = 'Topic',
	WriteFile = 'Write',
	Shell = 'Shell',
	Edit = 'Edit',
	Delete = 'Delete',
	Move = 'Move',
	Tool = 'Tool',
}
