import { readFileSync } from 'fs';
import matter from 'gray-matter';
import { parse as parseFile } from 'path';

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

	return generateSongName(title, id);
}

export default function generateSongName(title: string, id: number): string {
	const normalizedTitle = (title as string)
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-zA-Z0-9 ]/g, '')
		.replace(/\s/g, '_');

	return `${id}_${normalizedTitle}.md`;
}
