import { execSync } from "node:child_process"
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { scrubFixture } from "../scrub"
import { SESSION_FOOTER, SESSION_HEADER, STREAM_SESSION_HEADER } from "./expectations"

const CLI_ROOT = resolve(dirname(new URL(import.meta.url).pathname), "../..")
const SANDBOX_BASE = resolve(CLI_ROOT, ".sandbox")
const CLI_PATH = resolve(CLI_ROOT, "src/cli.ts")
const HOME = process.env.HOME ?? ""

const TEST_ENV = { ...process.env, PS_TOOL_RESULT_MAX_CHARS: "300", PS_READ_PREVIEW_LINES: "5" }

// biome-ignore lint/suspicious/noControlCharactersInRegex: stripping ANSI escape codes
const stripAnsi = (s: string) => s.replace(/\x1b\[[0-9;]*m/g, "")

export function replayFixture(fixturePath: string): string {
	const output = execSync(`npx tsx ${CLI_PATH} codex < ${fixturePath}`, {
		encoding: "utf-8",
		timeout: 30_000,
		cwd: CLI_ROOT,
		env: TEST_ENV,
	})
	return output
}

export function runE2E(promptPath: string, dir: string): string {
	const prompt = readFileSync(promptPath, "utf-8").trim()
	const escapedPrompt = prompt.replace(/"/g, '\\"')
	const streamFile = resolve(dir, "stream.jsonl")
	const testName = dir.split("/").filter(Boolean).pop() ?? "default"
	const sandboxDir = resolve(SANDBOX_BASE, `codex-${testName}`)
	execSync(`rm -rf ${sandboxDir} && mkdir -p ${sandboxDir} && git -C ${sandboxDir} init -q`)

	const output = execSync(
		`cd ${sandboxDir} && codex exec "${escapedPrompt}" --json --dangerously-bypass-approvals-and-sandbox 2>/dev/null | tee ${streamFile} | npx tsx ${CLI_PATH} codex`,
		{ encoding: "utf-8", timeout: 120_000, cwd: CLI_ROOT, env: TEST_ENV },
	)

	const sessionSrc = extractSessionPath(output)
	if (sessionSrc) {
		const dest = resolve(dir, "session.jsonl")
		copyFileSync(sessionSrc, dest)
		scrubFixture(dest)
	}

	scrubFixture(streamFile)
	enrichStreamFixture(streamFile, resolve(dir, "session.jsonl"))
	execSync(`rm -rf ${sandboxDir}`)

	return output
}

function enrichStreamFixture(streamFile: string, sessionFile: string) {
	if (!existsSync(sessionFile)) return
	const sessionLines = readFileSync(sessionFile, "utf-8").split("\n")
	const metaLines: string[] = []
	for (const line of sessionLines) {
		if (!line.trim()) continue
		try {
			const d = JSON.parse(line)
			if (d.type === "session_meta" || d.type === "turn_context") metaLines.push(line)
		} catch {}
	}
	if (metaLines.length === 0) return
	const stream = readFileSync(streamFile, "utf-8")
	writeFileSync(streamFile, `${metaLines.join("\n")}\n${stream}`)
}

function extractSessionPath(output: string): string | null {
	// biome-ignore lint/suspicious/noControlCharactersInRegex: stripping ANSI escape codes
	const clean = output.replace(/\x1b\[[0-9;]*m/g, "")
	const match = clean.match(/path:\s+(~\/\.codex\/[^\s]+\.jsonl)/)
	if (!match) return null
	return match[1].replace("~", HOME)
}

export function sanitize(output: string): string {
	return (
		output
			// biome-ignore lint/suspicious/noControlCharactersInRegex: stripping ANSI escape codes
			.replace(/\x1b\[[0-9;]*m/g, "")
			.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g, "<UUID>")
			.replace(/~\/\.codex\/sessions\/[^\s]+\.jsonl/g, "<CODEX_PATH>")
			.replace(/model: [\w.-]*/g, "model: <MODEL>")
			.replace(/\d+ turns/g, "<N> turns")
			.replace(/\d+ in \/ \d+ out/g, "<N> in / <N> out")
			.replace(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun) \w+\s+\d+ [\d:]+ [+-]?\w+ \d+/g, "<DATE>")
			.replace(/\/(?:Users|home|root|tmp|test|private)\b[^\s]*/g, "<ABS_PATH>")
			.replace(/(\[Edit\]) [^\n]+/g, "$1 <ABS_PATH>")
			.replace(/^(?!\[|\s{3}|----|\n$)[^\n]+\n?/gm, "")
			.replace(/\n+\[done\]/g, "\n\n[done]")
			.replace(/\n{2,}(?=\[(?!done\]))/g, "\n\n\n")
			.replace(/(model: <MODEL>\n)\n+(?=\[(?!done\]))/g, "$1\n\n\n")
	)
}

export function expected(body: string): string {
	return SESSION_HEADER + body + SESSION_FOOTER
}

export function expectedStream(body: string): string {
	return STREAM_SESSION_HEADER + body + SESSION_FOOTER
}

export function fixtureExists(path: string): boolean {
	return existsSync(path)
}

export function sessionPath(dir: string): string {
	return resolve(dir, "session.jsonl")
}

export function streamPath(dir: string): string {
	return resolve(dir, "stream.jsonl")
}

export function promptPath(dir: string): string {
	return resolve(dir, "prompt.md")
}
