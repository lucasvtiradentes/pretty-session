import { AnsiRenderer } from "../../lib/renderer"
import type { Renderer } from "../../lib/renderer"

export class CodexState {
	sessionShown = false
	sessionId = ""
	sessionTimestamp = ""
	timezone = ""
	model = ""
	turnCount = 0
	renderer: Renderer
	lastInputTokens = 0
	lastOutputTokens = 0
	streamingAssistantText = ""

	constructor() {
		this.renderer = new AnsiRenderer()
	}
}
