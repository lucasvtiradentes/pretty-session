import { exec } from 'node:child_process'
import { platform } from 'node:os'
import { promisify } from 'node:util'
import { createCommandAdapters, defineCommand, z } from 'unicommand'
import { CLI_NAME, VERSION } from '../constants'

const execAsync = promisify(exec)
const packageName = 'pretty-session'

const metadata = defineCommand({
	name: 'update',
	description: `Update ${CLI_NAME} to latest version`,
	inputSchema: z.object({}),
	outputSchema: z.number(),
})

enum PackageManager {
	Npm = 'npm',
	Pnpm = 'pnpm',
	Yarn = 'yarn',
}

const updateCommandsByPackageManager = {
	[PackageManager.Npm]: `npm update -g ${packageName}`,
	[PackageManager.Pnpm]: `pnpm update -g ${packageName}`,
	[PackageManager.Yarn]: `yarn global upgrade ${packageName}`,
} as const satisfies Record<PackageManager, string>

export const handler = async () => {
	console.log('Checking current version...')
	const currentVersion = VERSION

	console.log('Checking latest version...')
	const latestVersion = await getLatestVersion()
	if (!latestVersion) {
		console.log('error: could not fetch latest version from npm')
		return 1
	}

	console.log(`Current version: ${currentVersion}`)
	console.log(`Latest version: ${latestVersion}`)

	if (currentVersion === latestVersion) {
		console.log(`${CLI_NAME} is already up to date`)
		return 0
	}

	console.log('Detecting package manager...')
	const packageManager = await detectPackageManager(CLI_NAME)

	if (!packageManager) {
		console.log(`error: could not detect how ${CLI_NAME} was installed`)
		console.log('Please update manually using your package manager')
		return 1
	}

	console.log(`Detected package manager: ${packageManager}`)
	console.log(`Updating ${packageName} from ${currentVersion} to ${latestVersion}...`)

	const { stdout, stderr } = await execAsync(getUpdateCommand(packageManager))

	console.log(`${packageName} updated successfully from ${currentVersion} to ${latestVersion}`)
	if (stdout) console.log(stdout.trim())
	if (stderr) console.log(stderr.trim())
	return 0
}

export const updateCommand = createCommandAdapters({
	metadata,
	handler,
})

async function detectPackageManager(binName: string): Promise<PackageManager | null> {
	const globalBinPath = await getGlobalBinPath(binName)
	if (!globalBinPath) return (await isInstalledWithNpm()) ? PackageManager.Npm : null

	return getPackageManagerFromPath(globalBinPath) ?? PackageManager.Npm
}

export function getPackageManagerFromPath(globalBinPath: string): PackageManager | null {
	const possiblePaths = [
		{ manager: PackageManager.Yarn, patterns: ['/yarn/', '\\yarn\\', '/.yarn/', '\\.yarn\\'] },
		{ manager: PackageManager.Pnpm, patterns: ['/pnpm/', '\\pnpm\\', '/.pnpm/', '\\.pnpm\\'] },
		{ manager: PackageManager.Npm, patterns: ['/npm/', '\\npm\\', '/node/', '\\node\\', '/node_modules/'] },
	] as const

	for (const { manager, patterns } of possiblePaths) {
		if (patterns.some((pattern) => globalBinPath.includes(pattern))) return manager
	}

	return null
}

async function getGlobalBinPath(binName: string): Promise<string | null> {
	const isWindows = platform() === 'win32'

	try {
		const whereCommand = isWindows ? 'where' : 'which'
		const { stdout } = await execAsync(`${whereCommand} ${binName}`)
		const execPath = stdout.trim()
		if (!execPath) return null

		if (isWindows) return execPath

		try {
			const { stdout: realPath } = await execAsync(`readlink -f "${execPath}"`)
			return realPath.trim() || execPath
		} catch {
			return execPath
		}
	} catch {
		return null
	}
}

async function isInstalledWithNpm() {
	try {
		const { stdout } = await execAsync(`npm list -g --depth=0 ${packageName}`)
		return stdout.includes(packageName)
	} catch {
		return false
	}
}

async function getLatestVersion(): Promise<string | null> {
	try {
		const { stdout } = await execAsync(`npm view ${packageName} version`)
		return stdout.trim()
	} catch {
		return null
	}
}

function getUpdateCommand(packageManager: PackageManager): string {
	return updateCommandsByPackageManager[packageManager]
}
