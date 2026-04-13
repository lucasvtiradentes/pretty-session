import type { ParseResult, ParserState } from "../base.js"
import { handleBash } from "./bash.js"
import { handleEdit } from "./edit.js"
import { handleGlob } from "./glob.js"
import { handleGrep } from "./grep.js"
import { handleNotebook } from "./notebook.js"
import { handleRead } from "./read.js"
import { handleTask } from "./task.js"
import { handleTodo } from "./todo.js"
import { handleWrite } from "./write.js"

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
