<a name="TOC"></a>

<div align="center">
  <!-- <DYNFIELD:HEADER_LOGO> -->
  <div>Pretty Session</div>
  <!-- </DYNFIELD:HEADER_LOGO> -->
  <br />
  <a href="#-overview">Overview</a> • <a href="#-motivation">Motivation</a> • <a href="#-features">Features</a> • <a href="#-packages">Packages</a> • <a href="#-quick-start">Quick Start</a> • <a href="#-commands">Commands</a> • <a href="#-configuration">Configuration</a> • <a href="#-license">License</a>
</div>

<!-- <DYNFIELD:TOP_DIVIDER> -->
<div width="100%" align="center">
  <img src="https://cdn.jsdelivr.net/gh/lucasvtiradentes/pretty-session@main/.github/image/divider.png" />
</div>
<!-- </DYNFIELD:TOP_DIVIDER> -->

## 🎺 Overview

Pretty Session is a small CLI that formats AI coding agent streams and saved session files into readable terminal output.

## ❓ Motivation

Claude Code, Codex, and Gemini store useful session data as JSONL or stream JSON events. That format is good for machines, but bad for quick human review. Pretty Session keeps provider parsing separate and renders the same session in a cleaner, readable view.

## ⭐ Features

- Pipe-based formatter for provider streams and saved sessions
- Claude Code, Codex, and Gemini support
- Formatted tool calls for Bash, Read, Edit, Grep, Glob, Task, and more
- Markdown-ish terminal rendering for text, code, and tables
- Nested subagent display for Task-style workflows
- Session totals for duration, cost, and token usage when providers expose them

## 📦 Packages

<div align="center">
<table>
  <tr>
    <th>Package</th>
    <th>Repo</th>
    <th>Download</th>
  </tr>
  <tr>
    <td align="center">CLI</td>
    <td align="center"><a href="https://github.com/lucasvtiradentes/pretty-session"><code>pretty-session</code></a></td>
    <td align="center"><a href="https://www.npmjs.com/package/pretty-session"><img src="https://img.shields.io/npm/v/pretty-session?label=npm&color=cb3837&logo=npm" alt="npm"></a></td>
  </tr>
</table>
</div>

## 🚀 Quick Start

1. Install the CLI globally:

   ```sh
   npm i -g pretty-session
   ```

2. Format a Claude Code stream:

   ```sh
   claude -p "explain this code" --print --verbose --dangerously-skip-permissions --output-format stream-json | ps claude
   ```

3. Format a saved Codex session:

   ```sh
   cat ~/.codex/sessions/.../session.jsonl | ps codex
   ```

## 🧰 Commands

<!-- <DYNFIELD:COMMANDS> -->
```sh
# live provider streams
claude -p "explain this code" --print --verbose --dangerously-skip-permissions --output-format stream-json | ps claude
codex exec "explain this code" --json | ps codex
gemini -p "explain this code" --output-format stream-json | ps gemini

# saved session files
cat ~/.claude/projects/.../session.jsonl | ps claude
cat ~/.codex/sessions/.../session.jsonl | ps codex
cat ~/.gemini/tmp/.../session.jsonl | ps gemini

# shell integration
ps completion zsh
ps --help
ps --version
```
<!-- </DYNFIELD:COMMANDS> -->

## 🛠️ Development

Install the dev CLI once to use `psd` anywhere on your machine while testing local source changes:

```sh
pnpm dev:install
psd --help
pnpm dev:uninstall
```

## ⚙️ Configuration

No config file is required. Pretty Session reads provider events from stdin and writes formatted output to stdout.

Supported providers:

<!-- <DYNFIELD:CONFIG_JSON> -->
```json
{
  "providers": ["claude", "codex", "gemini"],
  "env": {
    "PS_TOOL_RESULT_MAX_CHARS": "300",
    "PS_READ_PREVIEW_LINES": "5"
  }
}
```
<!-- </DYNFIELD:CONFIG_JSON> -->

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
