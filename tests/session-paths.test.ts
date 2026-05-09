import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { Provider } from '../src/constants'
import {
	getClaudeDisplaySessionPath,
	getClaudeSessionPath,
	getCodexSessionPath,
	getProviderSessionRoot,
} from '../src/lib/session-paths'

describe('session paths', () => {
	it('builds provider roots from one source', () => {
		const home = '/tmp/home'
		expect(getProviderSessionRoot(Provider.Claude, home)).toBe(join(home, '.claude', 'projects'))
		expect(getProviderSessionRoot(Provider.Codex, home)).toBe(join(home, '.codex', 'sessions'))
		expect(getProviderSessionRoot(Provider.Gemini, home)).toBe(join(home, '.gemini', 'tmp'))
	})

	it('builds Claude absolute and display paths with the same project name', () => {
		const home = '/tmp/home'
		const cwd = String.raw`C:\Users\lucas\repo.name_test`
		const sessionId = 'abc-123'
		const expectedProject = 'C:-Users-lucas-repo-name-test'

		expect(getClaudeSessionPath(cwd, sessionId, home)).toBe(
			join(home, '.claude', 'projects', expectedProject, `${sessionId}.jsonl`),
		)
		expect(getClaudeDisplaySessionPath(cwd, sessionId, '')).toBe(
			`~/.claude/projects/${expectedProject}/${sessionId}.jsonl`,
		)
	})

	it('builds Codex session paths from timestamp and timezone', () => {
		const home = '/tmp/home'
		const path = getCodexSessionPath('2026-05-06T03:14:42.336Z', 'America/Belem', 'session-id', home)

		expect(path).toBe(
			join(home, '.codex', 'sessions', '2026', '05', '06', 'rollout-2026-05-06T00-14-42-session-id.jsonl'),
		)
	})
})
