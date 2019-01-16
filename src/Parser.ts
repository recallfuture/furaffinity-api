// @ts-ignore
import HTMLParser from 'fast-html-parser';
import { Type, Species, Category, Gender, Rating } from './Enums';
import { SearchOptions } from './Request';
import { Submission } from '.';

export interface Result {
	type: Type,
	id: Number,
	title: string,
	url: string,
	thumb: {
		icon: string,
		tiny: string,
		small: string,
		medium: string,
		large: string
	},
	author: {
		url: string,
		name: string
	},
	getSubmission(): Promise<Submission>
};

export function ParseFigure(figure: any, type: Type): Result {
	let id = figure.id.split('-').pop();
	let thumb = 'https:' + (/src="([\s\S]+?)"/.exec(figure.childNodes[0].childNodes[0].childNodes[0].childNodes[0].rawAttrs) || [])[1];
	return {
		type,
		id,
		title: figure.childNodes[1].childNodes[0].childNodes[0].childNodes[0].rawText,
		url: 'https://www.furaffinity.net/view/' + id,
		thumb: {
			icon: thumb.replace(/@\d+?-/g, '@75-'),
			tiny: thumb.replace(/@\d+?-/g, '@150-'),
			small: thumb.replace(/@\d+?-/g, '@300-'),
			medium: thumb.replace(/@\d+?-/g, '@800-'),
			large: thumb.replace(/@\d+?-/g, '@1600-')
		},
		author: {
			url: 'https://www.furaffinity.net' + (/href="([\s\S]+?)"/.exec(figure.childNodes[1].childNodes[1].childNodes[2].rawAttrs) || [])[1],
			name: figure.childNodes[1].childNodes[1].childNodes[2].childNodes[0].rawText
		},
		getSubmission: async () => {
			return await Submission(id);
		}
	};
};

export function ParseIndex(body: string, type?: Type): Result[] {
	let root = HTMLParser.parse(body);
	let sections = root.querySelectorAll('section');
	let results: Result[] = [];
	let types = [Type.Artwork, Type.Writing, Type.Music, Type.Crafts];
	// @ts-ignore
	sections.forEach((section, i) => {
		if (type && types[i] != type) return;
		// @ts-ignore
		section.childNodes.forEach(figure => {
			if (figure.classNames) {
				results.push(ParseFigure(figure, types[i]));
			}
		});
	});
	return results;
};

export function ParseSearch(body: string, options?: SearchOptions): Result[] {
	let root = HTMLParser.parse(body);
	let figures = root.querySelectorAll('figure');
	let results: Result[] = [];
	// @ts-ignore
	figures.forEach(figure => {
		if (figure.classNames) {
			let type = Type.Any;
			if (options && options.type) type = options.type;
			results.push(ParseFigure(figure, type));
		}
	});
	return results;
};

export function ParseBrowse(body: string): Result[] {
	let root = HTMLParser.parse(body);
	let figures = root.querySelectorAll('figure');
	let results: Result[] = [];
	// @ts-ignore
	figures.forEach(figure => {
		if (figure.classNames) {
			results.push(ParseFigure(figure, Type.Any));
		}
	});
	return results;
};

export interface Submission {
	id: Number,
	url: string,
	title: string,
	posted: string,
	rating: Rating,
	author: {
		url: String,
		name: string
	},
	content: {
		category: Category,
		species: Species,
		gender: Gender
	},
	stats: {
		favorites: Number,
		comments: Number,
		views: Number
	},
	image: {
		url: string,
		width: Number,
		height: Number
	},
	keywords: string[]
};

export function ParseSubmission(body: string, id: Number): Submission {
	let root = HTMLParser.parse(body);
	let table = root.querySelector('.maintable');
	if (table.childNodes[1].childNodes[1].childNodes[1]) throw new Error('This submission cannot be viewed, this may be because the owner requires you to login, you haven\'t logged in to view mature content or you have not enabled mature content.');
	let main = table.childNodes[3].childNodes[1];
	let info = main.childNodes[20]; // info .maintable
	let header = info.childNodes[1].childNodes[1].childNodes; // title of info table
	let stats = info.childNodes[1].childNodes[3].childNodes[1].childNodes[1].childNodes[1].childNodes; // stats container
	let res = stats[42].rawText.trim().split('x'); // res
	return {
		id,
		url: 'https://www.furaffinity.net/view/' + id,
		title: header[1].childNodes[0].rawText.trim(),
		posted: (/title="([\s\S]+?)"/g.exec(stats[6].rawAttrs) || '')[1],
		// @ts-ignore
		rating: Rating[(/alt="([\s\S]+?) rating"/g.exec(stats[55].childNodes[1].rawAttrs) || '')[1]],
		author: {
			url: 'https://www.furaffinity.net/user/' + header[3].childNodes[0].rawText.trim(),
			name: header[3].childNodes[0].rawText.trim()
		},
		content: {
			// @ts-ignore
			category: Category[stats[10].rawText.trim()],
			// @ts-ignore
			species: Species[stats[18].rawText.trim()],
			// @ts-ignore
			gender: Gender[stats[22].rawText.trim()]
		},
		stats: {
			favorites: parseInt(stats[26].rawText.trim()),
			comments: parseInt(stats[30].rawText.trim()),
			views: parseInt(stats[34].rawText.trim())
		},
		image: {
			url: 'https:' + (/src="([\s\S]+?)"/g.exec(main.childNodes[5].rawAttrs) || '')[1],
			width: res[0],
			height: res[1]
		},
		// @ts-ignore
		keywords: stats[49].childNodes.filter(x => {
			return !!x.tagName;
		// @ts-ignore
		}).map(x => {
			return x.childNodes[0].rawText;
		})
	};
};