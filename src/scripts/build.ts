import { readdirSync, rmSync, writeFileSync } from 'fs';
import { format } from 'prettier';
import { Song } from '../definitions/song';
import { buildXmlString } from '../util/xml';
import {
	JSON_SONGS_PATH,
	DIST_FILES,
	DIST_FOLDER_PATH,
	XML_NO_IDS_SONGS_PATH,
	XML_SONGS_PATH,
} from '../definitions/paths';
import { getAllSongs, sortSongs } from '../util/songs';
import { join } from 'path';
import { isoDateRegex } from '../util/regex';

export default function build(customUpdatedAt: string | undefined): void {
	const songs = getAllSongs().filter((song) => !song.deleted);
	const updatedAt = customUpdatedAt?.match(isoDateRegex)
		? customUpdatedAt
		: new Date().toISOString().split('T').at(0);

	writeJson(songs, updatedAt);
	writeXml(songs, updatedAt);
	writeXmlWithoutIds(songs, updatedAt);
	console.log('Build complete and saved');

	const filesToRemove = readdirSync(DIST_FOLDER_PATH)
		.map((file) => join(DIST_FOLDER_PATH, file))
		.filter((file) => !DIST_FILES.includes(file));
	filesToRemove.forEach((file) => {
		rmSync(file);
	});
	if (filesToRemove.length)
		console.log(
			`Removed ${filesToRemove.length} unneeded file${filesToRemove.length !== 1 ? 's' : ''}`
		);
}

export function writeJson(songs: Song[], updatedAt: string) {
	const sortedSongs = sortSongs(songs).map(({ sorting, ...songs }) => songs);
	writeFileSync(
		JSON_SONGS_PATH,
		format(JSON.stringify({ songs: sortedSongs, updatedAt }), { parser: 'json', useTabs: true })
	);
}

export function writeXml(songs: Song[], updatedAt: string) {
	const xml = buildXmlString(songs, updatedAt, true);

	writeFileSync(XML_SONGS_PATH, xml);
}

export function writeXmlWithoutIds(songs: Song[], updatedAt: string) {
	const xml = buildXmlString(songs, updatedAt, false);

	writeFileSync(XML_NO_IDS_SONGS_PATH, xml);
}
