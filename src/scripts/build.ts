import { readdirSync, rmSync, writeFileSync } from 'fs';
import {
	JSON_SONGS_PATH,
	DIST_FILES,
	DIST_FOLDER_PATH,
	XML_NO_IDS_SONGS_PATH,
	XML_SONGS_PATH,
} from '../definitions/paths';
import { join } from 'path';
import { isoDateRegex } from '../util/regex';
import createSongs from '../util/createSongs';
import dayjs from 'dayjs';

export default async function build(customUpdatedAt: string | undefined): Promise<void> {
	const updatedAt = customUpdatedAt?.match(isoDateRegex)
		? customUpdatedAt
		: dayjs().format('YYYY-MM-DD');

	const buildSongs = createSongs(updatedAt);

	writeJson(await buildSongs.json);
	writeXml(buildSongs.xml);
	writeXmlWithoutIds(buildSongs.xmlNoIds);
	console.log('Build complete and saved');

	const filesToRemove = readdirSync(DIST_FOLDER_PATH)
		.map((file) => join(DIST_FOLDER_PATH, file))
		.filter((file) => !DIST_FILES.includes(file));
	filesToRemove.forEach((file) => {
		rmSync(file);
	});
	if (filesToRemove.length)
		console.log(
			`Removed ${filesToRemove.length} unneeded file${filesToRemove.length !== 1 ? 's' : ''}`,
		);
}

export function writeJson(songs: string) {
	writeFileSync(JSON_SONGS_PATH, songs);
}

export function writeXml(songs: string) {
	writeFileSync(XML_SONGS_PATH, songs);
}

export function writeXmlWithoutIds(songs: string) {
	writeFileSync(XML_NO_IDS_SONGS_PATH, songs);
}
