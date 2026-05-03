# pretty-sessions

Pretty formatter for AI coding agent sessions. Pipe provider output or saved session files and get a readable, colorized view.

<table align="center">
  <tr>
    <th>without pretty-sessions</th>
    <th>with pretty-sessions</th>
  </tr>
  <tr>
    <td><img src="https://cdn.jsdelivr.net/gh/lucasvtiradentes/pretty-sessions@main/.github/images/without-using.png" width="400"></td>
    <td><img src="https://cdn.jsdelivr.net/gh/lucasvtiradentes/pretty-sessions@main/.github/images/demo.png" width="400"></td>
  </tr>
</table>

## Features

- pipe-based     - works with any provider via stdin
- tool display   - formatted output for Glob, Grep, Bash, Read, Edit, etc.
- markdown       - renders bold and code with ANSI styles
- subagent depth - visual indentation for nested Task calls
- cost tracking  - shows duration, cost, tokens per session

## Installation

```bash
npm install -g @pretty-sessions/cli
```

Aliases: `pretty-sessions`, `ps`

## Usage

```bash
# Claude Code stream
claude -p "explain this code" --print --verbose --dangerously-skip-permissions --output-format stream-json | ps claude

# Claude Code saved session
cat ~/.claude/projects/.../session.jsonl | ps claude

# Codex stream
codex exec "explain this code" --json | ps codex

# Codex saved session
cat ~/.codex/sessions/.../session.jsonl | ps codex

# Gemini stream
gemini -p "explain this code" --output-format stream-json | ps gemini

# Gemini saved session
cat ~/.gemini/tmp/.../chats/session.jsonl | ps gemini
```

## Providers

| Provider | Stream | Saved session |
|----------|--------|---------------|
| claude   | yes    | yes           |
| codex    | yes    | yes           |
| gemini   | yes    | yes           |

## Environment

| Variable                 | Default | Description                         |
|--------------------------|---------|-------------------------------------|
| PS_TOOL_RESULT_MAX_CHARS | 300     | Max chars for tool results (0=hide) |
| PS_READ_PREVIEW_LINES    | 5       | Lines to preview from Read (0=hide) |

## Monorepo structure

```
pretty-sessions/
├── apps/cli              CLI tool (TypeScript)
├── apps/vscode-extension  VSCode extension (planned)
└── packages/core          Shared core (planned)
```

## Development

```bash
pnpm install
pnpm turbo build
pnpm turbo test
pnpm lint
pnpm knip
```

## License

MIT
