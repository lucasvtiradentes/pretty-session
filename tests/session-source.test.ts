import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { Provider } from '../src/constants'
import { resolveSessionSource } from '../src/lib/session-source'

const dirs: string[] = []

afterEach(() => {
	for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true })
})

describe('resolveSessionSource', () => {
	it('returns an existing file path directly', async () => {
		const path = createFile('session.jsonl', '{}\n')

		await expect(resolveSessionSource(Provider.Codex, path)).resolves.toBe(path)
	})

	it('resolves a session id from the file name', async () => {
		const root = createDir()
		const path = join(root, '2026', '05', '08', 'rollout-abc-123.jsonl')
		mkdirSync(join(root, '2026', '05', '08'), { recursive: true })
		writeFileSync(path, '{}\n')

		await expect(resolveSessionSource(Provider.Codex, 'abc-123', { searchRoot: root })).resolves.toBe(path)
	})

	it('resolves a session id from file content', async () => {
		const root = createDir()
		const path = join(root, 'project', 'chats', 'session.jsonl')
		mkdirSync(join(root, 'project', 'chats'), { recursive: true })
		writeFileSync(path, '{"sessionId":"full-session-id"}\n')

		await expect(resolveSessionSource(Provider.Gemini, 'full-session-id', { searchRoot: root })).resolves.toBe(path)
	})

	it('errors when multiple files match', async () => {
		const root = createDir()
		writeFileSync(join(root, 'one-shared.jsonl'), '{}\n')
		writeFileSync(join(root, 'two-shared.jsonl'), '{}\n')

		await expect(resolveSessionSource(Provider.Claude, 'shared', { searchRoot: root })).rejects.toThrow(
			'multiple sessions matched',
		)
	})

	it('does not match arbitrary transcript text', async () => {
		const root = createDir()
		const path = join(root, 'rollout-real-session.jsonl')
		writeFileSync(join(root, 'mentions-id.jsonl'), '{"payload":{"id":"other"},"text":"real-session"}\n')
		writeFileSync(path, '{"payload":{"id":"real-session"}}\n')

		await expect(resolveSessionSource(Provider.Codex, 'real-session', { searchRoot: root })).resolves.toBe(path)
	})
})

function createDir() {
	const dir = mkdtempSync(join(tmpdir(), 'pretty-session-source-'))
	dirs.push(dir)
	return dir
}

function createFile(name: string, content: string) {
	const dir = createDir()
	const path = join(dir, name)
	writeFileSync(path, content)
	return path
}
