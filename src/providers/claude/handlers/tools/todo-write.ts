import { INDENT } from "../../../../constants"
import type { Renderer } from "../../../../renderers/base"
import { TodoStatus, Tool } from "../../constants"
import type { ParseResult, ParserState } from "../base"

const todoMarkRenderers = {
	[TodoStatus.Completed]: (r: Renderer) => r.green("[x]"),
	[TodoStatus.InProgress]: (r: Renderer) => r.orange("[~]"),
	[TodoStatus.Pending]: (r: Renderer) => r.dim("[ ]"),
} as const satisfies Record<TodoStatus, (r: Renderer) => string>

export function handleTodo(inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	result.add(`\n${state.sp}${r.yellow(`[${Tool.TodoWrite}]`)}\n`)
	const todos = (inp.todos as Array<Record<string, unknown>>) ?? []
	for (const todo of todos) {
		const status = (todo.status as string) ?? TodoStatus.Pending
		const text = (todo.content as string) ?? ""
		const renderMark = todoMarkRenderers[status as TodoStatus] ?? todoMarkRenderers[TodoStatus.Pending]
		result.add(`${state.sp}${INDENT}${renderMark(r)} ${text}\n`)
	}
	result.add("\n")
}
