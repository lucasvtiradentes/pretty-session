import { describe, expect, it } from 'vitest'
import { getPackageManagerFromPath } from '../src/commands/update'

describe('update command', () => {
	it.each([
		['/usr/local/lib/node_modules/pretty-session/bin.js', 'npm'],
		['/Users/test/.pnpm/global/5/node_modules/pretty-session/dist/cli.js', 'pnpm'],
		['/Users/test/.yarn/bin/pretty-session', 'yarn'],
		['C:\\Users\\test\\AppData\\Roaming\\npm\\pts.cmd', 'npm'],
	])('detects package manager from %s', (path, expected) => {
		expect(getPackageManagerFromPath(path)).toBe(expected)
	})

	it('returns null for unknown install paths', () => {
		expect(getPackageManagerFromPath('/Users/test/.bun/bin/pts')).toBeNull()
	})
})
