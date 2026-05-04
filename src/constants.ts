export enum Provider {
	Claude = "claude",
	Codex = "codex",
	Gemini = "gemini",
}

export const PROVIDER_VALUES = Object.values(Provider) as string[]

export const VERSION = "0.0.0"
export const CLI_NAME = process.env.PRETTY_SESSION_PROG_NAME ?? "pretty-session"
export const INDENT = "   "

export const TOOL_RESULT_MAX_CHARS = Number(process.env.PS_TOOL_RESULT_MAX_CHARS ?? 300)
export const READ_PREVIEW_LINES = Number(process.env.PS_READ_PREVIEW_LINES ?? 5)
export const USER_MESSAGE_MAX_CHARS = 200
export const AGENT_DESCRIPTION_MAX_CHARS = 50
export const TASK_SUBJECT_MAX_CHARS = 60
