---
"pretty-session": patch
---

Render ACP tool calls in the gemini live stream. The `session/update` events with `sessionUpdate: "tool_call"` and `"tool_call_update"` carry `toolCallId`, `status`, `title` and `kind` (execute/read/edit/search/think/etc.) but were ignored by the parser. Map `kind` to a labeled, colored header (`execute` → `[Shell]` purple, `read` → `[Read]` purple, `edit` → `[Edit]` orange, `search` → `[Search]` purple, `think` → `[Think]` dim, `delete` and `move` → orange) and dedupe the `in_progress` + `completed` pair via a per-state set. Also unify the gemini render path so the saved JSONL, exec stream and ACP code paths share `renderAgentText`, `renderToolHeader`, `renderToolPreview` and `renderToolOutput` primitives, eliminating duplicated ANSI string construction across handlers.
