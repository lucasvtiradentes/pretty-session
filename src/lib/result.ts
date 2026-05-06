export class ParseResult {
	messages: string[] = []
	recognized = false

	add(text: string) {
		this.markRecognized()
		this.messages.push(text)
	}

	getOutput(): string {
		return this.messages.join('')
	}

	markRecognized() {
		this.recognized = true
	}
}
