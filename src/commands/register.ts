import type { Program } from "@caporal/core"
import { registerClaudeCommand } from "./claude"
import { registerCodexCommand } from "./codex"
import { registerCompletionCommand } from "./completion/register"
import { registerGeminiCommand } from "./gemini"

export function registerCommands(program: Program) {
	registerClaudeCommand(program)
	registerCodexCommand(program)
	registerGeminiCommand(program)
	registerCompletionCommand(program)
}
