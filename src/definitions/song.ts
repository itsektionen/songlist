import { LegacyCategory, Tag } from './tags';

export type Song = {
	id: number;
	title: string;
	author?: Author[];
	melody?: string;
	composer?: string;
	tags: Tag[];
	sorting?: number;
	deleted?: true;
	content: string;
};

export type Author = {
	name?: string;
	event?: string;
	location?: string;
	year?: number;
	comment?: string;
};

export type XmlifyableSong = Song & {
	category: LegacyCategory;
};

export const validMetaKeys = [
	'title',
	'author',
	'melody',
	'composer',
	'tags',
	'sorting',
	'deleted',
];
