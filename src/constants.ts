export enum Provider {
	Claude = 'claude',
	Codex = 'codex',
	Gemini = 'gemini',
}

export const PROVIDER_VALUES = Object.values(Provider) as string[]

export const VERSION = '0.1.0'
export const CLI_NAME = process.env.PRETTY_SESSION_PROG_NAME ?? 'pretty-session'
export const CLI_BIN_NAMES = ['pretty-session', 'pts']
export const DEV_CLI_BIN_NAMES = ['pretty-sessiond', 'prettysessiond', 'ptsd']
export const INDENT = '   '

export const TOOL_RESULT_MAX_CHARS = Number(process.env.PTS_TOOL_RESULT_MAX_CHARS ?? 300)
export const READ_PREVIEW_LINES = Number(process.env.PTS_READ_PREVIEW_LINES ?? 5)
export const USER_MESSAGE_MAX_CHARS = 200
export const AGENT_DESCRIPTION_MAX_CHARS = 50
export const TASK_SUBJECT_MAX_CHARS = 60
