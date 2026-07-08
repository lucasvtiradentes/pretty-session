import { createCommandAdapters } from 'unicommand'
import { Provider } from '../../constants'
import { createWatchHandler, defineWatchCommand } from './shared'

const metadata = defineWatchCommand(Provider.Pi)

export const handler = createWatchHandler(Provider.Pi)

export const watchPiCommand = createCommandAdapters({
	metadata,
	handler,
})
