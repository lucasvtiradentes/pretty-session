import { execSync } from "node:child_process"
import { existsSync } from "node:fs"
import { dirname, resolve } from "node:path"

const CLI_ROOT = resolve(dirname(new URL(import.meta.url).pathname), "../..")
const CLI_PATH = resolve(CLI_ROOT, "src/cli.ts")
const TEST_ENV = { ...process.env, PS_TOOL_RESULT_MAX_CHARS: "300", PS_READ_PREVIEW_LINES: "5" }

const ansiPattern = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, "g")
export const stripAnsi = (value: string) => value.replace(ansiPattern, "")

export function replayFixture(fixturePath: string): string {
	return execSync(`npx tsx ${CLI_PATH} gemini < ${fixturePath}`, {
		encoding: "utf-8",
		timeout: 30_000,
		cwd: CLI_ROOT,
		env: TEST_ENV,
	})
}

export function runE2E(prompt: string): string {
	const escapedPrompt = prompt.replace(/"/g, '\\"')
	return execSync(
		`gemini -p "${escapedPrompt}" --yolo --output-format stream-json 2>/dev/null | npx tsx ${CLI_PATH} gemini`,
		{
			encoding: "utf-8",
			timeout: 120_000,
			cwd: CLI_ROOT,
			env: TEST_ENV,
		},
	)
}

export function sanitize(output: string): string {
	return stripAnsi(output)
		.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g, "<UUID>")
		.replace(/model: [\w.-]*/g, "model: <MODEL>")
		.replace(/\d+ turns/g, "<N> turns")
		.replace(/\d+ in \/ \d+ out/g, "<N> in / <N> out")
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

export function expected(body: string): string {
	return `[session]
   id:    <UUID>
   model: <MODEL>

${body}

[done] <N> turns, <N> in / <N> out
`
}
