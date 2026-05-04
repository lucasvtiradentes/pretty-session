export class ParseResult {
	messages: string[] = []

	add(text: string) {
		this.messages.push(text)
	}

	getOutput(): string {
		return this.messages.join('')
	}
}
