import { AnsiRenderer } from "../../renderer"
import type { Renderer } from "../../renderer"

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
