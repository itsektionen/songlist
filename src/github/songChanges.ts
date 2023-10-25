import createSongs from '../util/createSongs';
import { isoDateRegex } from '../util/regex';
import readSongs from '../util/readSongs';

export default async function (): Promise<boolean> {
	const oldSongs = await readSongs();
	const lastUpdatedAt = JSON.parse(oldSongs.json).updatedAt;
	if (typeof lastUpdatedAt !== 'string' || !lastUpdatedAt.match(isoDateRegex)) return true;

	const songs = createSongs(lastUpdatedAt);
	if (songs.json !== oldSongs.json) return true;
	if (songs.xml !== oldSongs.xml) return true;
	if (songs.xmlNoIds !== oldSongs.xmlNoIds) return true;

	return false;
}
