# pretty-session

## 0.0.4

### Patch Changes

- 0cd6d72: Render Gemini saved-session tool calls with per-tool formatting: `[Read] {file}` with content preview, `[Write] {file}` with `+added -removed` line counts, `[Search] {pattern}` with match summary, and `[Topic] {title}` for the internal scratchpad. Falls back to the previous generic display for unknown tools.

## 0.0.3

### Patch Changes

- 8193760: Bind generated shell completions to both pretty-session and pts bins.

## 0.0.2

### Patch Changes

- da7dc7f: Add shell completion generation for providers, shells, and global flags.

## 0.0.1

### Patch Changes

- 73c04b8: Prepare package release automation and single-package repository layout.
