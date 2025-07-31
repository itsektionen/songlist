import { Song, XmlifyableSong } from '../definitions/song';
import { LegacyCategory, LEGACY_MAP, UNKNOWN } from '../definitions/tags';
import { sortXmlifyableSongs } from './songs';
import { formatAuthor } from './formatAuthor';

export const SONGS_DESCRIPTION =
	'IT-sektionens sångbok, Strängteoretiquernas reviderade version (2009-2015)';

function songToXmlAttributes(song: XmlifyableSong): string {
	let attributes = `\n\t\tname="${safeXmlString(song.title)}"`;
	if (song.alternativeTitles)
		attributes += `\n\t\talternativeTitles="${song.alternativeTitles.map(safeXmlString).join(';')}"`;

	attributes += `\n\t\tid="${song.id}"`;

	if (song.author) attributes += `\n\t\tauthor="${safeXmlString(formatAuthor(song.author))}"`;
	if (song.composer) attributes += `\n\t\tcomposer="${safeXmlString(song.composer)}"`;
	if (song.melody) attributes += `\n\t\tmelody="${safeXmlString(song.melody)}"`;
	if (song.notes) attributes += `\n\t\tnotes="${safeXmlString(song.notes.join(';'))}"`;
	attributes += `\n\t\tcategory="${safeXmlString(song.category)}"`;

	return attributes;
}

function safeXmlString(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

function xmlifyParagraph(content: Song['content']): string {
	const lines = content.replace(/\\\*/g, '*').replace(/\\#/g, '#').split('\n');
	if (lines.length === 1) return lines[0];

	return `\n\t\t\t${safeXmlString(lines.join('\n\t\t\t'))}\n\t\t`;
}

function songContentToXml(content: Song['content']): string {
	let xml = '';
	content.split('\n\n').forEach((paragraph) => {
		if (paragraph.match(/^# .+/)) {
			xml += `\t\t<header>${xmlifyParagraph(paragraph.substring(2))}</header>\n`;
		} else if (paragraph.match(/^> .+/)) {
			xml += `\t\t<comment>${xmlifyParagraph(
				paragraph
					.split('\n')
					.map((s) => s.substring(2))
					.join('\n'),
			)}</comment>\n`;
		} else {
			xml += `\t\t<p>${xmlifyParagraph(paragraph)}</p>\n`;
		}
	});

	return xml;
}

function generateXmlifyableSong(song: Song): XmlifyableSong {
	let category: LegacyCategory;
	for (let i = 0; i < song.tags.length; i++)
		if (LEGACY_MAP[song.tags[i]]) {
			category = LEGACY_MAP[song.tags[i]];
			break;
		}
	if (!category) category = LEGACY_MAP[UNKNOWN];

	return { ...song, category: category };
}

export function buildXmlString(songs: Song[], updatedAt: string): string {
	let xml = '<?xml version="1.0" encoding="utf-8"?>\n';
	xml += `<songs description="${safeXmlString(SONGS_DESCRIPTION)}" updated="${updatedAt}">\n`;

	const xmlifyAblesongs = songs.map((song) => generateXmlifyableSong(song));
	sortXmlifyableSongs(xmlifyAblesongs).forEach((song) => {
		xml += `\t<song${songToXmlAttributes(song)}\n\t>\n`;
		xml += songContentToXml(song.content);
		xml += '\t</song>\n';
	});
	xml += '</songs>\n';

	return xml;
}
