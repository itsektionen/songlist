import { parse as parseFile } from 'path';
import { getIdFromFileName } from '../src/util/generateFileName';
import { getAllSongPaths, getAllSongs } from '../src/util/songs';

describe('All IDs are valid', () => {
	test('All files have IDs', () => {
		const files = getAllSongPaths();
		files.forEach((file) => {
			expect(() => getIdFromFileName(file), `Unable to find an ID for ${file}`).not.toThrow();
		});
	});

	test('No files have leading zeroes in their names', () => {
		getAllSongPaths().forEach((path) => {
			const idString = parseFile(path).name.split('_')[0];

			expect(Number(idString).toString(), `${path} has leading zeroes`).toBe(idString);
		});
	});

	test('All files have unique IDs', () => {
		const songs = getAllSongs(false);
		const ids: Record<number, number> = {};
		songs.forEach(({ id }) => {
			if (!ids[id]) ids[id] = 1;
			else ids[id]++;
		});

		Object.entries(ids).forEach(([id, occurances]) => {
			expect(occurances, `${occurances} files have the ID ${id}`).toBe(1);
		});
	});

	test('All IDs exist', () => {
		const songs = getAllSongs();
		const existsArray: boolean[] = Array.from({ length: songs[songs.length - 1].id }, () => false);
		songs.forEach((song) => {
			existsArray[song.id] = true;
		});
		existsArray.forEach((exists, id) => {
			expect(exists, `No song with ID=${id} found`).toBeTruthy();
		});
	});

	test('IDs limited to 4095 (for b64 encoding)', () => {
		const songs = getAllSongs();

		songs.forEach((song) => {
			expect(
				song.id,
				`No song ID can be greater than 4095 (found in song with title ${song.title})`,
			).toBeLessThanOrEqual(4095);
		});
	});
});
