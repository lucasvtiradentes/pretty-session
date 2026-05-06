import { AnsiRenderer } from '../../lib/renderer'
import type { Renderer } from '../../lib/renderer'
import { GEMINI_DEFAULT_MODEL } from './constants'

export class GeminiState {
	sessionShown = false
	sessionId = ''
	model = GEMINI_DEFAULT_MODEL
	turnCount = 0
	hasSessionTurns = false
	renderer: Renderer
	lastInputTokens = 0
	lastOutputTokens = 0
	acpToolCallsRendered = new Set<string>()
	acpToolCallPreviews = new Map<string, string>()
	streamingAssistantText = ''

	constructor() {
		this.renderer = new AnsiRenderer()
	}
}
