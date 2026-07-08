import { createCommandAdapters } from 'unicommand'
import { Provider } from '../../constants'
import { createParseHandler, defineParseCommand } from './shared'

const metadata = defineParseCommand(Provider.Pi)

export const handler = createParseHandler(Provider.Pi)

export const parsePiCommand = createCommandAdapters({
	metadata,
	handler,
})
