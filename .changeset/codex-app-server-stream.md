---
"pretty-session": patch
---

Render tool calls and outputs from the codex `--app-server` live stream. Previously the JSON-RPC `item/started` and `item/completed` events were silently dropped because the parser only handled `item/agentMessage/delta`, `thread/tokenUsage/updated` and `turn/completed`. The same JSONL replayed via `cat` worked because rollout files use a different shape the parser already understood. Recognize `item/started` and `item/completed` and route them through the same `handleStreamItem` path as the `codex exec --json` (DOT-separated) stream, normalizing camelCase fields (`aggregatedOutput`, `exitCode`, `filePaths`) and item-type aliases (`commandExecution`, `agentMessage`, `patchApplication`, `fileChange`) at a single `ITEM_TYPE_ALIASES` table.
