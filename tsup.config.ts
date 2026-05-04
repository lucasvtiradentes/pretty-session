import { defineConfig } from "tsup"

export default defineConfig([
	{
		banner: { js: "#!/usr/bin/env node" },
		clean: true,
		dts: false,
		entry: { cli: "src/cli/bin.ts" },
		format: ["esm"],
		outDir: "dist",
		target: "node20",
	},
	{
		clean: false,
		dts: true,
		entry: ["src/index.ts"],
		format: ["esm"],
		outDir: "dist",
		target: "node20",
	},
])
