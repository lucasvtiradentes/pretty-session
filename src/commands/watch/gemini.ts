import { createCommandAdapters } from 'unicommand'
import { Provider } from '../../constants'
import { createWatchHandler, defineWatchCommand } from './shared'

const metadata = defineWatchCommand(Provider.Gemini)

export const handler = createWatchHandler(Provider.Gemini)

export const watchGeminiCommand = createCommandAdapters({
	metadata,
	handler,
})
