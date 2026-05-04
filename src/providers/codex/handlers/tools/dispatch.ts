import type { ParseResult } from "../../../../result"
import type { CodexState } from "../../state"
import { handleBash } from "./bash"
import { handleEdit } from "./edit"
import { handleStdin } from "./stdin"

export function dispatchTool(payload: Record<string, unknown>, state: CodexState, result: ParseResult) {
	const itemType = (payload.type as string) ?? ""
	const name = (payload.name as string) ?? ""

	if (itemType === "function_call") {
		if (name === "exec_command") handleBash(payload, state, result)
		else if (name === "write_stdin") handleStdin(payload, state, result)
	} else if (itemType === "custom_tool_call") {
		if (name === "apply_patch") handleEdit(payload, state, result)
	}
}
