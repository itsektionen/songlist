import { renameSync } from 'fs';
import { join, parse as parseFile } from 'path';
import { SONGS_FOLDER_PATH } from '../definitions/paths';
import { getAllSongPaths } from './songs';

export default function pushIds(id: number, direction: number = 1): void {
	const songPaths = getAllSongPaths()
		.map((path) => {
			const [id, ...splitName] = parseFile(path).base.split('_');
			return { id: Number(id), name: splitName.join('_'), originalPath: path };
		})
		.filter((path) => path.id >= id);

	songPaths.forEach(({ id, name, originalPath }) => {
		const newPath = join(SONGS_FOLDER_PATH, `${id + direction}_${name}`);

		renameSync(originalPath, newPath);
	});
}
