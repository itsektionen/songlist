import { readFileSync } from 'fs';
import matter from 'gray-matter';
import { validMetaKeys } from '../src/definitions/song';
import { CATEGORY_TAGS, LANGUAGE_TAGS, TAGS } from '../src/definitions/tags';
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
					`Value ${metaKey} is not a valid metadata property (found in ${path})\nDid you mean '${closest(metaKey, validMetaKeys)}'?`,
				).toContain(metaKey);
			});
		});
	});

	test('All metadata are valid format', () => {
		const songs = getAllSongs(false);

		songs.forEach((song) => {
			//Title
			expect(typeof song.title, `Song '${song.title}' (ID=${song.id}) title is not a string.`).toBe(
				'string',
			);
			expect(
				Array.isArray(song.alternativeTitles) || song.alternativeTitles === undefined,
				`Song '${song.title}' (ID=${song.id}) alternative titles are not an array.`,
			).toBeTruthy();

			//Alternative Titles
			if (song.alternativeTitles) {
				song.alternativeTitles.forEach((title) => {
					expect(
						typeof title,
						`Song '${song.title}' (ID=${song.id}) alternative title '${title}' is not a string.`,
					).toBe('string');
				});
			}

			//Author
			if (song.author) {
				expect(
					Array.isArray(song.author),
					`Song '${song.title}' (ID=${song.id}) author is not an array.`,
				).toBeTruthy();

				song.author.forEach((author) => {
					expect(
						typeof author,
						`Song '${song.title}' (ID=${song.id}) author is not an object.`,
					).toBe('object');

					Object.keys(author).forEach((key) => {
						expect(
							VALID_AUTHOR_KEYS,
							`Song '${song.title}' (ID=${song.id}) contains an invalid author field '${key}'.`,
						).toContain(key);
					});

					VALID_AUTHOR_KEYS.forEach((key) => {
						if (key in author && author[key]) {
							if (key === 'year') {
								expect(
									typeof author[key],
									`Song '${song.title}' (ID=${song.id}) author year is not a number.`,
								).toBe('number');
							} else {
								expect(
									typeof author[key],
									`Song '${song.title}' (ID=${song.id}) author ${key} is not a string.`,
								).toBe('string');
							}
						}
					});
				});
			}

			//Melody
			if (song.melody) {
				expect(
					typeof song.melody,
					`Song '${song.title}' (ID=${song.id}) melody is not a string.`,
				).toBe('string');
			}

			//Composer
			if (song.composer) {
				expect(
					typeof song.composer,
					`Song '${song.title}' (ID=${song.id}) composer is not a string.`,
				).toBe('string');
			}

			//Notes
			if (song.notes) {
				expect(
					Array.isArray(song.notes),
					`Song '${song.title}' (ID=${song.id}) notes are not an array.`,
				).toBeTruthy();

				song.notes.forEach((note) => {
					expect(typeof note, `Song '${song.title}' (ID=${song.id}) note is not a string.`).toBe(
						'string',
					);
				});
			}

			//Tags
			expect(
				song.tags,
				`Song '${song.title}' (ID=${song.id}) tags are not an array.`,
			).toBeInstanceOf(Array);
			expect(
				song.tags.length,
				`Song '${song.title}' (ID=${song.id}) does not have any tags.`,
			).toBeGreaterThan(0);
			expect(
				song.tags.length,
				`Song '${song.title}' (ID=${song.id}) has more than 2 tags.`,
			).toBeLessThanOrEqual(2);
			// No tags are not part of list of tags
			const invalidTag = song.tags.find((tag) => !TAGS.includes(tag));
			expect(
				invalidTag,
				`Song '${song.title}' (ID=${song.id}) contains the invalid tag '${invalidTag}'. Did you mean '${closest(invalidTag ?? '', TAGS)}'?`,
			).toBeUndefined();
			const categoryTags = song.tags.filter((tag) =>
				(CATEGORY_TAGS as readonly string[]).includes(tag),
			);
			expect(
				categoryTags.length,
				`Song '${song.title}' (ID=${song.id}) does not have 1 category tag.`,
			).toBe(1);
			const languageTags = song.tags.filter((tag) =>
				(LANGUAGE_TAGS as readonly string[]).includes(tag),
			);
			if (song.tags.length == 2) {
				expect(
					languageTags.length,
					`Song '${song.title}' (ID=${song.id}) does not have 1 language tag.`,
				).toBe(1);
				expect(
					song.tags[0],
					`Song '${song.title}' (ID=${song.id}) does not have a category tag first.`,
				).toBe(categoryTags[0]);
				expect(
					song.tags[1],
					`Song '${song.title}' (ID=${song.id}) does not have a language tag last.`,
				).toBe(languageTags[0]);
			}

			//Sorting
			if (song.sorting) {
				expect(
					typeof song.sorting,
					`Song '${song.title}' (ID=${song.id}) sorting is not a number.`,
				).toBe('number');
			}

			//Deleted
			if (typeof song.deleted === 'boolean') {
				expect(
					song.deleted,
					`Song '${song.title}' (ID=${song.id}) deleted is not true.`,
				).toBeTruthy();
			} else {
				expect(
					song.deleted,
					`Song '${song.title}' (ID=${song.id}) deleted is not undefined.`,
				).toBeUndefined();
			}
		});
	});
});
