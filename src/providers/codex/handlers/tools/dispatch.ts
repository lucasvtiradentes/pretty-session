import type { ParseResult } from "../../../../result"
import { CodexCustomTool, CodexFunctionTool, CodexItemType } from "../../constants"
import type { CodexState } from "../../state"
import { handleBash } from "./bash"
import { handleEdit } from "./edit"
import { handleStdin } from "./stdin"

export function dispatchTool(payload: Record<string, unknown>, state: CodexState, result: ParseResult) {
	const itemType = (payload.type as string) ?? ""
	const name = (payload.name as string) ?? ""

	if (itemType === CodexItemType.FunctionCall) {
		if (name === CodexFunctionTool.ExecCommand) handleBash(payload, state, result)
		else if (name === CodexFunctionTool.WriteStdin) handleStdin(payload, state, result)
	} else if (itemType === CodexItemType.CustomToolCall) {
		if (name === CodexCustomTool.ApplyPatch) handleEdit(payload, state, result)
	}
}
