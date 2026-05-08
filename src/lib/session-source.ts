import { readFile, readdir, stat } from 'node:fs/promises'
import { homedir } from 'node:os'
import { basename, join, resolve } from 'node:path'
import { Provider } from '../constants'

interface ResolveSessionSourceOptions {
	searchRoot?: string
}

export async function resolveSessionSource(
	provider: Provider,
	source: string,
	options: ResolveSessionSourceOptions = {},
) {
	const path = expandHome(source)
	if (await isFile(path)) return path

	const searchRoot = options.searchRoot ?? getProviderSessionRoot(provider)
	if (!searchRoot) throw new Error(`session lookup is not supported for provider '${provider}'`)
	if (!(await isDirectory(searchRoot))) throw new Error(`session root not found: ${searchRoot}`)

	const matches = await findSessionMatches(provider, searchRoot, source)
	if (matches.length === 0) throw new Error(`session not found for ${provider}: ${source}`)
	if (matches.length > 1) {
		throw new Error(`multiple sessions matched '${source}':\n${matches.map((match) => `  ${match}`).join('\n')}`)
	}

	return matches[0]
}

function getProviderSessionRoot(provider: Provider) {
	const home = homedir()
	if (provider === Provider.Claude) return join(home, '.claude', 'projects')
	if (provider === Provider.Codex) return join(home, '.codex', 'sessions')
	if (provider === Provider.Gemini) return join(home, '.gemini', 'tmp')
}

async function findSessionMatches(provider: Provider, root: string, sessionId: string) {
	const files = await listJsonlFiles(root)
	const matches: string[] = []

	for (const file of files) {
		if (basename(file).includes(sessionId) || (await fileHasSessionId(provider, file, sessionId))) matches.push(file)
	}

	return matches.sort()
}

async function listJsonlFiles(root: string) {
	const files: string[] = []
	const entries = await readdir(root, { withFileTypes: true })

	for (const entry of entries) {
		const path = join(root, entry.name)
		if (entry.isDirectory()) files.push(...(await listJsonlFiles(path)))
		if (entry.isFile() && entry.name.endsWith('.jsonl')) files.push(path)
	}

	return files
}

async function fileHasSessionId(provider: Provider, path: string, sessionId: string) {
	const lines = (await readFile(path, 'utf8')).split('\n')

	for (const line of lines) {
		if (!line.trim()) continue
		const record = parseRecord(line)
		if (!record) continue
		if (getSessionId(provider, record) === sessionId) return true
	}

	return false
}

function getSessionId(provider: Provider, record: Record<string, unknown>) {
	if (provider === Provider.Claude) return stringValue(record.session_id)
	if (provider === Provider.Gemini) return stringValue(record.sessionId) ?? stringValue(record.session_id)
	if (provider === Provider.Codex) {
		const payload = record.payload
		if (isRecord(payload)) return stringValue(payload.id)
	}
}

function parseRecord(line: string) {
	try {
		const value = JSON.parse(line) as unknown
		return isRecord(value) ? value : undefined
	} catch {
		return undefined
	}
}

function stringValue(value: unknown) {
	return typeof value === 'string' ? value : undefined
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}

async function isFile(path: string) {
	try {
		return (await stat(path)).isFile()
	} catch {
		return false
	}
}

async function isDirectory(path: string) {
	try {
		return (await stat(path)).isDirectory()
	} catch {
		return false
	}
}

function expandHome(path: string) {
	if (path === '~') return homedir()
	if (path.startsWith('~/')) return join(homedir(), path.slice(2))
	return resolve(path)
}
