import { execSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const CLI_ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..')
const CLI_PATH = resolve(CLI_ROOT, 'src/bin.ts')

function runCli(args: string[]) {
	return execSync(`npx tsx ${CLI_PATH} ${args.join(' ')}`, {
		cwd: CLI_ROOT,
		encoding: 'utf-8',
		env: { ...process.env, PRETTY_SESSION_PROG_NAME: 'pretty-session' },
		timeout: 30_000,
	})
}

describe('completion', () => {
	it.each(['bash', 'fish', 'zsh'])('generates %s completion', (shell) => {
		const output = runCli(['completion', shell])

		expect(output).toContain('pretty-session')
		expect(output).toContain('claude')
		expect(output).toContain('codex')
		expect(output).toContain('gemini')
		expect(output).toContain('completion')
	})

	it('binds zsh completion to every package bin', () => {
		const output = runCli(['completion', 'zsh'])

		expect(output).toContain('#compdef pretty-session pts')
		expect(output).toContain('compdef _pretty_session_completion pretty-session pts')
		expect(output).not.toContain('_ps()')
	})

	it('completes flags in zsh', () => {
		const output = runCli(['completion', 'zsh'])

		expect(output).toContain('--help:Show help')
		expect(output).toContain('--version:Show version')
	})

	it('completes shells in bash', () => {
		const output = runCli(['completion', 'bash'])

		expect(output).toContain('bash fish zsh')
		expect(output).toContain('complete -F _pretty_session_completion pretty-session')
		expect(output).toContain('complete -F _pretty_session_completion pts')
	})

	it('binds fish completion to every package bin', () => {
		const output = runCli(['completion', 'fish'])

		expect(output).toContain('complete -c pretty-session -f')
		expect(output).toContain('complete -c pts -f')
	})
})
