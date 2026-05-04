import { realpathSync } from "node:fs"
import { basename } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { CLI_NAME } from "../constants"
import { runCli } from "./runner"

function isDirectRun() {
	if (!process.argv[1]) return false

	try {
		return realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))
	} catch {
		return import.meta.url === pathToFileURL(process.argv[1]).href
	}
}

function getProgramBin() {
	if (process.env.PRETTY_SESSION_PROG_NAME) return process.env.PRETTY_SESSION_PROG_NAME
	if (isDirectRun() && process.argv[1]) return basename(process.argv[1])
	return CLI_NAME
}

const exitCode = await runCli(process.argv.slice(2), getProgramBin())
if (exitCode > 0) process.exit(exitCode)
