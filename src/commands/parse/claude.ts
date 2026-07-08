import { createCommandAdapters } from 'unicommand'
import { Provider } from '../../constants'
import { createParseHandler, defineParseCommand } from './shared'

const metadata = defineParseCommand(Provider.Claude)

export const handler = createParseHandler(Provider.Claude)

export const parseClaudeCommand = createCommandAdapters({
	metadata,
	handler,
})
