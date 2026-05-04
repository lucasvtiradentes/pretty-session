import { execSync } from "node:child_process"
import { dirname, resolve } from "node:path"
import { describe, expect, it } from "vitest"

const CLI_ROOT = resolve(dirname(new URL(import.meta.url).pathname), "..")
const CLI_PATH = resolve(CLI_ROOT, "src/cli.ts")

function runCli(args: string[]) {
	return execSync(`npx tsx ${CLI_PATH} ${args.join(" ")}`, {
		cwd: CLI_ROOT,
		encoding: "utf-8",
		timeout: 30_000,
	})
}

describe("completion", () => {
	it.each(["bash", "fish", "zsh"])("generates %s completion", (shell) => {
		const output = runCli(["completion", shell])

		expect(output).toContain("pretty-session")
		expect(output).toContain("claude")
		expect(output).toContain("codex")
		expect(output).toContain("gemini")
		expect(output).toContain("completion")
	})

	it("completes flags in zsh", () => {
		const output = runCli(["completion", "zsh"])

		expect(output).toContain("--help:Show help")
		expect(output).toContain("--version:Show version")
	})

	it("completes shells in bash", () => {
		const output = runCli(["completion", "bash"])

		expect(output).toContain('previous" == "completion"')
		expect(output).toContain("bash fish zsh")
	})
})
