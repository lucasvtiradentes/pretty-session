import { defineConfig } from "tsup"

export default defineConfig([
	{
		banner: { js: "#!/usr/bin/env node" },
		clean: true,
		dts: true,
		entry: ["src/cli.ts"],
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
