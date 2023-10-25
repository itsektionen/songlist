import { renameSync } from 'fs';
import { join } from 'path';
import { generateSongNameFromCurrentName } from '../util/generateFileName';
import { SONGS_FOLDER_PATH } from '../definitions/paths';
import { getAllSongPaths, getFilePathFromId } from '../util/songs';

function updateOneFileName(id: number): void {
	const songPath = getFilePathFromId(id);
	if (!songPath) return console.error(`ERROR: No song found with ID=${id}`);

	const newPath = join(SONGS_FOLDER_PATH, generateSongNameFromCurrentName(songPath));

	if (songPath === newPath) return console.log('File already up to date');

	renameSync(songPath, newPath);
	console.log('File name updated!');
}

export default function updateFileNames(idString: string | undefined): void {
	const id = idString && Number(idString);

	if (typeof id === 'number' && !Number.isNaN(id)) return updateOneFileName(id);

	const fileNames = getAllSongPaths().map((file) => {
		const newPath = join(SONGS_FOLDER_PATH, generateSongNameFromCurrentName(file));
		return { newPath, oldPath: file };
	});

	let updatedFiles = 0;
	fileNames.forEach(({ newPath, oldPath }) => {
		if (newPath === oldPath) return;

		renameSync(oldPath, newPath);
		updatedFiles++;
	});

	if (!updatedFiles) console.log('All files already up to date');
	else console.log(`Updated ${updatedFiles} file${updatedFiles !== 1 ? 's' : ''}!`);
}
