import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import {
	JSON_SONGS_PATH,
	DIST_FILES,
	DIST_FOLDER_PATH,
	XML_NO_IDS_SONGS_PATH,
	XML_SONGS_PATH,
} from '../src/definitions/paths';
import { getAllSongs, sortSongs } from '../src/util/songs';
import { buildXmlString } from '../src/util/xml';

describe('Builds are up to date', () => {
	test('JSON', () => {
		const { songs, updatedAt } = JSON.parse(readFileSync(JSON_SONGS_PATH).toString());

		expect(songs).toEqual(sortSongs(getAllSongs()).map(({ sorting, ...song }) => song));
		expect(updatedAt).toMatch(/^\d{4}-(0\d|1[012])-([012]\d|3[01])$/);
	});

	test('XML', () => {
		const xmlContent = readFileSync(XML_SONGS_PATH).toString();
		const date = xmlContent.match(/updated=".+?"/)?.[0].split('"')[1];

		expect(date).not.toBeUndefined();
		expect(xmlContent).toBe(buildXmlString(getAllSongs(), date as string, true));
	});

	test('XML no IDs', () => {
		const xmlContent = readFileSync(XML_NO_IDS_SONGS_PATH).toString();
		const date = xmlContent.match(/updated=".+?"/)?.[0].split('"')[1];

		expect(date).not.toBeUndefined();
		expect(xmlContent).toBe(buildXmlString(getAllSongs(), date as string, false));
	});

	test('No additional files are present in public folder', () => {
		const publicFiles = readdirSync(DIST_FOLDER_PATH).map((fileName) =>
			join(DIST_FOLDER_PATH, fileName)
		);

		const invalidFile = publicFiles.find((file) => !DIST_FILES.includes(file));
		expect(invalidFile, `${invalidFile} should not exist`).toBeUndefined();
	});
});
