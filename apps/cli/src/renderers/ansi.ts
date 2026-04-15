import type { Renderer } from "./base"

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

function visualWidth(text: string): number {
	return text
		.replace(/`[^`]+`/g, (m) => m.slice(1, -1))
		.replace(/\*\*(.+?)\*\*/g, "$1")
		.replace(/__(.+?)__/g, "$1").length
}

function padVisual(text: string, width: number): string {
	const pad = width - visualWidth(text)
	return pad > 0 ? text + " ".repeat(pad) : text
}

function formatTables(text: string): string {
	return text.replace(/(?:^|\n)((?:\|[^\n]*\|[^\n]*\|(?:\n|$))+)/g, (_match, tableBlock: string) => {
		const lines = tableBlock.trim().split("\n")
		const dataLines = lines.filter((l) => !/^\|[\s-:|]+\|$/.test(l))
		if (dataLines.length === 0) return tableBlock

		const rows = dataLines.map((l) =>
			l
				.split("|")
				.slice(1, -1)
				.map((c) => c.trim()),
		)
		const colCount = rows[0].length
		const widths = Array.from({ length: colCount }, (_, i) => Math.max(...rows.map((r) => visualWidth(r[i] ?? ""))))

		const formatted = rows.map((row, ri) => {
			const cells = row.map((cell, ci) => ` ${padVisual(cell, widths[ci])} `)
			const pipe = `${DIM}|${RESET}`
			const line = `${pipe}${cells.join(pipe)}${pipe}`
			if (ri === 0) {
				const separator = widths.map((w) => `${DIM}${"-".repeat(w + 2)}${RESET}`).join(`${DIM}|${RESET}`)
				return `${line}\n${DIM}|${RESET}${separator}${DIM}|${RESET}`
			}
			return line
		})

		return `\n${formatted.join("\n")}\n`
	})
}

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
		result = formatTables(result)
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

	pipe() {
		return `${DIM}│${RESET} `
	}
}
