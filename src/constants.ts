import { env } from './env'

export enum Provider {
	Claude = 'claude',
	Codex = 'codex',
	Gemini = 'gemini',
	Pi = 'pi',
}

export const PROVIDER_VALUES = Object.values(Provider) as string[]

export const INDENT = '   '

export const TOOL_RESULT_LINES = env.PTS_TOOL_RESULT_LINES ?? 0
export const SHOW_SUBAGENT_PROMPT = env.PTS_SHOW_SUBAGENT_PROMPT ?? true
