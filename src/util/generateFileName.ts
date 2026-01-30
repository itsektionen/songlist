import { readFileSync } from 'fs';
import matter from 'gray-matter';
import { parse as parseFile } from 'path';
import { generateFileName } from './normalizeTitle';

export function getIdFromFileName(file: string): number {
	const fileName = parseFile(file).name;
	let idBuilder = '';
	for (let i = 0; i < fileName.length; i++) {
		const char = fileName.charAt(i);
		if (!char.match(/[0-9]/)) break;
		idBuilder += char;
	}

	if (idBuilder.length < 1) throw new Error(`Could not find an ID for the file ${file}`);

	return Number(idBuilder);
}

export function generateSongNameFromCurrentName(file: string, fileContent?: string): string {
	const content = typeof fileContent === 'string' ? fileContent : readFileSync(file).toString();
	const { data } = matter(content);
	const title = data.title as string;
	const id = getIdFromFileName(file);

	return generateFileName(title, id);
}
