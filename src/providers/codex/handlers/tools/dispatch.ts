import type { ParseResult } from "../../../../result"
import { CodexCustomTool, CodexFunctionTool, CodexItemType } from "../../constants"
import type { CodexState } from "../../state"
import { handleBash } from "./bash"
import { handleEdit } from "./edit"
import { handleStdin } from "./stdin"

type CodexToolHandler = (payload: Record<string, unknown>, state: CodexState, result: ParseResult) => void

const functionCallHandlers: Partial<Record<CodexFunctionTool, CodexToolHandler>> = {
	[CodexFunctionTool.ExecCommand]: handleBash,
	[CodexFunctionTool.WriteStdin]: handleStdin,
}

const customToolHandlers: Partial<Record<CodexCustomTool, CodexToolHandler>> = {
	[CodexCustomTool.ApplyPatch]: handleEdit,
}

const toolHandlersByItemType: Partial<Record<CodexItemType, Partial<Record<string, CodexToolHandler>>>> = {
	[CodexItemType.FunctionCall]: functionCallHandlers,
	[CodexItemType.CustomToolCall]: customToolHandlers,
}

export function dispatchTool(payload: Record<string, unknown>, state: CodexState, result: ParseResult) {
	const itemType = (payload.type as string) ?? ""
	const name = (payload.name as string) ?? ""

	const handlers = toolHandlersByItemType[itemType as CodexItemType]
	const handler = handlers?.[name]
	if (handler) handler(payload, state, result)
}
