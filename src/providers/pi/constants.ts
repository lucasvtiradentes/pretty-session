export enum PiEntryType {
	Session = 'session',
	Message = 'message',
	ModelChange = 'model_change',
	ThinkingLevelChange = 'thinking_level_change',
	Compaction = 'compaction',
	BranchSummary = 'branch_summary',
	CustomMessage = 'custom_message',
}

export enum PiMessageRole {
	User = 'user',
	Assistant = 'assistant',
	ToolResult = 'toolResult',
	BashExecution = 'bashExecution',
	Custom = 'custom',
	BranchSummary = 'branchSummary',
	CompactionSummary = 'compactionSummary',
}

export enum PiBlockType {
	Text = 'text',
	ToolCall = 'toolCall',
}
