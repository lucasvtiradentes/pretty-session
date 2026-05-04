export const SESSION_HEADER = `[session]
   id:    <UUID>
   path:  <CODEX_PATH>
   model: <MODEL>

`

export const SESSION_FOOTER = `[done] <N> turns, <N> in / <N> out
`

export const STREAM_SESSION_HEADER = `[session]
   id:    <UUID>
   path:  <CODEX_PATH>
   model: <MODEL>

`

export const EDIT_BODY = `

[Edit] <ABS_PATH>

`

export const MULTI_TURN_BODY = `

[Bash] echo "multi-turn test ok"
   → multi-turn test ok


[Edit] <ABS_PATH>

`

export const BASH_BODY = `

[Bash] echo "hello from codex test" && date
   → hello from codex test
   → <DATE>

`
