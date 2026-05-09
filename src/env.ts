import { z } from 'zod'

const envSchema = z
	.object({
		PTS_SHOW_SUBAGENT_PROMPT: z.stringbool().optional(),
		PTS_TOOL_RESULT_LINES: z.coerce.number().optional(),
	})
	.extend({
		PRETTY_SESSION_DEV_BIN_DIR: z.string().optional(),
		PRETTY_SESSION_PROG_NAME: z.string().optional(),
	})

export const env = envSchema.parse(process.env)
