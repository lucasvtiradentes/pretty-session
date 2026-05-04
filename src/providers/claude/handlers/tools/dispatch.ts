import type { ParseResult } from "../../../../lib/result"
import { Tool } from "../../constants"
import type { ParserState } from "../../state"
import { handleAgent } from "./agent"
import { handleBash } from "./bash"
import { handleEdit } from "./edit"
import { handleGlob } from "./glob"
import { handleGrep } from "./grep"
import { handleMultiEdit } from "./multi-edit"
import { handleNotebook } from "./notebook-edit"
import { handleRead } from "./read"
import { handleSkill } from "./skill"
import { handleTaskCreate } from "./task-create"
import { handleTaskGet } from "./task-get"
import { handleTaskList } from "./task-list"
import { handleTaskOutput } from "./task-output"
import { handleTaskStop } from "./task-stop"
import { handleTaskUpdate } from "./task-update"
import { handleTodo } from "./todo-write"
import { handleToolSearch } from "./tool-search"
import { handleWebFetch } from "./web-fetch"
import { handleWebSearch } from "./web-search"
import { handleWrite } from "./write"

type ToolHandler = (inp: Record<string, unknown>, state: ParserState, result: ParseResult) => void

const toolHandlers = {
	[Tool.TodoWrite]: handleTodo,
	[Tool.Write]: handleWrite,
	[Tool.Read]: handleRead,
	[Tool.Glob]: handleGlob,
	[Tool.Grep]: handleGrep,
	[Tool.Edit]: handleEdit,
	[Tool.MultiEdit]: handleMultiEdit,
	[Tool.NotebookEdit]: handleNotebook,
	[Tool.Bash]: handleBash,
	[Tool.TaskGet]: handleTaskGet,
	[Tool.TaskList]: handleTaskList,
	[Tool.TaskCreate]: handleTaskCreate,
	[Tool.TaskUpdate]: handleTaskUpdate,
	[Tool.TaskOutput]: handleTaskOutput,
	[Tool.TaskStop]: handleTaskStop,
	[Tool.WebFetch]: handleWebFetch,
	[Tool.WebSearch]: handleWebSearch,
	[Tool.ToolSearch]: handleToolSearch,
	[Tool.Skill]: handleSkill,
	[Tool.Agent]: handleAgent,
} as const satisfies Record<Tool, ToolHandler>

export function dispatchTool(name: string, inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const handler = (toolHandlers as Record<string, ToolHandler>)[name]
	if (handler) handler(inp, state, result)
}
