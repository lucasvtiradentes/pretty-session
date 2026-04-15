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
[bash] echo -n "read tool works" > tmp-read-test.txt


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
[todo-write]
   [x] step one
   [~] step two
   [ ] step three

   → Todos have been modified successfully. Ensure that you continue to use the todo list to track your progress. Please proceed with the current tasks if applicable

`

export const NOTEBOOK_EDIT_BODY = `
[bash] echo '{"cells":[],"metadata":{},"nbformat":4,"nbformat_minor":5}' > tmp-notebook-test.ipynb


[notebook-edit] <ABS_PATH>
   ✗ File has not been read yet. Read it first before writing to it.


[read] <ABS_PATH>
   → (Read completed with no output)


[notebook-edit] <ABS_PATH>
   → Inserted cell <HEX> with print("test")

`

export const TASK_CREATE_BODY = `
[task-create] "Fix login bug"

`

export const TASK_UPDATE_BODY = `
[task-update] #1 → completed

`

export const AGENT_BODY = `
[agent] "test subagent" (general-purpose)
   echo hello from subagent

`
