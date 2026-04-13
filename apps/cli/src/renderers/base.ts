export interface Renderer {
	bold(text: string): string
	dim(text: string): string
	red(text: string): string
	green(text: string): string
	orange(text: string): string
	purple(text: string): string
	blue(text: string): string
	yellow(text: string): string
	renderMarkdown(text: string): string
	styleReset(): string
	styleBold(): string
	styleCode(): string
	styleBoldCode(): string
	sectionOpen(): string
	sectionClose(): string
	pipe(): string
}
