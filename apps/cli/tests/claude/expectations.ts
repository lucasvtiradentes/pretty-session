export const SESSION_HEADER = `[session]
   id:    <UUID>
   path:  ~/.claude/projects/<CWD>/<UUID>.jsonl
   model: <MODEL>

`

export const SESSION_FOOTER = `[done] <DURATION>s, $<COST>, <N> turns, <N> in / <N> out
`

export const GLOB_BODY = `
[Glob] **<PATH>.ts
   → No files found

`

export const BASH_BODY = `
[Bash] echo "hello from bash test" && date
   → hello from bash test
   → <DATE>

`

export const READ_BODY = `
[Bash] echo -n "read tool works" > tmp-read-test.txt


[Read] <ABS_PATH>
   → <N>\tread tool works

`

export const WRITE_BODY = `
[Write] <ABS_PATH>
   → File created successfully at: <ABS_PATH>

`

export const EDIT_BODY = `
[Write] <ABS_PATH>
   → File created successfully at: <ABS_PATH>


[Edit] <ABS_PATH>

`

export const GREP_BODY = `
[Grep] "version"
   → No matches found

`

export const TODO_BODY = `
[Todo]
   [x] step one
   [~] step two
   [ ] step three

   → Todos have been modified successfully. Ensure that you continue to use the todo list to track your progress. Please proceed with the current tasks if applicable

`

export const NOTEBOOK_BODY = `
[Bash] echo '{"cells":[],"metadata":{},"nbformat":4,"nbformat_minor":5}' > tmp-notebook-test.ipynb


[NotebookEdit] <ABS_PATH>
   ✗ File has not been read yet. Read it first before writing to it.


[Read] <ABS_PATH>
   → (Read completed with no output)


[NotebookEdit] <ABS_PATH>
   → Inserted cell <HEX> with print("test")

`

export const AGENT_BODY = `
[Agent] "test subagent" (general-purpose)
   echo hello from subagent

`
