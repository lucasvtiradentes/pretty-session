export const SESSION_HEADER = `[session]
   id:    <UUID>
   path:  ~/.claude/projects/<CWD>/<UUID>.jsonl
   model: <MODEL>

`

export const SESSION_FOOTER = `[done] <DURATION>s, $<COST>, <N> turns, <N> in / <N> out
`

export const GLOB_BODY = `
[glob] **<PATH>.ts
   → No files found

`

export const BASH_BODY = `
[bash] echo "hello from bash test" && date
   → hello from bash test
   → <DATE>

`

export const READ_BODY = `
[bash] echo -n "read tool works" > <ABS_PATH>


[read] <ABS_PATH>
   → <N>\tread tool works

`

export const WRITE_BODY = `
[write] <ABS_PATH>
   → File created successfully at: <ABS_PATH>

`

export const EDIT_BODY = `
[write] <ABS_PATH>
   → File created successfully at: <ABS_PATH>


[edit] <ABS_PATH>

`

export const GREP_BODY = `
[grep] "version"
   → No matches found

`

export const TODO_WRITE_BODY = `
[tool-search] "select:TodoWrite"

[todo-write]
   [x] step one
   [~] step two
   [ ] step three

   → Todos have been modified successfully. Ensure that you continue to use the todo list to track your progress. Please proceed with the current tasks if applicable

`

export const TASK_CREATE_BODY = `
[task-create] "Fix login bug"

[task-create] "Add dark mode"
   → Task #1 created successfully: Add dark mode

   → Task #2 created successfully: Fix login bug

`

export const TASK_LIST_BODY = `
[task-list]
   → #1 [pending] Add dark mode
   → #2 [pending] Fix login bug

`

export const TASK_GET_BODY = `
[task-get] #1
   → Task #1: Add dark mode
   → Status: pending
   → Description: Implement dark mode toggle

`

export const TASK_UPDATE_BODY = `
[task-update] #1 → completed
   → Updated task #1 status

`

export const TOOL_SEARCH_BODY = `
[tool-search] "select:WebFetch"

`

export const SKILL_BODY = `
[skill] simple-skill
   → Launching skill: simple-skill

`

export const AGENT_BODY = `
[agent] "test subagent" (general-purpose)
   echo hello from subagent

`
