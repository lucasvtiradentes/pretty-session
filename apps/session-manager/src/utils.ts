import { execSync } from "node:child_process"
import { readFileSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"

export function parseArgs(argv: string[]): { count: number; branchFilter: string } {
	const args = argv.slice(2)
	let count = 10
	let branchFilter = ""

	for (let i = 0; i < args.length; i++) {
		if (args[i] === "--branch") {
			if (i + 1 >= args.length) {
				console.error("missing value for --branch")
				process.exit(1)
			}
			branchFilter = args[++i]
		} else if (args[i] === "--help" || args[i] === "-h") {
			const name = argv[1]?.split("/").pop() ?? "script"
			console.error(`usage: ${name} [count] [--branch BRANCH]`)
			process.exit(0)
		} else {
			count = Number.parseInt(args[i], 10)
			if (Number.isNaN(count) || count <= 0) {
				console.error("count must be a positive integer")
				process.exit(1)
			}
		}
	}

	return { count, branchFilter }
}

export function getRepoRoot(): string {
	try {
		return execSync("git rev-parse --show-toplevel", { encoding: "utf-8" }).trim()
	} catch {
		return process.cwd()
	}
}

export function parseIso(value: string | undefined | null): Date | null {
	if (!value) return null
	try {
		const d = new Date(value)
		return Number.isNaN(d.getTime()) ? null : d
	} catch {
		return null
	}
}

export function relativeLabel(value: Date | null): string {
	if (!value) return "-"
	const now = Date.now()
	const seconds = Math.max(Math.floor((now - value.getTime()) / 1000), 0)
	if (seconds < 60) return `${seconds} seconds ago`
	const minutes = Math.floor(seconds / 60)
	if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`
	const hours = Math.floor(minutes / 60)
	if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`
	const days = Math.floor(hours / 24)
	if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`
	return value.toISOString().replace("T", " ").slice(0, 16)
}

export function stripXmlTags(text: string): string {
	return text.replace(/<[^>]+>/g, "")
}

export function normalizeText(text: string, limit = 80): string {
	const cleaned = stripXmlTags(text).replace(/\s+/g, " ").trim()
	if (!cleaned) return "-"
	if (cleaned.length <= limit) return cleaned
	return `${cleaned.slice(0, limit - 3).trimEnd()}...`
}

export interface SessionItem {
	created: string
	updatedSort: number
	updated: string
	branch: string
	preview: string
}

export function printTable(items: SessionItem[]): void {
	if (items.length === 0) return

	const createdWidth = Math.max("Created".length, ...items.map((i) => i.created.length))
	const updatedWidth = Math.max("Updated".length, ...items.map((i) => i.updated.length))
	const branchWidth = Math.max("Branch".length, ...items.map((i) => i.branch.length))

	const pad = (s: string, w: number) => s.padEnd(w)

	console.log(
		`${pad("Created", createdWidth)}  ${pad("Updated", updatedWidth)}  ${pad("Branch", branchWidth)}  Conversation`,
	)
	for (const item of items) {
		console.log(
			`${pad(item.created, createdWidth)}  ${pad(item.updated, updatedWidth)}  ${pad(item.branch, branchWidth)}  ${item.preview}`,
		)
	}
}

export function sortAndSlice(items: SessionItem[], count: number): SessionItem[] {
	items.sort((a, b) => b.updatedSort - a.updatedSort)
	return items.slice(0, count)
}

export function listJsonFiles(dir: string, pattern: RegExp): string[] {
	try {
		return readdirSync(dir)
			.filter((f) => pattern.test(f))
			.map((f) => join(dir, f))
	} catch {
		return []
	}
}

export function readJsonFile<T = unknown>(path: string): T | null {
	try {
		return JSON.parse(readFileSync(path, "utf-8"))
	} catch {
		return null
	}
}

export function fileMtime(path: string): Date | null {
	try {
		return statSync(path).mtime
	} catch {
		return null
	}
}
