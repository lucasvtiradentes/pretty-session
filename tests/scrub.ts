import { readFileSync, writeFileSync } from "node:fs"

const SENSITIVE_CONTENT = [
	"<permissions",
	"<skills_instructions",
	"<environment_context",
	"AGENTS.md",
	"CLAUDE.md",
	"<hooks",
]

function isSensitiveLine(d: Record<string, unknown>): boolean {
	const type = (d.type as string) ?? ""

	if (type === "system" && d.subtype !== "init") return true

	if (type === "response_item") {
		const p = (d.payload as Record<string, unknown>) ?? {}
		const role = (p.role as string) ?? ""
		if (role !== "developer" && role !== "user") return false
		const content = (p.content as Array<Record<string, string>>) ?? []
		if (!Array.isArray(content)) return false
		const text = content.map((c) => c.text ?? "").join("")
		return SENSITIVE_CONTENT.some((k) => text.includes(k))
	}

	return false
}

function scrubTurnContext(d: Record<string, unknown>): Record<string, unknown> {
	if ((d.type as string) !== "turn_context") return d
	const payload = { ...((d.payload as Record<string, unknown>) ?? {}) }
	payload.user_instructions = undefined
	if (typeof payload.cwd === "string") payload.cwd = "<CWD>"
	if (payload.collaboration_mode) {
		const cm = { ...((payload.collaboration_mode as Record<string, unknown>) ?? {}) }
		const settings = { ...((cm.settings as Record<string, unknown>) ?? {}) }
		settings.developer_instructions = undefined
		cm.settings = settings
		payload.collaboration_mode = cm
	}
	return { ...d, payload }
}

function scrubSystemInit(d: Record<string, unknown>): Record<string, unknown> {
	if ((d.type as string) !== "system" || d.subtype !== "init") return d
	const cleaned = { ...d }
	if (typeof cleaned.cwd === "string") cleaned.cwd = "<CWD>"
	cleaned.memory_paths = undefined
	cleaned.skills = undefined
	cleaned.plugins = undefined
	cleaned.slash_commands = undefined
	cleaned.mcp_servers = undefined
	return cleaned
}

function scrubSessionMeta(d: Record<string, unknown>): Record<string, unknown> {
	if ((d.type as string) !== "session_meta") return d
	const payload = { ...((d.payload as Record<string, unknown>) ?? {}) }
	if (typeof payload.cwd === "string") payload.cwd = "<CWD>"
	return { ...d, payload }
}

export function scrubFixture(filePath: string) {
	const raw = readFileSync(filePath, "utf-8")
	const scrubbed = raw
		.split("\n")
		.filter((line) => {
			if (!line.trim()) return false
			try {
				return !isSensitiveLine(JSON.parse(line))
			} catch {
				return true
			}
		})
		.map((line) => {
			try {
				let d = JSON.parse(line) as Record<string, unknown>
				d = scrubSystemInit(d)
				d = scrubTurnContext(d)
				d = scrubSessionMeta(d)
				return JSON.stringify(d)
			} catch {
				return line
			}
		})
		.join("\n")
	writeFileSync(filePath, `${scrubbed}\n`)
}
