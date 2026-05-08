import type { Program } from '@caporal/core'
import { Provider } from '../constants'
import { createProviderParser } from '../lib/provider-parser'
import { resolveSessionSource } from '../lib/session-source'
import { watchLines } from '../lib/stream'

const WATCH_COMMAND_NAME = 'watch'

export function registerWatchCommand(program: Program) {
	for (const provider of Object.values(Provider)) {
		program
			.command(`${WATCH_COMMAND_NAME} ${provider}`, `Follow a saved ${provider} session JSONL file`)
			.argument('<session>', 'Session JSONL file path or session id to follow')
			.option('--from-end', 'Start at the end of the file instead of replaying existing events')
			.option('--interval <ms>', 'Polling interval in milliseconds', { default: 250 })
			.strict(false)
			.action(async ({ args, options }) => {
				const intervalMs = Number(options.interval)
				if (!Number.isFinite(intervalMs) || intervalMs <= 0) {
					console.log(`error: invalid interval '${String(options.interval)}'`)
					return 1
				}

				const controller = new AbortController()
				process.once('SIGINT', () => controller.abort())
				process.once('SIGTERM', () => controller.abort())

				const path = await resolveSessionSource(provider, String(args.session))
				await watchLines({
					path,
					createParser: () => createProviderParser(provider),
					fromEnd: Boolean(options.fromEnd),
					intervalMs,
					signal: controller.signal,
				})

				return 0
			})
	}
}
