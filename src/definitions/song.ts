import { LegacyCategory, Tag } from './tags';
import { Author } from './author';

export type Song = {
	id: number;
	title: string;
	alternativeTitles?: string[];
	author?: Author[];
	melody?: string;
	composer?: string;
	abc?: string;
	notes?: string[];
	tags: Tag[];
	sorting?: number;
	deleted?: true;
	content: string;
};

export type XmlifyableSong = Song & {
	category: LegacyCategory;
};

export const validMetaKeys = [
	'title',
	'alternativeTitles',
	'author',
	'melody',
	'composer',
	'abc',
	'notes',
	'tags',
	'sorting',
	'deleted',
];
