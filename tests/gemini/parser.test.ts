import { describe, expect, it } from "vitest"
import { GeminiState, finalizeGemini, parseGeminiLine } from "../../src/providers/gemini"

const ansiPattern = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, "g")
const stripAnsi = (value: string) => value.replace(ansiPattern, "")

describe("gemini parser", () => {
	it("parses standard stream-json output", () => {
		const state = new GeminiState()
		let output = ""

		output += parseGeminiLine(
			JSON.stringify({
				type: "init",
				session_id: "session-1",
				model: "gemini-3-flash-preview",
			}),
			state,
		).getOutput()
		output += parseGeminiLine(
			JSON.stringify({
				type: "message",
				role: "assistant",
				content: "std-gemini-ok",
			}),
			state,
		).getOutput()
		output += parseGeminiLine(
			JSON.stringify({
				type: "result",
				stats: { input_tokens: 10, output_tokens: 3 },
			}),
			state,
		).getOutput()
		output += finalizeGemini(state).getOutput()

		expect(stripAnsi(output)).toContain("id:    session-1")
		expect(stripAnsi(output)).toContain("model: gemini-3-flash-preview")
		expect(stripAnsi(output)).toContain("std-gemini-ok")
		expect(stripAnsi(output)).toContain("[done] 1 turns, 10 in / 3 out")
	})

	it("parses ACP output forwarded by agent-session-kit", () => {
		const state = new GeminiState()
		let output = ""

		output += parseGeminiLine(
			JSON.stringify({
				jsonrpc: "2.0",
				id: 2,
				result: {
					sessionId: "session-2",
					models: { currentModelId: "gemini-3-flash-preview" },
				},
			}),
			state,
		).getOutput()
		output += parseGeminiLine(
			JSON.stringify({
				jsonrpc: "2.0",
				method: "session/update",
				params: {
					sessionId: "session-2",
					update: {
						sessionUpdate: "agent_message_chunk",
						content: { type: "text", text: "ask-gemini-ok" },
					},
				},
			}),
			state,
		).getOutput()
		output += parseGeminiLine(
			JSON.stringify({
				jsonrpc: "2.0",
				id: 3,
				result: {
					stopReason: "end_turn",
					_meta: {
						quota: {
							token_count: {
								input_tokens: 11,
								output_tokens: 4,
							},
						},
					},
				},
			}),
			state,
		).getOutput()
		output += finalizeGemini(state).getOutput()

		expect(stripAnsi(output)).toContain("id:    session-2")
		expect(stripAnsi(output)).toContain("model: gemini-3-flash-preview")
		expect(stripAnsi(output)).toContain("ask-gemini-ok")
		expect(stripAnsi(output)).toContain("[done] 1 turns, 11 in / 4 out")
	})
})
