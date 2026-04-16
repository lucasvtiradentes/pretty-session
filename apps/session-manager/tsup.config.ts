import { defineConfig } from "tsup"

export default defineConfig({
	entry: [
		"src/list-claude-project-sessions.ts",
		"src/list-codex-project-sessions.ts",
		"src/list-gemini-project-sessions.ts",
	],
	format: ["esm"],
	target: "node20",
	clean: true,
	dts: true,
	banner: { js: "#!/usr/bin/env node" },
})
