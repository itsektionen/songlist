import { buildXmlString } from './xml';
import { getAllSongs, sortSongs } from './songs';
import { Song } from '../definitions/song';
import { formatAuthor } from './formatAuthor';
import { format } from 'prettier';
import dayjs from 'dayjs';

export default function createSongs(updatedAt: string = dayjs().format('YYYY-MM-DD')) {
	const songs = getAllSongs().filter((song) => !song.deleted);
	return {
		json: createJsonSongs(songs, updatedAt),
		xml: buildXmlString(songs, updatedAt, true),
		xmlNoIds: buildXmlString(songs, updatedAt, false),
	};
}

export function createJsonSongs(songs: Song[], updatedAt: string) {
	const sortedSongs = sortSongs(songs).map(({ sorting, author, ...song }) => {
		return { ...song, author: author ? formatAuthor(author) : undefined };
	});
	return format(JSON.stringify({ songs: sortedSongs, updatedAt }), {
		parser: 'json',
		useTabs: true,
	});
}
