import { argument, defineCommand, defineSubCommand, flag } from '../cli/define'
import { Provider } from '../constants'
import { createProviderParser } from '../lib/provider-parser'
import { resolveSessionSource } from '../lib/session-source'
import { watchLines } from '../lib/stream'

const WATCH_COMMAND_NAME = 'watch'

export const watchCommand = defineCommand({
	name: WATCH_COMMAND_NAME,
	description: 'Follow saved session JSONL files',
	subcommands: Object.values(Provider).map((provider) =>
		defineSubCommand({
			name: provider,
			description: `Follow a saved ${provider} session JSONL file`,
			arguments: [argument.string('session', 'Session JSONL file path or session id to follow', { required: true })],
			flags: [
				flag.boolean('--from-end', 'Start at the end of the file instead of replaying existing events'),
				flag.string('--interval', 'Polling interval in milliseconds', { default: '250' }),
			],
			action: async ({ args, options }) => {
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
			},
		}),
	),
})
