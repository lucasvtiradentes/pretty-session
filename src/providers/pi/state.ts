import { AnsiRenderer } from '../../lib/renderer'
import type { Renderer } from '../../lib/renderer'

export class PiState {
	sessionShown = false
	sessionId = ''
	sessionFilePath = ''
	cwd = ''
	provider = ''
	model = ''
	turnCount = 0
	pendingUserMessage = ''
	lastInputTokens = 0
	lastOutputTokens = 0
	renderer: Renderer

	constructor() {
		this.renderer = new AnsiRenderer()
	}
}
