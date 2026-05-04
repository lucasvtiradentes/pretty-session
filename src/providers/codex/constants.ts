export const CODEX_DEFAULT_MODEL = "codex"

export enum CodexMessageType {
	SessionMeta = "session_meta",
	TurnContext = "turn_context",
	EventMsg = "event_msg",
	ResponseItem = "response_item",
	ThreadStarted = "thread.started",
	TurnStarted = "turn.started",
	TurnCompleted = "turn.completed",
	ItemStarted = "item.started",
	ItemCompleted = "item.completed",
}

export const STREAM_MESSAGE_TYPES = new Set<string>([
	CodexMessageType.ThreadStarted,
	CodexMessageType.TurnStarted,
	CodexMessageType.TurnCompleted,
	CodexMessageType.ItemStarted,
	CodexMessageType.ItemCompleted,
])

export enum CodexEventType {
	UserMessage = "user_message",
	TokenCount = "token_count",
}

export enum CodexItemType {
	Message = "message",
	FunctionCall = "function_call",
	CustomToolCall = "custom_tool_call",
	FunctionCallOutput = "function_call_output",
	AgentMessage = "agent_message",
	CommandExecution = "command_execution",
	PatchApplication = "patch_application",
	FileChange = "file_change",
}

export enum CodexFunctionTool {
	ExecCommand = "exec_command",
	WriteStdin = "write_stdin",
}

export enum CodexCustomTool {
	ApplyPatch = "apply_patch",
}

export enum CodexRole {
	Assistant = "assistant",
}

export enum CodexBlockType {
	OutputText = "output_text",
}

export enum CodexAppServerMethod {
	Delta = "item/agentMessage/delta",
	TokenUsage = "thread/tokenUsage/updated",
	TurnCompleted = "turn/completed",
}
