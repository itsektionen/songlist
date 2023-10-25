import { readFileSync } from 'fs';
import * as matter from 'gray-matter';
import { validMetaKeys } from '../src/definitions/song';
import { TAGS } from '../src/definitions/tags';
import { getAllSongPaths, getAllSongs } from '../src/util/songs';

describe('All files in songs folder are songs', () => {
	test('All files are markdown', () => {
		getAllSongPaths().forEach((path) => {
			expect(path.endsWith('.md'), `${path} is not a markdown (.md) file`).toBeTruthy();
		});
	});
});

describe('All songs have valid data', () => {
	test('No files have additional metadata', () => {
		getAllSongPaths().forEach((path) => {
			const metaKeys = matter(readFileSync(path).toString()).data;

			Object.keys(metaKeys).forEach((metaKey) => {
				expect(
					validMetaKeys,
					`Value ${metaKey} not a valid metadata property (found in ${path})`
				).toContain(metaKey);
			});
		});
	});

	test('All metadata are valid format', () => {
		const songs = getAllSongs(false);

		songs.forEach((song) => {
			expect(typeof song.title).toBe('string');
			expect(typeof song.author).toMatch(/(string|undefined)/);
			expect(typeof song.composer).toMatch(/(string|undefined)/);
			expect(typeof song.melody).toMatch(/(string|undefined)/);
			if (typeof song.deleted === 'boolean') expect(song.deleted).toBeTruthy();
			else expect(song.deleted).toBeUndefined();

			expect(song.tags).toBeInstanceOf(Array);
			expect(song.tags.length).toBeGreaterThan(0);
			// No tags are not part of list of tags
			const invalidTag = song.tags.find((tag) => !TAGS.includes(tag));
			expect(
				invalidTag,
				`Song with ID=${song.id} and title '${song.title}' contains the invalid tag '${invalidTag}'`
			).toBeUndefined();
		});
	});
});
