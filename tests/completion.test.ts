import { execSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const CLI_ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..')
const CLI_PATH = resolve(CLI_ROOT, 'src/bin.ts')

function runCli(args: string[], binName = 'pretty-session') {
	return execSync(`npx tsx ${CLI_PATH} ${args.join(' ')}`, {
		cwd: CLI_ROOT,
		encoding: 'utf-8',
		env: { ...process.env, PRETTY_SESSION_PROG_NAME: binName },
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
		expect(output).not.toContain('ptsd')
		expect(output).not.toContain('_ps()')
	})

	it('binds zsh dev completion only to dev bins', () => {
		const output = runCli(['completion', 'zsh'], 'ptsd')

		expect(output).toContain('#compdef ptsd pretty-sessiond prettysessiond')
		expect(output).toContain('compdef _ptsd_completion ptsd pretty-sessiond prettysessiond')
		expect(output).not.toContain('compdef _ptsd_completion pts ')
		expect(output).not.toContain('compdef _ptsd_completion pretty-session ')
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

	it('binds bash dev completion only to dev bins', () => {
		const output = runCli(['completion', 'bash'], 'ptsd')

		expect(output).toContain('complete -F _ptsd_completion ptsd')
		expect(output).toContain('complete -F _ptsd_completion pretty-sessiond')
		expect(output).toContain('complete -F _ptsd_completion prettysessiond')
		expect(output).not.toContain('complete -F _ptsd_completion pts\n')
		expect(output).not.toContain('complete -F _ptsd_completion pretty-session\n')
	})

	it('binds fish completion to every package bin', () => {
		const output = runCli(['completion', 'fish'])

		expect(output).toContain('complete -c pretty-session -f')
		expect(output).toContain('complete -c pts -f')
	})

	it('binds fish dev completion only to dev bins', () => {
		const output = runCli(['completion', 'fish'], 'ptsd')

		expect(output).toContain('complete -c ptsd -f')
		expect(output).toContain('complete -c pretty-sessiond -f')
		expect(output).toContain('complete -c prettysessiond -f')
		expect(output).not.toContain('complete -c pts -f')
		expect(output).not.toContain('complete -c pretty-session -f\n')
	})
})
