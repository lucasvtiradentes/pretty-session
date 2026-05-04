export enum Tool {
	Write = 'Write',
	TodoWrite = 'TodoWrite',
	Read = 'Read',
	Glob = 'Glob',
	Grep = 'Grep',
	Bash = 'Bash',
	TaskGet = 'TaskGet',
	TaskList = 'TaskList',
	TaskCreate = 'TaskCreate',
	TaskUpdate = 'TaskUpdate',
	TaskOutput = 'TaskOutput',
	TaskStop = 'TaskStop',
	Edit = 'Edit',
	MultiEdit = 'MultiEdit',
	NotebookEdit = 'NotebookEdit',
	WebFetch = 'WebFetch',
	WebSearch = 'WebSearch',
	ToolSearch = 'ToolSearch',
	Skill = 'Skill',
	Agent = 'Agent',
}

export const HIDE_TOOLS: Set<string> = new Set(Object.values(Tool))

export enum ParserMode {
	Stream = 'stream',
	Replay = 'replay',
}

export enum ClaudeMessageType {
	System = 'system',
	StreamEvent = 'stream_event',
	User = 'user',
	Assistant = 'assistant',
	Result = 'result',
	LastPrompt = 'last-prompt',
	Error = 'error',
}

export enum StreamEventType {
	ContentBlockStart = 'content_block_start',
	ContentBlockDelta = 'content_block_delta',
	ContentBlockStop = 'content_block_stop',
	Error = 'error',
}

export enum BlockType {
	Text = 'text',
	ToolUse = 'tool_use',
}

export enum DeltaType {
	TextDelta = 'text_delta',
	InputJsonDelta = 'input_json_delta',
}

export enum ContentType {
	ToolResult = 'tool_result',
}

export enum SystemSubtype {
	Init = 'init',
}

export enum TodoStatus {
	Completed = 'completed',
	InProgress = 'in_progress',
	Pending = 'pending',
}
