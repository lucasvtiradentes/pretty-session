import { execFileSync } from 'node:child_process'
import { rmSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { DEV_CLI_BIN_NAMES } from '../src/constants'
import { env } from '../src/env'

const binDir = getBinDir()
const devBinNames = DEV_CLI_BIN_NAMES

for (const binName of devBinNames) {
	rmSync(join(binDir, binName), { force: true })
	rmSync(join(binDir, `${binName}.cmd`), { force: true })
}

function getBinDir() {
	if (env.PRETTY_SESSION_DEV_BIN_DIR) return env.PRETTY_SESSION_DEV_BIN_DIR

	if (process.platform === 'win32') {
		return getNpmPrefix() ?? join(homedir(), 'AppData', 'Roaming', 'npm')
	}

	return join(homedir(), '.local', 'bin')
}

function getNpmPrefix() {
	try {
		return execFileSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['config', 'get', 'prefix'], {
			encoding: 'utf8',
			stdio: ['ignore', 'pipe', 'ignore'],
		}).trim()
	} catch {
		return null
	}
}
