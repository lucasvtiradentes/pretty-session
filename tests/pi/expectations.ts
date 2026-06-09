export const SESSION_HEADER = `[session]
   id:    <ID>
   cwd:   <CWD>
   model: <MODEL>

----

`

export const SESSION_FOOTER = `[done] <N> turns, <N> in / <N> out
`

export const BASH_BODY = `
[bash] echo PTS_PI_BASH_OK
   → PTS_PI_BASH_OK

PTS_PI_BASH_OK

`

export const READ_BODY = `
[read] package.json
   → {"name":"pi-read-fixture","version":"1.0.0"}

{"name":"pi-read-fixture","version":"1.0.0"}

`

export const WRITE_BODY = `
[write] created.txt
   → Successfully wrote <N> bytes to created.txt

`

export const EDIT_BODY = `
[write] edit-target.txt
   → Successfully wrote <N> bytes to edit-target.txt

[edit] edit-target.txt
   → Successfully replaced 1 block(s) in edit-target.txt.

Done

`

export const TABLE_BODY = `
| Name  | Value |
|-------|-------|
| Alpha | 1     |
| Beta  | 2     |

`
