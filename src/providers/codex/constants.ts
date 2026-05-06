export const CODEX_DEFAULT_MODEL = 'codex'

export enum CodexMessageType {
	SessionMeta = 'session_meta',
	TurnContext = 'turn_context',
	EventMsg = 'event_msg',
	ResponseItem = 'response_item',
	ThreadStarted = 'thread.started',
	TurnStarted = 'turn.started',
	TurnCompleted = 'turn.completed',
	ItemStarted = 'item.started',
	ItemCompleted = 'item.completed',
}

export const STREAM_MESSAGE_TYPES = new Set<string>([
	CodexMessageType.ThreadStarted,
	CodexMessageType.TurnStarted,
	CodexMessageType.TurnCompleted,
	CodexMessageType.ItemStarted,
	CodexMessageType.ItemCompleted,
])

export enum CodexEventType {
	UserMessage = 'user_message',
	TokenCount = 'token_count',
}

export enum CodexItemType {
	Message = 'message',
	FunctionCall = 'function_call',
	CustomToolCall = 'custom_tool_call',
	FunctionCallOutput = 'function_call_output',
	AgentMessage = 'agent_message',
	CommandExecution = 'command_execution',
	PatchApplication = 'patch_application',
	FileChange = 'file_change',
	TodoList = 'todo_list',
}

export enum CodexFunctionTool {
	ExecCommand = 'exec_command',
	WriteStdin = 'write_stdin',
	UpdatePlan = 'update_plan',
}

export enum CodexCustomTool {
	ApplyPatch = 'apply_patch',
}

export enum CodexToolLabel {
	Bash = 'Bash',
	Edit = 'Edit',
	Stdin = 'Stdin',
	Plan = 'Plan',
}

export enum CodexRole {
	Assistant = 'assistant',
}

export enum CodexBlockType {
	OutputText = 'output_text',
}

export enum CodexAppServerMethod {
	Delta = 'item/agentMessage/delta',
	TokenUsage = 'thread/tokenUsage/updated',
	TurnCompleted = 'turn/completed',
	ItemStarted = 'item/started',
	ItemCompleted = 'item/completed',
}

export const ITEM_TYPE_ALIASES: Record<string, CodexItemType> = {
	[CodexItemType.CommandExecution]: CodexItemType.CommandExecution,
	[CodexItemType.AgentMessage]: CodexItemType.AgentMessage,
	[CodexItemType.PatchApplication]: CodexItemType.PatchApplication,
	[CodexItemType.FileChange]: CodexItemType.FileChange,
	[CodexItemType.TodoList]: CodexItemType.TodoList,
	commandExecution: CodexItemType.CommandExecution,
	agentMessage: CodexItemType.AgentMessage,
	patchApplication: CodexItemType.PatchApplication,
	fileChange: CodexItemType.FileChange,
	todoList: CodexItemType.TodoList,
}

export type PlanStatus = 'completed' | 'in_progress' | 'pending'

export type PlanItem = { text: string; status: PlanStatus }

export const PLAN_MARKERS: Record<PlanStatus, string> = {
	completed: '[x]',
	in_progress: '[~]',
	pending: '[ ]',
}
