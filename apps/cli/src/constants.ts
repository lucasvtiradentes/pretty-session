export const CLI_NAME = "pretty-sessions"
export const INDENT = "   "
export const HIDE_TOOLS = new Set([
	"Write",
	"TodoWrite",
	"Read",
	"Glob",
	"Grep",
	"Bash",
	"TaskCreate",
	"TaskUpdate",
	"Edit",
	"MultiEdit",
	"NotebookEdit",
	"WebFetch",
	"WebSearch",
	"Agent",
])

export const TOOL_RESULT_MAX_CHARS = Number(process.env.PS_TOOL_RESULT_MAX_CHARS ?? "300")
export const READ_PREVIEW_LINES = Number(process.env.PS_READ_PREVIEW_LINES ?? "5")
