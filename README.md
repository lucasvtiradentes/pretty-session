# pretty-sessions

Pretty formatter for AI coding agent sessions. Pipe any provider's output and get a readable, colorized view. Works with Claude Code, Codex, Gemini, and more.

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
# stream from claude in real-time
claude -p "explain this code" --print --verbose --dangerously-skip-permissions --output-format stream-json --include-partial-messages | ps claude

# replay a saved session
cat ~/.claude/projects/.../session.jsonl | ps claude
```

## Providers

| Provider | Status |
|----------|--------|
| claude   | supported |
| codex    | planned |
| gemini   | planned |

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
