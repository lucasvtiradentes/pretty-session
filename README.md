<a name="TOC"></a>

<div align="center">
  <!-- <DYNFIELD:HEADER_LOGO> -->
  <div>Pretty Session</div>
  <!-- </DYNFIELD:HEADER_LOGO> -->
  <br />
  <a href="#-overview">Overview</a> • <a href="#-motivation">Motivation</a> • <a href="#-features">Features</a> • <a href="#-quick-start">Quick Start</a> • <a href="#-commands">Commands</a> • <a href="#-configuration">Configuration</a> • <a href="#-license">License</a>
</div>

<!-- <DYNFIELD:TOP_DIVIDER> -->
<div width="100%" align="center">
  <img src="https://cdn.jsdelivr.net/gh/lucasvtiradentes/pretty-session@main/.github/image/divider.png" />
</div>
<!-- </DYNFIELD:TOP_DIVIDER> -->

## 🎺 Overview

Pretty Session is a small CLI that formats AI coding agent streams and saved session files into readable terminal output.

## ❓ Motivation

Claude Code, Codex, and Gemini store useful session data as JSONL or stream JSON events. That format is good for machines, but bad for quick human review. This is especially useful when AI coding agents run in CI/CD and you want readable progress instead of raw JSONL logs. Pretty Session keeps provider parsing separate and renders the same session in a cleaner, readable view.

## ⭐ Features

- Pipe-based formatter for provider streams and saved sessions
- Claude Code, Codex, and Gemini support
- Formatted tool calls for Bash, Read, Edit, Grep, Glob, Task, and more
- Markdown-ish terminal rendering for text, code, and tables
- Nested subagent display for Task-style workflows
- Session totals for duration, cost, and token usage when providers expose them

## 🚀 Quick Start

1. Install the CLI globally:

   ```sh
   npm i -g pretty-session
   # now you can use "pts" or "pretty-session" in your terminal
   ```

<div  align="center">
  <a href="https://www.npmjs.com/package/pretty-session"><img src="https://img.shields.io/npm/v/pretty-session?label=npm&color=cb3837&logo=npm" alt="npm"></a>
</div>

2. Use whichever mode matches what you are inspecting:

   Mode A: Live provider stream

   ```sh
   claude -p "explain this code" --print --verbose --dangerously-skip-permissions --output-format stream-json | pts parse claude
   # codex exec "explain this code" --json | pts parse codex
   # gemini -p "explain this code" --output-format stream-json | pts parse gemini
   ```

   Mode B: Saved session snapshot

   ```sh
   cat ~/.claude/projects/.../session.jsonl | pts parse claude
   # cat ~/.codex/sessions/.../session.jsonl | pts parse codex
   # cat ~/.gemini/tmp/.../session.jsonl | pts parse gemini
   ```

   Mode C: Follow an active session

   ```sh
   pts watch claude <path-or-session-id>
   # pts watch codex <path-or-session-id>
   # pts watch gemini <path-or-session-id>
   ```

## 🧰 Commands

<!-- <DYNFIELD:COMMANDS> -->
```sh
# parse commands
pts parse claude
pts parse codex
pts parse gemini

# watch commands
pts watch claude <session> [--from-end] [--interval <value>]
pts watch codex <session> [--from-end] [--interval <value>]
pts watch gemini <session> [--from-end] [--interval <value>]

pts update

# completion commands
pts completion bash
pts completion fish
pts completion zsh
```
<!-- </DYNFIELD:COMMANDS> -->

## 🧩 Completion

Add completion to your shell config so `pts <tab>` can show available commands, subcommands, and flags.

```sh
eval "$(pts completion zsh)"
```

For the interactive completion menu shown while typing, install the [zsh-autocomplete](https://github.com/marlonrichert/zsh-autocomplete). Bash and Fish completion scripts are also available:

```sh
pts completion bash
pts completion fish
```

## 🛠️ Development

Install the development binary when you want local code changes to be available from any terminal. This creates `ptsd`, which runs the current workspace version:

```sh
pnpm dev:install
ptsd --help
```

For development autocomplete, follow the Completion section and use the dev binary in your shell config:

```sh
eval "$(ptsd completion zsh)"
```

Remove the development binary when you no longer need it:

```sh
pnpm dev:uninstall
```

## ⚙️ Configuration

No config file is required. Pretty Session reads provider events from stdin and writes formatted output to stdout.

Environment variables:

| Variable                   | Default | Description                                      |
| -------------------------- | ------- | ------------------------------------------------ |
| `PTS_TOOL_RESULT_LINES`    | `0`     | Maximum lines shown in tool result previews      |
| `PTS_SHOW_SUBAGENT_PROMPT` | `true`  | Show subagent prompt lines under Agent tool calls |

## 📜 License

[MIT](https://github.com/lucasvtiradentes/pretty-session/blob/main/LICENSE)

<!-- <DYNFIELD:FOOTER> -->
<div width="100%" align="center">
  <img src="https://cdn.jsdelivr.net/gh/lucasvtiradentes/pretty-session@main/.github/image/divider.png" />
</div>

<br />

<div align="center">
  <div>
    <a target="_blank" href="https://www.linkedin.com/in/lucasvtiradentes/"><img src="https://img.shields.io/badge/-linkedin-blue?logo=Linkedin&logoColor=white" alt="LinkedIn"></a>
    <a target="_blank" href="mailto:lucasvtiradentes@gmail.com"><img src="https://img.shields.io/badge/gmail-red?logo=gmail&logoColor=white" alt="Gmail"></a>
    <a target="_blank" href="https://x.com/lucasvtiradente"><img src="https://img.shields.io/badge/-X-black?logo=X&logoColor=white" alt="X"></a>
    <a target="_blank" href="https://github.com/lucasvtiradentes"><img src="https://img.shields.io/badge/-github-gray?logo=Github&logoColor=white" alt="Github"></a>
  </div>
</div>
<!-- </DYNFIELD:FOOTER> -->
