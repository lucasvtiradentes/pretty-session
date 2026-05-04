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

export const HIDE_TOOLS: Set<string> = new Set(Object.values(Tool))
