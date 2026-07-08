import { env } from './env'

export enum Provider {
	Claude = 'claude',
	Codex = 'codex',
	Gemini = 'gemini',
	Pi = 'pi',
}

export const PROVIDER_VALUES = Object.values(Provider) as string[]

export const VERSION = '0.1.4'
export const CLI_NAME = env.PRETTY_SESSION_PROG_NAME ?? 'pretty-session'
const PACKAGE_CLI_BIN_NAMES = ['pretty-session', 'pts']
const DEV_CLI_BIN_NAMES = ['ptsd', 'pretty-sessiond', 'prettysessiond']
export const CLI_BIN_NAMES = DEV_CLI_BIN_NAMES.includes(CLI_NAME) ? DEV_CLI_BIN_NAMES : PACKAGE_CLI_BIN_NAMES
export const CLI_DESCRIPTION = 'Pretty formatter for AI coding agent sessions'
export const INDENT = '   '

export const TOOL_RESULT_LINES = env.PTS_TOOL_RESULT_LINES ?? 0
export const SHOW_SUBAGENT_PROMPT = env.PTS_SHOW_SUBAGENT_PROMPT ?? true
