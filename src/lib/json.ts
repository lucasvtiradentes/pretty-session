export function parseJsonRecord(text: string): Record<string, unknown> | null {
	try {
		const parsed = JSON.parse(text) as unknown
		if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
			return parsed as Record<string, unknown>
		}
		return null
	} catch {
		return null
	}
}
