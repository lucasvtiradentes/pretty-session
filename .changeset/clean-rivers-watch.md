---
"pretty-session": minor
---

Restructure the CLI around verb-first commands.

Use `pts parse <provider>` for stdin parsing and `pts watch <provider> <path-or-session-id>` for following saved sessions. The root provider commands were removed, and watch mode can now resolve provider session ids to local session files.
