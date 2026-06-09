import { describe, expect, it } from 'vitest'
import { READ_BODY } from '../expectations'
import { expected, promptPath, runE2E, sanitize } from '../helpers'

const dir = new URL('.', import.meta.url).pathname

describe('pi read e2e', () => {
	it('runs pi and parses read', async () => {
		const output = await runE2E(promptPath(dir), dir, {
			tools: 'read',
			files: { 'package.json': '{"name":"pi-read-fixture","version":"1.0.0"}\n' },
		})
		expect(sanitize(output)).toBe(expected(READ_BODY))
	}, 120_000)
})
