---
"pretty-session": patch
---

Render `tool_use` events from `gemini -p --output-format stream-json` and buffer assistant deltas until tool boundaries or turn end. Previously each delta was rendered immediately, so multi-line markdown tables that arrived across deltas never matched the table-formatter regex. Assistant text now accumulates in `streamingAssistantText` and flushes before tool blocks, on the `result` event, on ACP turn result, and in `finalize`. Adds `GeminiMessageType.ToolUse` and `ToolResult`, `GeminiTool.RunShellCommand`, a `tools/shell.ts` handler that prints `[Shell] <command>`, and a `dispatchStreamToolUse` adapter that maps `{tool_name, parameters}` to the existing rollout dispatcher so `read` / `write` / `search` / `topic` tools render through both the stream and saved-JSONL paths.
