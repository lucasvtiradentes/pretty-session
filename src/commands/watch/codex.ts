import { createCommandAdapters } from 'unicommand'
import { Provider } from '../../constants'
import { createWatchHandler, defineWatchCommand } from './shared'

const metadata = defineWatchCommand(Provider.Codex)

export const handler = createWatchHandler(Provider.Codex)

export const watchCodexCommand = createCommandAdapters({
	metadata,
	handler,
})
