export const GEMINI_DEFAULT_MODEL = 'gemini'

export enum GeminiMessageType {
	Gemini = 'gemini',
	Init = 'init',
	Message = 'message',
	Result = 'result',
}

export enum GeminiUpdateType {
	AgentMessageChunk = 'agent_message_chunk',
	UsageUpdate = 'usage_update',
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
}

export enum GeminiToolLabel {
	GrepSearch = 'Search',
	ReadFile = 'Read',
	UpdateTopic = 'Topic',
	WriteFile = 'Write',
}
