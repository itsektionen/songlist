// Categories
export const GASUQUE = 'gasque';
export const BEER = 'beer';
export const WINE = 'wine';
export const SNAPS = 'snaps';
export const PUNSCH = 'punsch';
export const FOREIGN = 'foreign';
export const NERDY = 'nerdy';
export const ESOTERIC = 'esoteric';
export const SOLEMN = 'solemn';
// Languages
export const SWE = 'swe';
export const ENG = 'eng';

export const TAGS = <const>[
	GASUQUE,
	BEER,
	WINE,
	SNAPS,
	PUNSCH,
	FOREIGN,
	NERDY,
	ESOTERIC,
	SOLEMN,
	SWE,
	ENG,
];

// For legacy songlist
// To deal with possible future songs that might not match any of the legacy tags
export const UNKNOWN = 'unknown';

export const LEGACY_MAP = {
	[GASUQUE]: 'Gasque',
	[BEER]: 'Öhl',
	[WINE]: 'Wihn',
	[SNAPS]: 'Brännvin',
	[PUNSCH]: 'Punsch',
	[FOREIGN]: 'Utländskt',
	[NERDY]: 'Nördigt',
	[ESOTERIC]: 'Esoterica',
	[SOLEMN]: 'Högtidligt',
	[UNKNOWN]: 'Okänt',
} as const;

export const LEGACY_ORDER = [
	LEGACY_MAP[GASUQUE],
	LEGACY_MAP[BEER],
	LEGACY_MAP[WINE],
	LEGACY_MAP[SNAPS],
	LEGACY_MAP[PUNSCH],
	LEGACY_MAP[FOREIGN],
	LEGACY_MAP[NERDY],
	LEGACY_MAP[ESOTERIC],
	LEGACY_MAP[SOLEMN],
	LEGACY_MAP[UNKNOWN],
];

export const CATEGORY_ORDER = [
	GASUQUE,
	BEER,
	WINE,
	SNAPS,
	PUNSCH,
	FOREIGN,
	NERDY,
	ESOTERIC,
	SOLEMN,
	UNKNOWN,
];

export type Tag = (typeof TAGS)[number];

export type LegacyCategory = (typeof LEGACY_ORDER)[number];
