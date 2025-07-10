import { readFile } from 'fs/promises';
import { JSON_SONGS_PATH, XML_SONGS_PATH } from '../definitions/paths';

export async function readSongsJson() {
	return await readFile(JSON_SONGS_PATH).then((file) => file.toString());
}

export async function readSongsXml() {
	return await readFile(XML_SONGS_PATH).then((file) => file.toString());
}

export default async function readSongs() {
	return {
		json: await readSongsJson(),
		xml: await readSongsXml(),
	};
}
