import { INDENT } from "../../../../constants"
import { TodoStatus, Tool } from "../../constants"
import type { ParseResult, ParserState } from "../base"

export function handleTodo(inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	result.add(`\n${state.sp}${r.yellow(`[${Tool.TodoWrite}]`)}\n`)
	const todos = (inp.todos as Array<Record<string, unknown>>) ?? []
	for (const todo of todos) {
		const status = (todo.status as string) ?? TodoStatus.Pending
		const text = (todo.content as string) ?? ""
		let mark: string
		if (status === TodoStatus.Completed) {
			mark = r.green("[x]")
		} else if (status === TodoStatus.InProgress) {
			mark = r.orange("[~]")
		} else {
			mark = r.dim("[ ]")
		}
		result.add(`${state.sp}${INDENT}${mark} ${text}\n`)
	}
	result.add("\n")
}
