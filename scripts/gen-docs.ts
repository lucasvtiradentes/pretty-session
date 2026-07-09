import { join } from 'node:path'
import { generateReadmeCommandDocs } from 'unicommand'

await generateReadmeCommandDocs({
	binName: 'pts',
	commandsDir: join(process.cwd(), 'src', 'commands'),
})
