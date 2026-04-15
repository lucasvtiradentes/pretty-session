import type { ParseResult, ParserState } from "../base"
import { handleAgent } from "./agent"
import { handleBash } from "./bash"
import { handleEdit } from "./edit"
import { handleGlob } from "./glob"
import { handleGrep } from "./grep"
import { handleMultiEdit } from "./multi-edit"
import { handleNotebook } from "./notebook-edit"
import { handleRead } from "./read"
import { handleTaskCreate } from "./task-create"
import { handleTaskUpdate } from "./task-update"
import { handleTodo } from "./todo-write"
import { handleWebFetch } from "./web-fetch"
import { handleWebSearch } from "./web-search"
import { handleWrite } from "./write"

export function dispatchTool(name: string, inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	if (name === "TodoWrite") handleTodo(inp, state, result)
	else if (name === "Write") handleWrite(inp, state, result)
	else if (name === "Read") handleRead(inp, state, result)
	else if (name === "Glob") handleGlob(inp, state, result)
	else if (name === "Grep") handleGrep(inp, state, result)
	else if (name === "Edit") handleEdit(inp, state, result)
	else if (name === "MultiEdit") handleMultiEdit(inp, state, result)
	else if (name === "NotebookEdit") handleNotebook(inp, state, result)
	else if (name === "Bash") handleBash(inp, state, result)
	else if (name === "TaskCreate") handleTaskCreate(inp, state, result)
	else if (name === "TaskUpdate") handleTaskUpdate(inp, state, result)
	else if (name === "WebFetch") handleWebFetch(inp, state, result)
	else if (name === "WebSearch") handleWebSearch(inp, state, result)
	else if (name === "Agent") handleAgent(inp, state, result)
}
