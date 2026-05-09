import { env } from './env'

export enum Provider {
	Claude = 'claude',
	Codex = 'codex',
	Gemini = 'gemini',
}

export const PROVIDER_VALUES = Object.values(Provider) as string[]

export const VERSION = '0.1.1'
export const CLI_NAME = env.PRETTY_SESSION_PROG_NAME ?? 'pretty-session'
export const CLI_BIN_NAMES = ['pretty-session', 'pts']
export const DEV_CLI_BIN_NAMES = ['pretty-sessiond', 'prettysessiond', 'ptsd']
export const INDENT = '   '

export const TOOL_RESULT_LINES = env.PTS_TOOL_RESULT_LINES ?? 0
export const SHOW_SUBAGENT_PROMPT = env.PTS_SHOW_SUBAGENT_PROMPT ?? true
