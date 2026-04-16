import { existsSync } from "node:fs"
import { homedir } from "node:os"
import { basename, join } from "node:path"
import {
	type SessionItem,
	getRepoRoot,
	listJsonFiles,
	normalizeText,
	parseArgs,
	parseIso,
	printTable,
	readJsonFile,
	relativeLabel,
	sortAndSlice,
} from "./utils.js"

const { count, branchFilter } = parseArgs(process.argv)
const repoRoot = getRepoRoot()
const projectName = basename(repoRoot)
const geminiDir = process.env.GEMINI_CONFIG_DIR ?? join(homedir(), ".gemini")
const sessionsDir = join(geminiDir, "tmp", projectName, "chats")

if (!existsSync(sessionsDir)) {
	console.error(`sessions dir not found: ${sessionsDir}`)
	process.exit(1)
}

if (branchFilter) {
	console.log("No Gemini CLI sessions found for this project.")
	console.log("(note: Gemini CLI does not store git branch info; --branch filter has no effect)")
	process.exit(0)
}

interface GeminiMessage {
	type: string
	content: string | Array<{ text?: string }>
}

interface GeminiSession {
	startTime?: string
	lastUpdated?: string
	messages?: GeminiMessage[]
}

function extractFirstUserText(messages: GeminiMessage[]): string {
	for (const msg of messages) {
		if (msg.type !== "user") continue
		if (typeof msg.content === "string") return msg.content.trim()
		if (Array.isArray(msg.content)) {
			return msg.content
				.map((c) => c.text ?? "")
				.join(" ")
				.trim()
		}
	}
	return ""
}

const files = listJsonFiles(sessionsDir, /^session-.*\.json$/)
const items: SessionItem[] = []

for (const path of files) {
	const data = readJsonFile<GeminiSession>(path)
	if (!data) continue

	const createdAt = parseIso(data.startTime)
	const updatedAt = parseIso(data.lastUpdated)
	const messages = data.messages ?? []
	const preview = extractFirstUserText(messages)

	items.push({
		created: relativeLabel(createdAt),
		updatedSort: updatedAt?.getTime() ?? 0,
		updated: relativeLabel(updatedAt),
		branch: "-",
		preview: normalizeText(preview),
	})
}

const final = sortAndSlice(items, count)

if (final.length === 0) {
	console.log("No Gemini CLI sessions found for this project.")
	process.exit(0)
}

printTable(final)
