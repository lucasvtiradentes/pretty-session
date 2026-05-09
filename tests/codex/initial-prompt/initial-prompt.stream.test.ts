import { describe, expect, it } from 'vitest'
import { replayCodexStreamWithSession } from '../../initial-prompt-helpers'
import { sessionPath, streamPath } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const stream = streamPath(dir)
const session = sessionPath(dir)

describe('codex initial prompt - stream mode', () => {
	it('renders the initial user prompt from stream fixture', () => {
		const output = replayCodexStreamWithSession(stream, session)
		expect(output).toContain('[user] Reply with exactly initial-prompt-ok and nothing else.')
		expect(output).toContain('initial-prompt-ok')
	})
})
