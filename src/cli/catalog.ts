import { completionCommand } from '../commands/completion/register'
import { parseCommand } from '../commands/parse'
import { watchCommand } from '../commands/watch'

export const cliCommands = [parseCommand, watchCommand, completionCommand] as const
export const docsCommands = [...cliCommands] as const
