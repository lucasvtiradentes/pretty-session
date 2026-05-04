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
