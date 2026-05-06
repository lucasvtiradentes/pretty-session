---
"pretty-session": patch
---

Render codex collab tools (`spawn_agent` and `wait`) as `[Agent]` blocks. The rollout records the delegation as `function_call` `name=spawn_agent` with `arguments {agent_type, message, reasoning_effort}`. `codex exec --json` emits `item.started` / `item.completed` with `type=collab_tool_call` and `tool=spawn_agent` or `wait`; the wait completion exposes the subagent's reply via `agents_states[id].message`. Render `[Agent] (<agent_type>) <prompt-preview>` when the type is known and `[Agent] <prompt-preview>` otherwise, then surface the subagent reply as `→ <message>` through `renderToolOutput`. Long prompts truncate to the first 80 characters of the first line.
