import type { Renderer } from "./base.js"

const BOLD = "\x1b[1m"
const INVERSE = "\x1b[7m"
const GREEN = "\x1b[32m"
const ORANGE = "\x1b[33m"
const PURPLE = "\x1b[35m"
const BLUE = "\x1b[34m"
const YELLOW = "\x1b[93m"
const DIM = "\x1b[90m"
const RED = "\x1b[31m"
const RESET = "\x1b[0m"

export class AnsiRenderer implements Renderer {
	bold(text: string) {
		return `${BOLD}${text}${RESET}`
	}

	dim(text: string) {
		return `${DIM}${text}${RESET}`
	}

	red(text: string) {
		return `${RED}${text}${RESET}`
	}

	green(text: string) {
		return `${GREEN}${text}${RESET}`
	}

	orange(text: string) {
		return `${ORANGE}${text}${RESET}`
	}

	purple(text: string) {
		return `${PURPLE}${text}${RESET}`
	}

	blue(text: string) {
		return `${BLUE}${text}${RESET}`
	}

	yellow(text: string) {
		return `${YELLOW}${text}${RESET}`
	}

	renderMarkdown(text: string) {
		let result = text
		result = result.replace(/\*\*(.+?)\*\*/g, `${BOLD}$1${RESET}`)
		result = result.replace(/__(.+?)__/g, `${BOLD}$1${RESET}`)
		result = result.replace(/`([^`]+)`/g, `${INVERSE}$1${RESET}`)
		return result
	}

	styleReset() {
		return RESET
	}

	styleBold() {
		return BOLD
	}

	styleCode() {
		return INVERSE
	}

	styleBoldCode() {
		return BOLD + INVERSE
	}

	sectionOpen() {
		return this.dim(`┌${"─".repeat(31)}`)
	}

	sectionClose() {
		return this.dim(`└${"─".repeat(31)}`)
	}

	pipe() {
		return `${DIM}│${RESET} `
	}
}
