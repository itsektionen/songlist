export type Author = {
	name?: string;
	event?: string;
	location?: string;
	year?: number;
	comment?: string;
};

export const VALID_AUTHOR_KEYS: Array<keyof Author> = [
	'name',
	'event',
	'location',
	'year',
	'comment',
];
