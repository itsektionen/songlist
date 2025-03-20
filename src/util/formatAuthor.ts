import { Author } from '../definitions/author';

export function formatAuthor(groups: Author[]): string {
	return groups.map(formatSingleAuthor).join('; ');
}

function formatSingleAuthor({ name, event, location, year, comment }: Author): string {
	let details = [event, location, year].filter(Boolean).join(', ');
	details = comment ? (details ? `${details} — ${comment}` : comment) : details;

	if (!details) return name;
	if (!name) return `(${details})`;
	return `${name} (${details})`;
}
