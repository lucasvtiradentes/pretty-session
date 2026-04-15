# @pretty-sessions/cli

CLI tool that parses Claude Code session JSONL files into readable, formatted output.

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
| TodoWrite       | yes         | yes           | yes     |
| WebSearch       | yes         | yes           | yes     |
| WebFetch        | yes         | yes           | yes     |
| TaskCreate      | yes         | no            | yes     |
| TaskUpdate      | yes         | no            | yes     |
| TaskGet         | yes         | no            | yes     |

# Next

| Tool name       | Interactive | Prompt (`-p`) | Handled |
|-----------------|-------------|---------------|---------|
| TaskList        | yes         | no            | no      |
| ToolSearch      | yes         | yes           | no      |
| Skill           | yes         | yes           | no      |

# Maybe later 

| Tool name       | Interactive | Prompt (`-p`) | Handled |
|-----------------|-------------|---------------|---------|
| TaskOutput      | yes         | yes           | no      |
| TaskStop        | yes         | yes           | no      |
| ScheduleWakeup  | yes         | yes           | no      |
| Monitor         | yes         | yes           | no      |
| LSP             | yes         | yes           | no      |
| EnterPlanMode   | yes         | yes           | no      |
| ExitPlanMode    | yes         | yes           | no      |
| EnterWorktree   | yes         | yes           | no      |
| ExitWorktree    | yes         | yes           | no      |
| CronCreate      | yes         | yes           | no      |
| CronDelete      | yes         | yes           | no      |
| CronList        | yes         | yes           | no      |
| RemoteTrigger   | yes         | yes           | no      |
| AskUserQuestion | yes         | yes           | no      |
