import { Tool } from "../../constants"
import type { ParseResult, ParserState } from "../base"
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

export function dispatchTool(name: string, inp: Record<string, unknown>, state: ParserState, result: ParseResult) {
	if (name === Tool.TodoWrite) handleTodo(inp, state, result)
	else if (name === Tool.Write) handleWrite(inp, state, result)
	else if (name === Tool.Read) handleRead(inp, state, result)
	else if (name === Tool.Glob) handleGlob(inp, state, result)
	else if (name === Tool.Grep) handleGrep(inp, state, result)
	else if (name === Tool.Edit) handleEdit(inp, state, result)
	else if (name === Tool.MultiEdit) handleMultiEdit(inp, state, result)
	else if (name === Tool.NotebookEdit) handleNotebook(inp, state, result)
	else if (name === Tool.Bash) handleBash(inp, state, result)
	else if (name === Tool.TaskGet) handleTaskGet(inp, state, result)
	else if (name === Tool.TaskList) handleTaskList(inp, state, result)
	else if (name === Tool.TaskCreate) handleTaskCreate(inp, state, result)
	else if (name === Tool.TaskUpdate) handleTaskUpdate(inp, state, result)
	else if (name === Tool.TaskOutput) handleTaskOutput(inp, state, result)
	else if (name === Tool.TaskStop) handleTaskStop(inp, state, result)
	else if (name === Tool.WebFetch) handleWebFetch(inp, state, result)
	else if (name === Tool.WebSearch) handleWebSearch(inp, state, result)
	else if (name === Tool.ToolSearch) handleToolSearch(inp, state, result)
	else if (name === Tool.Skill) handleSkill(inp, state, result)
	else if (name === Tool.Agent) handleAgent(inp, state, result)
}
