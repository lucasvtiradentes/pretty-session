<a name="TOC"></a>

<div align="center">
  <div>Pretty Session</div>
  <br />
  <a href="#-overview">Overview</a> • <a href="#-motivation">Motivation</a> • <a href="#-features">Features</a> • <a href="#-quick-start">Quick Start</a> • <a href="#-usage">Usage</a> • <a href="#-development">Development</a> • <a href="#-license">License</a>
</div>

<div width="100%" align="center">
  <img src="https://cdn.jsdelivr.net/gh/lucasvtiradentes/pretty-session@main/.github/images/divider.png" />
</div>

## 🎺 Overview

Pretty Session turns noisy AI coding agent logs into clean terminal output, making live streams and saved sessions easier to read, review, and debug.

<div align="center">
  <p>Without Pretty Session vs With Pretty Session</p>
  <img src="https://cdn.jsdelivr.net/gh/lucasvtiradentes/pretty-session@main/.github/images/without-pretty-session.png" alt="Without Pretty Session" width="49%" />
  <img src="https://cdn.jsdelivr.net/gh/lucasvtiradentes/pretty-session@main/.github/images/with-pretty-session.png" alt="With Pretty Session" width="49%" />
</div>

## ❓ Motivation

I wanted a way to actually understand what my coding agents are doing while they run, especially in CI, where the default stream-json logs are noisy and painful to read.

Why? To quickly review progress, debug a run, or catch what happened at a glance.

## ⭐ Features

- Three ways to format agent sessions: parse a saved session, watch an active one, or stream one live.
- Multi-provider support for [Claude Code](https://claude.com/product/claude-code), [Codex](https://openai.com/codex/), and [Gemini](https://geminicli.com/), with a parser structure that is easy to extend.
- Cleaner terminal output for tool calls, subagents, markdown-ish text, tables, and more.

## 🚀 Quick Start

1. Install the CLI globally:

   ```sh
   npm install -g pretty-session
   # now you can use "pts" or "pretty-session" in your terminal
   ```

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

## 🧰 Usage

<div align="center">

<details>
<summary>Show commands</summary>
<br />

<div align="left">

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

# completion commands
pts completion bash
pts completion fish
pts completion zsh

# other commands
pts update
```
<!-- </DYNFIELD:COMMANDS> -->

</div>

</details>

</div>

<div align="center">

<details>
<summary>Environment variables</summary>

<br />

<div align="center">

| Variable                   | Default | Description                                      |
| -------------------------- | ------- | ------------------------------------------------ |
| `PTS_TOOL_RESULT_LINES`    | `0`     | Maximum lines shown in tool result previews      |
| `PTS_SHOW_SUBAGENT_PROMPT` | `true`  | Show subagent prompt lines under Agent tool calls |

</div>

</details>

</div>

<div align="center">

<details>
<summary>Show completion setup</summary>
<br />

<div align="left">

For a better terminal experience, enable shell completion so `pts <tab>` can show available commands, subcommands, and flags.

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/lucasvtiradentes/pretty-session@main/.github/images/shell-completion.png" alt="Shell completion" />
</div>

For zsh, add this line to your `.zshrc`:

```sh
eval "$(pts completion zsh)"
```

This enables completion for commands, subcommands, and flags. For a richer menu while you type, install [zsh-autocomplete](https://github.com/marlonrichert/zsh-autocomplete).

Bash and Fish are available too:

```sh
pts completion bash
pts completion fish
```

</div>

</details>

</div>

## 🛠️ Development

<div align="center">

<details>
<summary>Show local development setup</summary>
<br />

<div align="left">

When working on Pretty Session locally, install the development command:

```sh
pnpm dev:install
ptsd --help
```

This creates `ptsd`, a dev-only command that runs the current workspace version without replacing the globally installed `pts`.

To enable zsh completion for the dev command, add this to your shell config:

```sh
eval "$(ptsd completion zsh)"
```

Remove the dev command when you no longer need it:

```sh
pnpm dev:uninstall
```

</div>

</details>

</div>

## 📜 License

[MIT](https://github.com/lucasvtiradentes/pretty-session/blob/main/LICENSE)

<div width="100%" align="center">
  <img src="https://cdn.jsdelivr.net/gh/lucasvtiradentes/pretty-session@main/.github/images/divider.png" />
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
