import { readdirSync, readFileSync, writeFileSync } from 'fs';
import * as matter from 'gray-matter';
import { join } from 'path';
import { Song, XmlifyableSong } from '../definitions/song';
import { getIdFromFileName } from './generateFileName';
import { SONGS_FOLDER_PATH } from '../definitions/paths';
import { CATEGORY_ORDER, LEGACY_ORDER } from '../definitions/tags';

export function getFilePathFromId(id: number): string | undefined {
	const files = readdirSync(SONGS_FOLDER_PATH);
	let filePath = files.find((file) => file.startsWith(`${id}_`));
	if (!filePath) filePath = files.find((file) => file === `${id}.md`);

	if (!filePath) return undefined;
	return join(SONGS_FOLDER_PATH, filePath);
}

export function getAllSongPaths(): string[] {
	return readdirSync(SONGS_FOLDER_PATH).map((fileName) => join(SONGS_FOLDER_PATH, fileName));
}

function cleanSongContent(content: string): string {
	let start: number, end: number;
	for (start = 0; content[start] === '\n'; start++) {}
	for (end = content.length; content[end - 1] === '\n'; end--) {}
	return content.substring(start, end);
}

export function getSong(path: string): Song;
export function getSong(id: number): Song;
export function getSong(from: string | number): Song {
	const path = typeof from === 'string' ? from : getFilePathFromId(from);
	if (!path) throw new Error(`Couldn't find file path from ${from}`);

	const { data, content } = matter(readFileSync(path).toString()) as unknown as {
		data: Song;
		content: string;
	};
	const id = getIdFromFileName(path);

	const song: Partial<Song> = {
		id,
		title: data.title,
	};

	if (data.author) song.author = data.author;
	if (data.melody) song.melody = data.melody;
	if (data.composer) song.composer = data.composer;
	song.tags = data.tags;
	if (data.sorting) song.sorting = data.sorting;
	if (data.deleted) song.deleted = data.deleted;
	song.content = cleanSongContent(content);

	return song as Song;
}

export function getAllSongs(sorted: boolean = true): Song[] {
	const songs = getAllSongPaths().map((path) => getSong(path));
	return sorted ? songs.sort((a, b) => a.id - b.id) : songs;
}

export function updateSong(song: Partial<Song> & { id: number }): void {
	let fileContent = '---\n';
	if (song.title) fileContent += `title: ${song.title}\n`;
	if (song.author) fileContent += `author: ${song.author}\n`;
	if (song.melody) fileContent += `melody: ${song.melody}\n`;
	if (song.composer) fileContent += `composer: ${song.composer}\n`;
	if (song.tags) fileContent += `tags: [${song.tags.join(', ')}]\n`;
	if (song.deleted) fileContent += `deleted: true\n`;
	fileContent += '---\n';

	if (song.content) fileContent += `\n${song.content}\n`;

	const filePath = getFilePathFromId(song.id);

	writeFileSync(filePath, fileContent);
}

export function sortXmlifyableSongs(songs: XmlifyableSong[]): XmlifyableSong[] {
	return songs
		.sort(
			(a, b) =>
				LEGACY_ORDER.findIndex((category) => a.category === category) -
				LEGACY_ORDER.findIndex((category) => b.category === category)
		)
		.sort((a, b) => (b.sorting || 0) - (a.sorting || 0));
}

export function sortSongs(songs: Song[]): Song[] {
	return songs
		.sort(
			(a, b) =>
				CATEGORY_ORDER.findIndex((category) => a.tags[0] === category) -
				CATEGORY_ORDER.findIndex((category) => b.tags[0] === category)
		)
		.sort((a, b) => (b.sorting || 0) - (a.sorting || 0));
}
