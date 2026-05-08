import { completionCommand } from '../commands/completion/register'
import { parseCommand } from '../commands/parse'
import { updateCommand } from '../commands/update'
import { watchCommand } from '../commands/watch'

export const cliCommands = [parseCommand, watchCommand, updateCommand, completionCommand] as const
export const docsCommands = [...cliCommands] as const
