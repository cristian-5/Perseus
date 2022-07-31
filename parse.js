
import { readLines } from 'https://deno.land/std/io/buffer.ts';
import { writeAllSync } from 'https://deno.land/std/streams/conversion.ts';

const out = await Deno.open('./Latin.xml', {
	write: true, create: true, append: true
});

const encoder = new TextEncoder();
writeAllSync(out, encoder.encode('<?xml version="1.0" encoding="UTF-8"?>\n'));
writeAllSync(out, encoder.encode('<d:dictionary xmlns="http://www.w3.org/1999/xhtml" xmlns:d="http://www.apple.com/DTDs/DictionaryService-1.0.rng">\n'));

const xml = await Deno.open('./lat.ls.perseus-eng2.xml');

for await (let entry of readLines(xml)) {
	if (!entry.startsWith('<entry')) continue;
	entry = entry.replace(
		/<entryFree(?:.+?)key="(.+?)"(?:.*?)id="(.+?)"(?:.*?)>/,
		'<d:entry d:title="$1" id="$2"><d:index d:value="$1"/><h1>$1</h1>'
	)
	.replace(/<\/entryFree>\n?/m, '')
	.replace(/<orth\s+lang="(\w+?)"\s*extent="full"\s*>/g, '<orth lang="$1">')
	.replace(/<hi\s+rend="sup"\s*>(.*?)<\/hi>/g, '<sup>$1</sup>')
	.replace(/<hi\s+rend="ital"\s*>/g, '<i>').replace(/<\/hi>/g, '</i>')
	.replace(/<usg\s+type=".*?"\s*>/g, '<b>').replace(/<\/usg>/g, '</b>')
	.replace(/<bibl(.*?)>/g, '<bibl>')
	.replace(/<foreign><\/foreign>/g, '').replace(/\s+,\s*/g, ', ')
	.replace(/,(\S)/g, ', $1').replace(/—\s*\*?/g, '')

	// match all the other senses in order and transform them to <li>s:
	let last = 0, stack = 0;
	entry = entry.replace(/<sense(.*?)>(.*?)<\/sense>/g, sense => {
		const final = [];
		const level = parseInt(sense.match(/level="(\d)"/)[1]);
		if (level > last || stack == 0) {
			stack++;
			let type = sense.match(/n="(.*?)"/)[1];
			if (/^[IVX]+$/.test(type)) type = 'roman';
			else if (/^[A-Z]+$/.test(type)) type = 'alpha';
			else if (/^\([A-Za-z]+\)$/.test(type)) type = 'greek';
			else type = 'roman';
			final.push(`<ol class="${type}">`);
		} else if (level < last) {
			final.push('</ol>');
			stack--;
		}
		final.push(sense
			.replace(/<sense(.*?)>/, '<li>')
			.replace(/<\/sense>/, '</li>')
		);
		last = level;
		return final.join('');
	});

	for (let i = 0; i < stack; i++) entry += '</ol>';
	entry += '</d:entry>\n';

	writeAllSync(out, encoder.encode(entry));
}

writeAllSync(out, encoder.encode('</d:dictionary>\n'));
