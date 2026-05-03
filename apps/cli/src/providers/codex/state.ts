import { AnsiRenderer } from "../../renderers/ansi"
import type { Renderer } from "../../renderers/base"

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
