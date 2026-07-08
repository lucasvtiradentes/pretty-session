import { createCommandAdapters } from 'unicommand'
import { Provider } from '../../constants'
import { createWatchHandler, defineWatchCommand } from './shared'

const metadata = defineWatchCommand(Provider.Claude)

export const handler = createWatchHandler(Provider.Claude)

export const watchClaudeCommand = createCommandAdapters({
	metadata,
	handler,
})
