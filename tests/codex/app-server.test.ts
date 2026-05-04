import { describe, expect, it } from "vitest"
import { CodexState, finalizeCodex, parseCodexLine } from "../../src/providers/codex"

const ansiPattern = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, "g")
const stripAnsi = (value: string) => value.replace(ansiPattern, "")

describe("codex app-server parser", () => {
	it("parses app-server output forwarded by agent-session-kit", () => {
		const state = new CodexState()
		let output = ""

		output += parseCodexLine(
			JSON.stringify({
				id: 2,
				result: {
					thread: {
						id: "thread-1",
						path: "~/.codex/sessions/test.jsonl",
					},
					model: "gpt-5.5",
				},
			}),
			state,
		).getOutput()
		output += parseCodexLine(
			JSON.stringify({
				method: "item/agentMessage/delta",
				params: {
					delta: "ask-codex-ok",
				},
			}),
			state,
		).getOutput()
		output += parseCodexLine(
			JSON.stringify({
				method: "thread/tokenUsage/updated",
				params: {
					tokenUsage: {
						total: {
							inputTokens: 12,
							cachedInputTokens: 5,
							outputTokens: 6,
							reasoningOutputTokens: 2,
						},
					},
				},
			}),
			state,
		).getOutput()
		output += parseCodexLine(
			JSON.stringify({
				method: "turn/completed",
				params: {},
			}),
			state,
		).getOutput()
		output += finalizeCodex(state).getOutput()

		expect(stripAnsi(output)).toContain("id:    thread-1")
		expect(stripAnsi(output)).toContain("model: codex")
		expect(stripAnsi(output)).toContain("ask-codex-ok")
		expect(stripAnsi(output)).toContain("[done] 1 turns, 17 in / 8 out")
	})
})
