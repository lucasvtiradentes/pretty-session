import { homedir } from 'node:os'
import { join, resolve, sep } from 'node:path'

export function getHomeDir() {
	return homedir()
}

export function expandHome(path: string) {
	if (path === '~') return getHomeDir()
	if (path.startsWith('~/')) return join(getHomeDir(), path.slice(2))
	return resolve(path)
}

export function toTildePath(path: string) {
	const home = getHomeDir()
	if (path === home) return '~'
	if (!path.startsWith(`${home}${sep}`)) return path
	return `~/${path.slice(home.length + 1).replaceAll(sep, '/')}`
}
