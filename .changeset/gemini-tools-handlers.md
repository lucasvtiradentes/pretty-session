---
"pretty-session": patch
---

Render Gemini saved-session tool calls with per-tool formatting: `[Read] {file}` with content preview, `[Write] {file}` with `+added -removed` line counts, `[Search] {pattern}` with match summary, and `[Topic] {title}` for the internal scratchpad. Falls back to the previous generic display for unknown tools.
