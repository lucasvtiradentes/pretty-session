import { AnsiRenderer } from "../../../renderers/ansi"
import type { Renderer } from "../../../renderers/base"

export class ParserState {
	mode: string
	currentTool = ""
	sessionShown = false
	subagentDepth = 0
	sp = ""
	inBold = false
	inCode = false
	pendingChar = ""
	renderer: Renderer
	pendingSessionId = ""
	pendingCwd = ""
	lastUsage: Record<string, number> = {}
	lastModel = ""
	lastDurationMs = 0
	turnCount = 0
	lastCostUsd = 0

	constructor(mode = "stream") {
		this.mode = mode
		this.renderer = new AnsiRenderer()
	}

	updateSp() {
		this.sp = Array.from({ length: this.subagentDepth }, () => this.renderer.pipe()).join("")
	}

	incrementDepth() {
		this.subagentDepth++
		this.updateSp()
	}

	decrementDepth() {
		if (this.subagentDepth > 0) {
			this.subagentDepth--
			this.updateSp()
		}
	}

	private getStyle(): string {
		if (this.inBold && this.inCode) return this.renderer.styleBoldCode()
		if (this.inBold) return this.renderer.styleBold()
		if (this.inCode) return this.renderer.styleCode()
		return ""
	}

	renderText(text: string): string {
		const out: string[] = []
		let i = 0
		const buf = this.pendingChar + text
		this.pendingChar = ""

		while (i < buf.length) {
			const ch = buf[i]
			if (ch === "*" && !this.inCode) {
				if (i + 1 < buf.length) {
					if (buf[i + 1] === "*") {
						this.inBold = !this.inBold
						out.push(this.renderer.styleReset() + this.getStyle())
						i += 2
						continue
					}
					out.push(ch)
					i++
				} else {
					this.pendingChar = "*"
					break
				}
			} else if (ch === "`") {
				this.inCode = !this.inCode
				out.push(this.renderer.styleReset() + this.getStyle())
				i++
			} else {
				out.push(ch)
				i++
			}
		}

		return out.join("")
	}
}

export class ParseResult {
	messages: string[] = []

	add(text: string) {
		this.messages.push(text)
	}

	getOutput(): string {
		return this.messages.join("")
	}
}
