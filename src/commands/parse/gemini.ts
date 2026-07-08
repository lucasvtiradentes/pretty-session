import { createCommandAdapters } from 'unicommand'
import { Provider } from '../../constants'
import { createParseHandler, defineParseCommand } from './shared'

const metadata = defineParseCommand(Provider.Gemini)

export const handler = createParseHandler(Provider.Gemini)

export const parseGeminiCommand = createCommandAdapters({
	metadata,
	handler,
})
