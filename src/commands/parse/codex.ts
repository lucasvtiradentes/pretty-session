import { createCommandAdapters } from 'unicommand'
import { Provider } from '../../constants'
import { createParseHandler, defineParseCommand } from './shared'

const metadata = defineParseCommand(Provider.Codex)

export const handler = createParseHandler(Provider.Codex)

export const parseCodexCommand = createCommandAdapters({
	metadata,
	handler,
})
