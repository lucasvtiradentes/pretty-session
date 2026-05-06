---
"pretty-session": patch
---

Render the codex `update_plan` / `todo_list` tool as a checklist. The rollout records `function_call` `name=update_plan` with `arguments {plan: [{step, status}]}` (status `pending` | `in_progress` | `completed`); `codex exec --json` emits `item.started` / `item.completed` with `type=todo_list` and `items: [{text, completed:boolean}]`. Both arrive at a new `renderPlan` primitive. Output is a `[Plan]` header followed by `[x]` / `[~]` / `[ ]` markers, matching the claude `todo-write` style. The stream collapses `in_progress` to `pending` because that level of detail is not exposed in the boolean form.
