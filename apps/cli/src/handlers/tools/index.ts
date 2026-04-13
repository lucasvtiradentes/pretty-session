import type { ParseResult, ParserState } from "../base"
import { handleBash } from "./bash"
import { handleEdit } from "./edit"
import { handleGlob } from "./glob"
import { handleGrep } from "./grep"
import { handleNotebook } from "./notebook"
import { handleRead } from "./read"
import { handleTask } from "./task"
import { handleTodo } from "./todo"
import { handleWrite } from "./write"

export function dispatchTool(name: string, inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	if (name === "TodoWrite") handleTodo(inp, state, result)
	else if (name === "Write") handleWrite(inp, state, result)
	else if (name === "Read") handleRead(inp, state, result)
	else if (name === "Glob") handleGlob(inp, state, result)
	else if (name === "Grep") handleGrep(inp, state, result)
	else if (name === "Edit" || name === "MultiEdit") handleEdit(name, inp, state, result)
	else if (name === "NotebookEdit") handleNotebook(inp, state, result)
	else if (name === "Bash") handleBash(inp, state, result)
	else if (name === "Task") handleTask(inp, state, result)
}
