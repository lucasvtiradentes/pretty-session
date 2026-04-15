export const CLI_NAME = "pretty-sessions"
export const INDENT = "   "

export enum Tool {
	Write = "Write",
	TodoWrite = "TodoWrite",
	Read = "Read",
	Glob = "Glob",
	Grep = "Grep",
	Bash = "Bash",
	TaskGet = "TaskGet",
	TaskList = "TaskList",
	TaskCreate = "TaskCreate",
	TaskUpdate = "TaskUpdate",
	TaskOutput = "TaskOutput",
	TaskStop = "TaskStop",
	Edit = "Edit",
	MultiEdit = "MultiEdit",
	NotebookEdit = "NotebookEdit",
	WebFetch = "WebFetch",
	WebSearch = "WebSearch",
	ToolSearch = "ToolSearch",
	Skill = "Skill",
	Agent = "Agent",
}

export const HIDE_TOOLS = new Set(Object.values(Tool))

export const TOOL_RESULT_MAX_CHARS = Number(process.env.PS_TOOL_RESULT_MAX_CHARS ?? 300)
export const READ_PREVIEW_LINES = Number(process.env.PS_READ_PREVIEW_LINES ?? 5)
