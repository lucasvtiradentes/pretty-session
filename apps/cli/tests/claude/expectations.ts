import { Tool } from "../../src/constants"

export const SESSION_HEADER = `[session]
   id:    <UUID>
   path:  ~/.claude/projects/<CWD>/<UUID>.jsonl
   model: <MODEL>

`

export const SESSION_FOOTER = `[done] <DURATION>s, $<COST>, <N> turns, <N> in / <N> out
`

export const GLOB_BODY = `
[${Tool.Glob}] **<PATH>.ts
   → No files found

`

export const BASH_BODY = `
[${Tool.Bash}] echo "hello from bash test" && date
   → hello from bash test
   → <DATE>

`

export const READ_BODY = `
[${Tool.Bash}] echo -n "read tool works" > <ABS_PATH>

[${Tool.Read}] <ABS_PATH>
   → <N>\tread tool works

`

export const WRITE_BODY = `
[${Tool.Write}] <ABS_PATH>
   → File created successfully at: <ABS_PATH>

`

export const EDIT_BODY = `
[${Tool.Write}] <ABS_PATH>
   → File created successfully at: <ABS_PATH>

[${Tool.Edit}] <ABS_PATH>

`

export const GREP_BODY = `
[${Tool.Grep}] "version"
   → No matches found

`

export const TODO_WRITE_BODY = `
[${Tool.ToolSearch}] "select:TodoWrite"

[${Tool.TodoWrite}]
   [x] step one
   [~] step two
   [ ] step three

   → Todos have been modified successfully. Ensure that you continue to use the todo list to track your progress. Please proceed with the current tasks if applicable

`

export const TASK_CREATE_BODY = `
[${Tool.TaskCreate}] "Fix login bug"

[${Tool.TaskCreate}] "Add dark mode"
   → Task #1 created successfully: Add dark mode
   → Task #2 created successfully: Fix login bug

`

export const TASK_LIST_BODY = `
[${Tool.TaskList}]
   → #1 [pending] Add dark mode
   → #2 [pending] Fix login bug

`

export const TASK_GET_BODY = `
[${Tool.TaskGet}] #1
   → Task #1: Add dark mode
   → Status: pending
   → Description: Implement dark mode toggle

`

export const TASK_UPDATE_BODY = `
[${Tool.TaskUpdate}] #1 → completed
   → Updated task #1 status

`

export const TASK_OUTPUT_BODY = `
[${Tool.TaskOutput}] #1 (non-blocking)
   ✗ No task found with ID: 1

`

export const TASK_STOP_BODY = `
[${Tool.TaskStop}] #2
   ✗ No task found with ID: 2

`

export const TOOL_SEARCH_BODY = `
[${Tool.ToolSearch}] "select:WebFetch"

`

export const SKILL_BODY = `
[${Tool.Skill}] simple-skill
   → Launching skill: simple-skill

`

export const AGENT_BODY = `
[${Tool.Agent}] "test subagent" (general-purpose)
   echo hello from subagent

`

export const TABLE_ROWS = [
	"| Name  | Age | City |",
	"|-------|-----|------|",
	"| Alice | 30  | NYC  |",
	"| Bob   | 7   | LA   |",
]
