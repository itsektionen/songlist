import { writeFileSync } from 'fs';
import { join } from 'path';
import { format } from 'prettier';
import { Song } from '../definitions/song';
import { Tag, TAGS } from '../definitions/tags';
import generateFileName from '../util/generateFileName';
import { SONGS_FOLDER_PATH } from '../definitions/paths';
import pushIds from '../util/pushIds';
import { getAllSongPaths } from '../util/songs';
import { Author, VALID_AUTHOR_KEYS } from '../definitions/author';

export default async function create(title: string, ...args: string[]): Promise<void> {
	if (!title) return console.error('A title for the new song must be provided!');
	const { id, ...parsedArgs } = parseArgs(args);

	const newTitle =
		id !== undefined ? generateFileName(title, id) : generateFileName(title, nextId());
	const newContent = generateDefaultSongFileContent(title, parsedArgs);

	if (id !== undefined) pushIds(id);

	writeFileSync(join(SONGS_FOLDER_PATH, newTitle), await newContent);
}

function nextId(): number {
	return getAllSongPaths().length;
}

async function generateDefaultSongFileContent(
	title: string,
	{
		author,
		alternativeTitles,
		melody,
		composer,
		notes = [],
		tags = [],
		content,
	}: Omit<Song, 'id' | 'title' | 'deleted' | 'content'> & { content?: string },
): Promise<string> {
	let contentBuilder = `---\ntitle: ${title}\n`;

	contentBuilder += `author:\n`;
	if (author) {
		author.forEach((a) => {
			contentBuilder += `  - ${formatAuthor(a)}`;
		});
	}

	if (alternativeTitles && alternativeTitles.length > 0) {
		contentBuilder += `alternativeTitles:\n`;
		alternativeTitles.forEach((title) => {
			contentBuilder += `  - ${title}\n`;
		});
	}

	contentBuilder += `melody: ${melody || ''}\n`;
	contentBuilder += `composer: ${composer || ''}\n`;

	if (notes) {
		contentBuilder += `notes:\n`;
		notes.forEach((note) => {
			contentBuilder += `  - ${note}`;
		});
	}

	contentBuilder += `tags: [${tags.join(', ')}]\n`;
	contentBuilder += '---\n';
	if (content) contentBuilder += content;

	return await format(contentBuilder, { parser: 'markdown' });
}

function parseArgs(
	args: string[],
): Partial<Omit<Song, 'title' | 'deleted' | 'tags'>> & { tags: Tag[] } {
	const [idString] = getArgValues(args, 'id');
	const [name] = getArgValues(args, 'author');
	const [event] = getArgValues(args, 'event');
	const [location] = getArgValues(args, 'location');
	const [year] = getArgValues(args, 'year');
	const [melody] = getArgValues(args, 'melody');
	const [composer] = getArgValues(args, 'composer');
	const tags = getArgValues(args, 'tags').filter((tag) => TAGS.includes(tag as Tag)) as Tag[];
	const [content] = getArgValues(args, 'content');

	const [alternativeTitlesRaw] = getArgValues(args, 'alternativeTitles');
	const alternativeTitles = (alternativeTitlesRaw ?? '')
		.split(';')
		.map((s) => s.trim())
		.filter(Boolean);

	let author: Author[] | undefined;
	if (name || event || location || year) {
		const authorObj: Author = {};
		if (name) authorObj.name = name;
		if (event) authorObj.event = event;
		if (location) authorObj.location = location;
		if (year) authorObj.year = parseInt(year);
		author = [authorObj];
	}

	return {
		id:
			typeof idString === 'string'
				? Number(idString) >= 0
					? Number(idString)
					: undefined
				: undefined,
		alternativeTitles,
		author,
		melody,
		composer,
		tags,
		content,
	};
}

function getArgValues(args: string[], key: string): string[] {
	const [_key, ...values] = args.find((arg) => arg.startsWith(`--${key}=`))?.split('=') || [];
	return values;
}

function formatAuthor(author: Author): string {
	let result = '';
	let first = true;

	for (const key of VALID_AUTHOR_KEYS) {
		const value = author[key] ? author[key] : '';

		if (first) {
			result += `${key}: ${value}\n`;
			first = false;
		} else {
			result += `    ${key}: ${value}\n`;
		}
	}

	return result;
}
