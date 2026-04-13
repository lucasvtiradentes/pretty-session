import { describe, expect, it } from "vitest"
import { ParserState } from "../src/handlers/base"
import { parseJsonLine } from "../src/parser"

describe("parser", () => {
	it("parses system init", () => {
		const state = new ParserState("stream")
		const line = JSON.stringify({
			type: "system",
			subtype: "init",
			session_id: "abc-123",
			cwd: "/Users/test/project",
			model: "claude-sonnet-4-20250514",
		})
		const output = parseJsonLine(line, state).getOutput()

		expect(output).toContain("[session]")
		expect(output).toContain("abc-123")
		expect(output).toContain("sonnet")
	})

	it("parses tool_use Glob", () => {
		const state = new ParserState("stream")
		const line = JSON.stringify({
			type: "assistant",
			message: {
				content: [{ type: "tool_use", name: "Glob", input: { pattern: "*.py" } }],
			},
		})
		const output = parseJsonLine(line, state).getOutput()

		expect(output).toContain("[Glob]")
		expect(output).toContain("*.py")
	})

	it("parses tool_use Bash", () => {
		const state = new ParserState("stream")
		const line = JSON.stringify({
			type: "assistant",
			message: {
				content: [{ type: "tool_use", name: "Bash", input: { command: "echo hello" } }],
			},
		})
		const output = parseJsonLine(line, state).getOutput()

		expect(output).toContain("[Bash]")
		expect(output).toContain("echo hello")
	})

	it("parses TodoWrite", () => {
		const state = new ParserState("stream")
		const line = JSON.stringify({
			type: "assistant",
			message: {
				content: [
					{
						type: "tool_use",
						name: "TodoWrite",
						input: {
							todos: [
								{ status: "completed", content: "item one" },
								{ status: "in_progress", content: "item two" },
								{ status: "pending", content: "item three" },
							],
						},
					},
				],
			},
		})
		const output = parseJsonLine(line, state).getOutput()

		expect(output).toContain("[Todo]")
		expect(output).toContain("item one")
		expect(output).toContain("item two")
		expect(output).toContain("item three")
	})

	it("parses result", () => {
		const state = new ParserState("stream")
		const line = JSON.stringify({
			type: "result",
			is_error: false,
			duration_ms: 5000,
			total_cost_usd: 0.05,
			num_turns: 3,
			usage: { input_tokens: 1000, output_tokens: 500 },
		})
		const output = parseJsonLine(line, state).getOutput()

		expect(output).toContain("[done]")
		expect(output).toContain("5.0s")
		expect(output).toContain("$0.0500")
		expect(output).toContain("3 turns")
	})

	it("increments depth on Task", () => {
		const state = new ParserState("stream")
		const line = JSON.stringify({
			type: "assistant",
			message: {
				content: [{ type: "tool_use", name: "Task", input: { prompt: "do something", model: "sonnet" } }],
			},
		})
		parseJsonLine(line, state)

		expect(state.subagentDepth).toBe(1)
		expect(state.sp).toContain("│")
	})

	it("shows user prompt in replay mode", () => {
		const state = new ParserState("replay")
		const line = JSON.stringify({
			type: "user",
			message: { content: "Hello, can you help me?" },
		})
		const output = parseJsonLine(line, state).getOutput()

		expect(output).toContain("[user]")
		expect(output).toContain("Hello")
	})

	it("shows assistant text in replay mode", () => {
		const state = new ParserState("replay")
		const line = JSON.stringify({
			type: "assistant",
			message: {
				content: [{ type: "text", text: "Sure, I can help!" }],
			},
		})
		const output = parseJsonLine(line, state).getOutput()

		expect(output).toContain("Sure, I can help!")
	})
})
