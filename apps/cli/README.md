# @pretty-sessions/cli

CLI tool that parses AI coding agent streams and saved session files into readable, formatted output.

## Usage

```bash
# Claude Code stream
claude -p "explain this code" --print --verbose --dangerously-skip-permissions --output-format stream-json | pretty-sessions claude

# Claude Code saved session
cat ~/.claude/projects/.../session.jsonl | pretty-sessions claude

# Codex stream
codex exec "explain this code" --json | pretty-sessions codex

# Codex saved session
cat ~/.codex/sessions/.../session.jsonl | pretty-sessions codex

# Gemini stream
gemini -p "explain this code" --output-format stream-json | pretty-sessions gemini

# Gemini saved session
cat ~/.gemini/tmp/.../chats/session.jsonl | pretty-sessions gemini
```

## Providers

| Provider | Stream | Saved session |
|----------|--------|---------------|
| claude   | yes    | yes           |
| codex    | yes    | yes           |
| gemini   | yes    | yes           |

## Claude Code tools reference

| Tool name       | Interactive | Prompt (`-p`) | Handled |
|-----------------|-------------|---------------|---------|
| Read            | yes         | yes           | yes     |
| Write           | yes         | yes           | yes     |
| Edit            | yes         | yes           | yes     |
| MultiEdit       | yes         | yes           | yes     |
| Glob            | yes         | yes           | yes     |
| Grep            | yes         | yes           | yes     |
| Bash            | yes         | yes           | yes     |
| Agent           | yes         | yes           | yes     |
| NotebookEdit    | yes         | yes           | yes     |
| WebSearch       | yes         | yes           | yes     |
| WebFetch        | yes         | yes           | yes     |
| ToolSearch      | yes         | yes           | yes     |
| Skill           | yes         | yes           | yes     |
| TodoWrite       | yes         | yes           | yes     |
| TaskCreate      | yes         | no            | yes     |
| TaskGet         | yes         | no            | yes     |
| TaskList        | yes         | no            | yes     |
| TaskUpdate      | yes         | no            | yes     |
| TaskOutput      | yes         | yes           | yes     |
| TaskStop        | yes         | yes           | yes     |

# Maybe later 

| Tool name       | Interactive | Prompt (`-p`) | Handled |
|-----------------|-------------|---------------|---------|
| EnterPlanMode   | yes         | yes           | no      |
| ExitPlanMode    | yes         | yes           | no      |
|-----------------|-------------|---------------|---------|
| EnterWorktree   | yes         | yes           | no      |
| ExitWorktree    | yes         | yes           | no      |
|-----------------|-------------|---------------|---------|
| CronCreate      | yes         | yes           | no      |
| CronDelete      | yes         | yes           | no      |
| CronList        | yes         | yes           | no      |
|-----------------|-------------|---------------|---------|
| ScheduleWakeup  | yes         | yes           | no      |
| Monitor         | yes         | yes           | no      |
| LSP             | yes         | yes           | no      |
| RemoteTrigger   | yes         | yes           | no      |
| AskUserQuestion | yes         | yes           | no      |
