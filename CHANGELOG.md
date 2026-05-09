# pretty-session

## 0.1.2

### Patch Changes

- 41b8aad: Update README docs and showcase images.

## 0.1.1

### Patch Changes

- 59ea7d1: Render inline code spans as bold text without inverse background styling.
- af3f93f: Render initial user prompts for Claude, Codex, and Gemini session parsing.
- 85a848a: Simplify environment configuration and use cross-platform home directory resolution.
- 9f59730: Render full user prompts instead of truncating them in parsed session output.
- 5b1dc27: Hide tool preview output lines by default while keeping tool headers visible.
- 83bebf2: Add a reusable provider-session GitHub Action and a manual showcase workflow for comparing raw provider streams with Pretty Session output.
- d891db1: Render the Claude replay done footer once when sessions contain repeated last-prompt records.

## 0.1.0

### Minor Changes

- f38f59e: Restructure the CLI around verb-first commands.

  Use `pts parse <provider>` for stdin parsing and `pts watch <provider> <path-or-session-id>` for following saved sessions. The root provider commands were removed, and watch mode can now resolve provider session ids to local session files.

- c69924d: Add `pts update` to update the globally installed package with the detected package manager.
- e9c8898: Rename formatting environment variables from `PS_*` to `PTS_*` and refresh README usage, completion, and configuration docs.

### Patch Changes

- 5b1f900: Keep development shell completions bound only to development binary names.

## 0.0.6

### Patch Changes

- 78e1570: Normalize Claude Write success output when newer Claude CLI versions append the file-state hint.

## 0.0.5

### Patch Changes

- f5f1408: Render tool calls and outputs from the codex `--app-server` live stream. Previously the JSON-RPC `item/started` and `item/completed` events were silently dropped because the parser only handled `item/agentMessage/delta`, `thread/tokenUsage/updated` and `turn/completed`. The same JSONL replayed via `cat` worked because rollout files use a different shape the parser already understood. Recognize `item/started` and `item/completed` and route them through the same `handleStreamItem` path as the `codex exec --json` (DOT-separated) stream, normalizing camelCase fields (`aggregatedOutput`, `exitCode`, `filePaths`) and item-type aliases (`commandExecution`, `agentMessage`, `patchApplication`, `fileChange`) at a single `ITEM_TYPE_ALIASES` table.
- f5f1408: Render the codex `update_plan` / `todo_list` tool as a checklist. The rollout records `function_call` `name=update_plan` with `arguments {plan: [{step, status}]}` (status `pending` | `in_progress` | `completed`); `codex exec --json` emits `item.started` / `item.completed` with `type=todo_list` and `items: [{text, completed:boolean}]`. Both arrive at a new `renderPlan` primitive. Output is a `[Plan]` header followed by `[x]` / `[~]` / `[ ]` markers, matching the claude `todo-write` style. The stream collapses `in_progress` to `pending` because that level of detail is not exposed in the boolean form.
- f5f1408: Render codex collab tools (`spawn_agent` and `wait`) as `[Agent]` blocks. The rollout records the delegation as `function_call` `name=spawn_agent` with `arguments {agent_type, message, reasoning_effort}`. `codex exec --json` emits `item.started` / `item.completed` with `type=collab_tool_call` and `tool=spawn_agent` or `wait`; the wait completion exposes the subagent's reply via `agents_states[id].message`. Render `[Agent] (<agent_type>) <prompt-preview>` when the type is known and `[Agent] <prompt-preview>` otherwise, then surface the subagent reply as `→ <message>` through `renderToolOutput`. Long prompts truncate to the first 80 characters of the first line.
- f5f1408: Render ACP tool calls in the gemini live stream. The `session/update` events with `sessionUpdate: "tool_call"` and `"tool_call_update"` carry `toolCallId`, `status`, `title` and `kind` (execute/read/edit/search/think/etc.) but were ignored by the parser. Map `kind` to a labeled, colored header (`execute` → `[Shell]` purple, `read` → `[Read]` purple, `edit` → `[Edit]` orange, `search` → `[Search]` purple, `think` → `[Think]` dim, `delete` and `move` → orange) and dedupe the `in_progress` + `completed` pair via a per-state set. Also unify the gemini render path so the saved JSONL, exec stream and ACP code paths share `renderAgentText`, `renderToolHeader`, `renderToolPreview` and `renderToolOutput` primitives, eliminating duplicated ANSI string construction across handlers.
- f5f1408: Render `tool_use` events from `gemini -p --output-format stream-json` and buffer assistant deltas until tool boundaries or turn end. Previously each delta was rendered immediately, so multi-line markdown tables that arrived across deltas never matched the table-formatter regex. Assistant text now accumulates in `streamingAssistantText` and flushes before tool blocks, on the `result` event, on ACP turn result, and in `finalize`. Adds `GeminiMessageType.ToolUse` and `ToolResult`, `GeminiTool.RunShellCommand`, a `tools/shell.ts` handler that prints `[Shell] <command>`, and a `dispatchStreamToolUse` adapter that maps `{tool_name, parameters}` to the existing rollout dispatcher so `read` / `write` / `search` / `topic` tools render through both the stream and saved-JSONL paths.

## 0.0.4

### Patch Changes

- 0cd6d72: Render Gemini saved-session tool calls with per-tool formatting: `[Read] {file}` with content preview, `[Write] {file}` with `+added -removed` line counts, `[Search] {pattern}` with match summary, and `[Topic] {title}` for the internal scratchpad. Falls back to the previous generic display for unknown tools.

## 0.0.3

### Patch Changes

- 8193760: Bind generated shell completions to both pretty-session and pts bins.

## 0.0.2

### Patch Changes

- da7dc7f: Add shell completion generation for providers, shells, and global flags.

## 0.0.1

### Patch Changes

- 73c04b8: Prepare package release automation and single-package repository layout.
