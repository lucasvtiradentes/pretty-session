import { AnsiRenderer } from '../../lib/renderer'
import type { Renderer } from '../../lib/renderer'

export class CodexState {
	sessionShown = false
	sessionId = ''
	sessionTimestamp = ''
	sessionFilePath = ''
	timezone = ''
	model = ''
	turnCount = 0
	renderer: Renderer
	lastInputTokens = 0
	lastOutputTokens = 0
	streamingAssistantText = ''
	pendingUserMessage = ''
	initialUserRendered = false
	initialUserFallbackTried = false

	constructor() {
		this.renderer = new AnsiRenderer()
	}
}
