import { readFileSync } from 'fs';
import matter from 'gray-matter';
import { validMetaKeys } from '../src/definitions/song';
import { TAGS } from '../src/definitions/tags';
import { getAllSongPaths, getAllSongs } from '../src/util/songs';
import { VALID_AUTHOR_KEYS } from '../src/definitions/author';
import { closest } from 'fastest-levenshtein';

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
					`Value ${metaKey} not a valid metadata property (found in ${path})\nDid you mean '${closest(metaKey, validMetaKeys)}'?`,
				).toContain(metaKey);
			});
		});
	});

	test('All metadata are valid format', () => {
		const songs = getAllSongs(false);

		songs.forEach((song) => {
			expect(typeof song.title).toBe('string');

			expect(Array.isArray(song.author) || song.author === undefined).toBeTruthy();
			if (song.author) {
				song.author.forEach((author) => {
					expect(typeof author).toBe('object');

					Object.keys(author).forEach((key) => {
						expect(
							VALID_AUTHOR_KEYS,
							`Song with ID=${song.id} and title '${song.title}' contains the invalid author field '${key}'`,
						).toContain(key);
					});

					VALID_AUTHOR_KEYS.forEach((key) => {
						if (key in author && author[key]) {
							if (key === 'year') {
								expect(typeof author[key]).toBe('number');
							} else {
								expect(typeof author[key]).toBe('string');
							}
						}
					});
				});
			}

			if (song.composer) expect(typeof song.composer).toBe('string');
			if (song.melody) expect(typeof song.melody).toBe('string');
			if (typeof song.deleted === 'boolean') expect(song.deleted).toBeTruthy();
			else expect(song.deleted).toBeUndefined();

			expect(song.tags).toBeInstanceOf(Array);
			expect(song.tags.length).toBeGreaterThan(0);
			// No tags are not part of list of tags
			const invalidTag = song.tags.find((tag) => !TAGS.includes(tag));
			expect(
				invalidTag,
				`Song with ID=${song.id} and title '${song.title}' contains the invalid tag '${invalidTag}'. Did you mean '${closest(invalidTag ?? '', TAGS)}'`,
			).toBeUndefined();
		});
	});
});
