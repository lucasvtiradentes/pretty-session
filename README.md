# pretty-sessions

Pretty formatter for AI coding agent sessions - stream in real-time or replay saved .jsonl files. Works with Claude Code, Codex, Gemini, and more.

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

- stream mode    - run claude with pretty output in real-time
- replay mode    - replay saved .jsonl session files
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
# stream - run claude with pretty output (all args forwarded to claude)
pretty-sessions stream -p "explain this code"
pretty-sessions stream -p "fix the bug" --model sonnet --max-turns 3
pretty-sessions stream --resume

# show - replay a saved session in terminal
pretty-sessions show ~/.claude/projects/.../session.jsonl
```

Stream mode adds these flags automatically:
```
--print --verbose --dangerously-skip-permissions --output-format stream-json --include-partial-messages
```

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
