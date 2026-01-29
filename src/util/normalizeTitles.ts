export function normalizeTitle(title: string): string {
	return removeAccents(title).toLowerCase();
}

export function generateSongName(title: string, id: number): string {
	const normalizedTitle = removeAccents(title).replace(/\s/g, '_');

	return `${id}_${normalizedTitle}.md`;
}

function removeAccents(title: string): string {
	return title
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/æ/g, 'a')
		.replace(/Æ/g, 'A')
		.replace(/ø/g, 'o')
		.replace(/Ø/g, 'O')
		.replace(/[^a-zA-Z0-9\s]/g, '')
		.trim();
}
