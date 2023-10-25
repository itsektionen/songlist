import { rmSync } from 'fs';
import pushIds from '../util/pushIds';
import { getFilePathFromId, getSong, updateSong } from '../util/songs';

export default function remove(idString: string, strength?: string): void {
	const id = Number(idString);
	if (!idString || Number.isNaN(id)) return console.error('A valid ID to remove must be provided!');

	const hardness = strength === '--hard' ? 'hard' : strength === '--soft' ? 'soft' : 'medium';

	switch (hardness) {
		case 'soft': {
			const song = getSong(id);
			if (!song) return console.error(`Can't find a song with the ID ${id}`);

			song.deleted = true;
			updateSong(song);
			break;
		}
		case 'medium': {
			const song = getSong(id);
			if (!song) return console.error(`Can't find a song with the ID ${id}`);
			updateSong({ id: song.id, deleted: true });

			break;
		}
		case 'hard': {
			const filePath = getFilePathFromId(id);
			if (!filePath) return console.error(`Can't find a song with the ID ${id}`);

			rmSync(filePath);
			pushIds(id, -1);
			break;
		}
	}
}
