import { createReadStream, existsSync, readdirSync } from "node:fs"
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
const sessionsDir = process.env.CODEX_SESSIONS_DIR ?? join(homedir(), ".codex", "sessions")

if (!existsSync(sessionsDir)) {
	console.error(`sessions dir not found: ${sessionsDir}`)
	process.exit(1)
}

function pathBelongsToRepo(sessionCwd: string): boolean {
	if (!sessionCwd) return false
	const norm = normalize(sessionCwd)
	return norm === repoRoot || norm.startsWith(`${repoRoot}/`)
}

function firstUserText(obj: Record<string, unknown>): string {
	const lineType = obj.type as string
	if (lineType === "event_msg") {
		const payload = (obj.payload as Record<string, unknown>) ?? {}
		if (payload.type === "user_message") return (payload.message as string) ?? ""
	}
	if (lineType === "response_item") {
		const payload = (obj.payload as Record<string, unknown>) ?? {}
		if (payload.type === "message" && payload.role === "user") {
			const content = (payload.content as Array<Record<string, unknown>>) ?? []
			return content
				.filter((c) => c.type === "input_text")
				.map((c) => (c.text as string) ?? "")
				.join(" ")
				.trim()
		}
	}
	return ""
}

function branchFromDeveloperText(obj: Record<string, unknown>): string | null {
	if (obj.type !== "response_item") return null
	const payload = (obj.payload as Record<string, unknown>) ?? {}
	if (payload.type !== "message" || payload.role !== "developer") return null
	const content = (payload.content as Array<Record<string, unknown>>) ?? []
	for (const item of content) {
		if (item.type !== "input_text") continue
		const text = (item.text as string) ?? ""
		const match = text.match(/\bbranch:\s*([^|]+)/)
		if (match) return match[1].trim()
	}
	return null
}

function shouldSkipPreview(text: string): boolean {
	return text.startsWith("# AGENTS.md instructions for ")
}

async function processSession(path: string): Promise<SessionItem | null> {
	const updatedAt = fileMtime(path)
	if (!updatedAt) return null

	let sessionCwd: string | null = null
	let createdAt: Date | null = null
	let gitBranch: string | null = null
	let preview = ""

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

		if (obj.type === "session_meta" && sessionCwd === null) {
			const payload = (obj.payload as Record<string, unknown>) ?? {}
			sessionCwd = (payload.cwd as string) ?? null
			createdAt = parseIso((payload.timestamp as string) ?? (obj.timestamp as string))
			const git = (payload.git as Record<string, unknown>) ?? {}
			gitBranch = (git.branch as string) ?? null
			if (branchFilter && gitBranch !== branchFilter) return null
			if (!pathBelongsToRepo(sessionCwd ?? "")) return null
			continue
		}

		if (sessionCwd && !gitBranch) {
			gitBranch = branchFromDeveloperText(obj) ?? gitBranch
		}

		if (sessionCwd && !preview) {
			const candidate = firstUserText(obj)
			if (candidate && !shouldSkipPreview(candidate)) {
				preview = candidate
			}
		}
	}

	if (!sessionCwd) return null

	return {
		created: relativeLabel(createdAt),
		updatedSort: updatedAt.getTime(),
		updated: relativeLabel(updatedAt),
		branch: gitBranch ?? "-",
		preview: normalizeText(preview),
	}
}

async function main() {
	const files: string[] = []
	function walk(dir: string) {
		try {
			for (const entry of readdirSync(dir, { withFileTypes: true })) {
				if (entry.isDirectory()) walk(join(dir, entry.name))
				else if (entry.name.startsWith("rollout-") && entry.name.endsWith(".jsonl")) {
					files.push(join(dir, entry.name))
				}
			}
		} catch {}
	}
	walk(sessionsDir)

	const results = await Promise.all(files.map(processSession))
	const items = results.filter((r): r is SessionItem => r !== null)
	const final = sortAndSlice(items, count)

	if (final.length === 0) {
		console.log("No Codex sessions found for this project.")
		process.exit(0)
	}

	printTable(final)
}

main()
