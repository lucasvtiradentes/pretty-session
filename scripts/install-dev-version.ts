import { execFileSync } from "node:child_process"
import { chmodSync, mkdirSync, rmSync, writeFileSync } from "node:fs"
import { homedir } from "node:os"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { CLI_NAME } from "../src/constants"

const scriptDir = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(scriptDir, "..")
const binDir = getBinDir()
const devBinNames = [`${CLI_NAME}d`, "prettysessiond", "psd"]

mkdirSync(binDir, { recursive: true })

for (const binName of devBinNames) {
	if (process.platform === "win32") {
		const target = join(binDir, `${binName}.cmd`)
		rmSync(target, { force: true })
		writeFileSync(target, getWindowsShim(binName))
	} else {
		const target = join(binDir, binName)
		rmSync(target, { force: true })
		writeFileSync(target, getPosixShim(binName))
		chmodSync(target, 0o755)
	}
}

function getBinDir() {
	if (process.env.PRETTY_SESSION_DEV_BIN_DIR) return process.env.PRETTY_SESSION_DEV_BIN_DIR

	if (process.platform === "win32") {
		return getNpmPrefix() ?? join(homedir(), "AppData", "Roaming", "npm")
	}

	return join(homedir(), ".local", "bin")
}

function getNpmPrefix() {
	try {
		return execFileSync(process.platform === "win32" ? "npm.cmd" : "npm", ["config", "get", "prefix"], {
			encoding: "utf8",
			stdio: ["ignore", "pipe", "ignore"],
		}).trim()
	} catch {
		return null
	}
}

function getPosixShim(binName: string) {
	return `#!/usr/bin/env sh
set -eu
export PRETTY_SESSION_PROG_NAME=${shellQuote(binName)}
exec ${shellQuote(join(rootDir, "node_modules", ".bin", "tsx"))} --conditions=development ${shellQuote(join(rootDir, "src", "cli.ts"))} "$@"
`
}

function getWindowsShim(binName: string) {
	return `@echo off
set "PRETTY_SESSION_PROG_NAME=${binName}"
"${join(rootDir, "node_modules", ".bin", "tsx.cmd")}" --conditions=development "${join(rootDir, "src", "cli.ts")}" %*
`
}

function shellQuote(value: string) {
	return `'${value.replaceAll("'", "'\\''")}'`
}
