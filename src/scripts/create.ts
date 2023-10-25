import { writeFileSync } from 'fs';
import { join } from 'path';
import { format } from 'prettier';
import { Song } from '../definitions/song';
import { Tag, TAGS } from '../definitions/tags';
import generateFileName from '../util/generateFileName';
import { SONGS_FOLDER_PATH } from '../definitions/paths';
import pushIds from '../util/pushIds';
import { getAllSongPaths } from '../util/songs';

export default function create(title: string, ...args: string[]): void {
	if (!title) return console.error('A title for the new song must be provided!');
	const { id, ...parsedArgs } = parseArgs(args);

	const newTitle =
		id !== undefined ? generateFileName(title, id) : generateFileName(title, nextId());
	const newContent = generateDefaultSongFileContent(title, parsedArgs);

	if (id !== undefined) pushIds(id);

	writeFileSync(join(SONGS_FOLDER_PATH, newTitle), newContent);
}

function nextId(): number {
	return getAllSongPaths().length;
}

function generateDefaultSongFileContent(
	title: string,
	{
		author,
		melody,
		composer,
		tags = [],
		content,
	}: Omit<Song, 'id' | 'title' | 'deleted' | 'content'> & { content?: string }
): string {
	let contentBuilder = `---\ntitle: ${title}\n`;
	contentBuilder += `author: ${author || ''}\n`;
	contentBuilder += `melody: ${melody || ''}\n`;
	contentBuilder += `composer: ${composer || ''}\n`;
	contentBuilder += `tags: [${tags.join(', ')}]\n`;
	contentBuilder += '---\n';
	if (content) contentBuilder += content;

	return format(contentBuilder, { parser: 'markdown' });
}

function parseArgs(
	args: string[]
): Partial<Omit<Song, 'title' | 'deleted' | 'tags'>> & { tags: Tag[] } {
	const [idString] = getArgValues(args, 'id');
	const [author] = getArgValues(args, 'author');
	const [melody] = getArgValues(args, 'melody');
	const [composer] = getArgValues(args, 'composer');
	const tags = getArgValues(args, 'tags').filter((tag) => TAGS.includes(tag as Tag)) as Tag[];
	const [content] = getArgValues(args, 'content');

	return {
		id:
			typeof idString === 'string'
				? Number(idString) >= 0
					? Number(idString)
					: undefined
				: undefined,
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
