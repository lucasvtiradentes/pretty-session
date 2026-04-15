import { execSync } from "node:child_process"
import { copyFileSync, existsSync, readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { SESSION_FOOTER, SESSION_HEADER } from "./expectations"

const CLI_ROOT = resolve(dirname(new URL(import.meta.url).pathname), "../..")
const SANDBOX_DIR = resolve(CLI_ROOT, "../../.sandbox")
const HOME = process.env.HOME ?? ""

export function replayFixture(fixturePath: string): string {
	const output = execSync(`cat ${fixturePath} | pnpm --filter @pretty-sessions/cli dev claude`, {
		encoding: "utf-8",
		timeout: 30_000,
		cwd: CLI_ROOT,
	})
	return stripPnpmBanner(output)
}

export function runE2E(promptPath: string, dir: string): string {
	const prompt = readFileSync(promptPath, "utf-8").trim()
	const escapedPrompt = prompt.replace(/"/g, '\\"')
	const streamFile = resolve(dir, "stream.jsonl")

	execSync(`rm -rf ${SANDBOX_DIR} && mkdir -p ${SANDBOX_DIR}`)

	const output = execSync(
		`cd ${SANDBOX_DIR} && claude -p "${escapedPrompt}" --verbose --output-format stream-json --dangerously-skip-permissions | tee ${streamFile} | pnpm --filter @pretty-sessions/cli dev claude`,
		{ encoding: "utf-8", timeout: 120_000, cwd: CLI_ROOT },
	)

	const cleaned = stripPnpmBanner(output)

	const sessionSrc = extractSessionPath(cleaned)
	if (sessionSrc) copyFileSync(sessionSrc, resolve(dir, "session.jsonl"))

	return cleaned
}

function extractSessionPath(output: string): string | null {
	// biome-ignore lint/suspicious/noControlCharactersInRegex: stripping ANSI escape codes
	const clean = output.replace(/\x1b\[[0-9;]*m/g, "")
	const match = clean.match(/path:\s+(~\/\.claude\/[^\s]+\.jsonl)/)
	if (!match) return null
	return match[1].replace("~", HOME)
}

function stripPnpmBanner(output: string): string {
	// biome-ignore lint/suspicious/noControlCharactersInRegex: matching ANSI escape codes
	const marker = output.search(/(\x1b\[\d+m)?\[session\]/)
	if (marker === -1) return output
	return output.slice(marker)
}

export function sanitize(output: string): string {
	return (
		output
			// biome-ignore lint/suspicious/noControlCharactersInRegex: stripping ANSI escape codes
			.replace(/\x1b\[[0-9;]*m/g, "")
			.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g, "<UUID>")
			.replace(/~\/\.claude\/projects\/[^\s]+\.jsonl/g, "~/.claude/projects/<CWD>/<UUID>.jsonl")
			.replace(/model: \w+/g, "model: <MODEL>")
			.replace(/\d+\.\d+s/g, "<DURATION>s")
			.replace(/\$[\d.]+/g, "$<COST>")
			.replace(/\d+ turns/g, "<N> turns")
			.replace(/\d+ in \/ \d+ out/g, "<N> in / <N> out")
			.replace(/\[rerun: b\d+\]/g, "")
			.replace(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun) \w+ \d+ [\d:]+ [+-]?\w+ \d+/g, "<DATE>")
			.replace(/\b[0-9a-f]{8}\b/g, "<HEX>")
			.replace(/\/Users\/[^\s]+/g, "<ABS_PATH>")
			.replace(/\/[^\s]+\.txt/g, "<PATH>.txt")
			.replace(/\/[^\s]+\.ipynb/g, "<PATH>.ipynb")
			.replace(/\/[^\s]+\.json\b/g, "<PATH>.json")
			.replace(/\/[^\s]+\.ts\b/g, "<PATH>.ts")
			.replace(/\d+\t/g, "<N>\t")
			.replace(/→ \n/g, "→\n")
			.replace(/^(?!\[|\s{3}|\n$)[^\n]+\n?/gm, "")
	)
}

export function expected(body: string): string {
	return SESSION_HEADER + body + SESSION_FOOTER
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
