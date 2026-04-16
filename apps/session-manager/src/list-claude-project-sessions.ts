import { closeSync, createReadStream, existsSync, openSync, readSync, readdirSync, statSync } from "node:fs"
import { homedir } from "node:os"
import { join, normalize } from "node:path"
import { createInterface } from "node:readline"
import {
	type SessionItem,
	fileMtime,
	getRepoRoot,
	normalizeText,
	parseArgs,
	parseIso,
	printTable,
	relativeLabel,
	sortAndSlice,
} from "./utils.js"

const { count, branchFilter } = parseArgs(process.argv)
const repoRoot = normalize(getRepoRoot())
const configDir = process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), ".claude")
const projectsDir = join(configDir, "projects")

if (!existsSync(projectsDir)) {
	console.error(`projects dir not found: ${projectsDir}`)
	process.exit(1)
}

function sanitizePath(p: string): string {
	return p.replace(/[^a-zA-Z0-9]/g, "-")
}

function projectDirsForRepo(): string[] {
	const sanitized = sanitizePath(repoRoot)
	const base = join(projectsDir, sanitized)
	return existsSync(base) ? [base] : []
}

function extractFirstUserText(obj: Record<string, unknown>): string {
	if (obj.type !== "user") return ""
	const msg = (obj.message as Record<string, unknown>) ?? {}
	const content = msg.content
	if (typeof content === "string") return content.trim()
	if (Array.isArray(content)) {
		return content
			.filter((c: Record<string, unknown>) => c.type === "text")
			.map((c: Record<string, unknown>) => (c.text as string) ?? "")
			.join(" ")
			.trim()
	}
	return ""
}

const SKIP_PREFIXES = [
	"<local-command-caveat>",
	"# AGENTS.md instructions for ",
	"<command-name>",
	"continue ",
	"continua ",
]

function shouldSkipPreview(text: string): boolean {
	return SKIP_PREFIXES.some((p) => text.startsWith(p))
}

function readTailMetadata(path: string, window = 65536): Record<string, string> {
	const meta: Record<string, string> = {}
	try {
		const size = statSync(path).size
		const fd = openSync(path, "r")
		const start = Math.max(0, size - window)
		const buf = Buffer.alloc(Math.min(window, size))
		readSync(fd, buf, 0, buf.length, start)
		closeSync(fd)
		const tail = buf.toString("utf-8")
		for (const line of tail.split("\n")) {
			const trimmed = line.trim()
			if (!trimmed) continue
			try {
				const obj = JSON.parse(trimmed)
				if (obj.type === "custom-title") meta.custom_title = obj.customTitle ?? ""
				else if (obj.type === "tag") meta.tag = obj.tag ?? ""
			} catch {}
		}
	} catch {}
	return meta
}

async function processSession(path: string): Promise<SessionItem | null> {
	const updatedAt = fileMtime(path)
	if (!updatedAt) return null

	let createdAt: Date | null = null
	let gitBranch: string | null = null
	let preview = ""
	let sessionCwd: string | null = null
	let foundUser = false

	const rl = createInterface({ input: createReadStream(path, "utf-8"), crlfDelay: Number.POSITIVE_INFINITY })

	for await (const rawLine of rl) {
		const line = rawLine.trim()
		if (!line) continue
		let obj: Record<string, unknown>
		try {
			obj = JSON.parse(line)
		} catch {
			continue
		}

		if (obj.type === "user" && !foundUser) {
			foundUser = true
			sessionCwd = (obj.cwd as string) ?? null
			createdAt = parseIso(obj.timestamp as string)
			gitBranch = (obj.gitBranch as string) ?? null

			if (sessionCwd) {
				const normCwd = normalize(sessionCwd)
				if (normCwd !== repoRoot && !normCwd.startsWith(`${repoRoot}/`)) return null
			}

			const candidate = extractFirstUserText(obj)
			if (candidate && !shouldSkipPreview(candidate)) preview = candidate
		}

		if (obj.type === "user" && !preview) {
			const candidate = extractFirstUserText(obj)
			if (candidate && !shouldSkipPreview(candidate)) preview = candidate
		}

		if (foundUser && preview) break
	}

	if (!sessionCwd) return null
	if (branchFilter && gitBranch !== branchFilter) return null

	const tailMeta = readTailMetadata(path)

	return {
		created: relativeLabel(createdAt),
		updatedSort: updatedAt.getTime(),
		updated: relativeLabel(updatedAt),
		branch: gitBranch ?? "-",
		preview: normalizeText(tailMeta.custom_title || preview),
	}
}

async function main() {
	const projDirs = projectDirsForRepo()
	const seen = new Set<string>()
	const files: string[] = []

	for (const dir of projDirs) {
		try {
			for (const entry of readdirSync(dir)) {
				if (!entry.endsWith(".jsonl")) continue
				const stem = entry.replace(".jsonl", "")
				if (seen.has(stem)) continue
				seen.add(stem)
				files.push(join(dir, entry))
			}
		} catch {}
	}

	const results = await Promise.all(files.map(processSession))
	const items = results.filter((r): r is SessionItem => r !== null)
	const final = sortAndSlice(items, count)

	if (final.length === 0) {
		console.log("No Claude Code sessions found for this project.")
		process.exit(0)
	}

	printTable(final)
}

main()
