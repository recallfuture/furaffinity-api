// @ts-ignore
import HTMLParser from 'fast-html-parser';
import { SearchType, Species, Category, Gender, Rating } from './Enums';
import { SearchOptions } from './Request';
import { Submission } from '.';

export interface Result {
	type: SearchType,
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

export function ParseFigure(figure: any, type: SearchType): Result {
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

export function ParseSearch(body: string, options?: SearchOptions): Result[] {
	let root = HTMLParser.parse(body);
	let figures = root.querySelectorAll('figure');
	let results: Result[] = [];
	// @ts-ignore
	figures.forEach(figure => {
		if (figure.classNames) {
			let type = SearchType.All;
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
			results.push(ParseFigure(figure, SearchType.All));
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

	// Check system message
	let systemMessageNode = table.childNodes[1].childNodes[1].childNodes[1];
	if (systemMessageNode && systemMessageNode.rawText === 'System Message') {
		let systemMessage = table.childNodes[3].childNodes[1].rawText.trim();
		throw new Error(systemMessage);
	}

	// Get main nodes
	let download = table.querySelector('.aligncenter').childNodes[3].childNodes[0]; // download link
	let header = table.querySelector('.information').childNodes; // title of info table
	let stats = table.querySelector('.stats-container').childNodes; // stats container

	// Check category
	// @ts-ignore
	let category: Category = Category[stats[10].rawText.trim()];
	let iRes, iPosted, iRating, iSpecies, iGender, iFavorites, iComments, iViews, iKeywords
	if (category === Category.Music || category === Category.Story || category === Category.Poetry) {
		iPosted = 6;
		iFavorites = 18;
		iComments = 22;
		iViews = 26;
		iKeywords = 33;
	} else {
		iRes = 42;
		iPosted = 6;
		iRating = 55;
		iSpecies = 18;
		iGender = 22;
		iFavorites = 26;
		iComments = 30;
		iViews = 34;
		iKeywords = 49;
	}

	// for (let index = 0; index < stats.length; index++) {
	// 	const element = stats[index];
	// 	console.log(index + ':' + element.rawText.trim());
	// }

	let res = iRes ? stats[iRes].rawText.trim().split('x') : ['', '']; // res
	return {
		id,
		url: 'https://www.furaffinity.net/view/' + id,
		title: header[1].childNodes[0].rawText.trim(),
		posted: stats[iPosted].attributes.title || '',
		// @ts-ignore
		rating: iRating ? Rating[(/alt="([\s\S]+?) rating"/g.exec(stats[iRating].childNodes[1].rawAttrs) || '')[1]] : '',
		author: {
			url: 'https://www.furaffinity.net/user/' + header[3].childNodes[0].rawText.trim(),
			name: header[3].childNodes[0].rawText.trim()
		},
		content: {
			// @ts-ignore
			category,
			// @ts-ignore
			species: iSpecies ? Species[stats[iSpecies].rawText.trim()] : '',
			// @ts-ignore
			gender: iGender ? Gender[stats[iGender].rawText.trim()] : ''
		},
		stats: {
			favorites: parseInt(stats[iFavorites].rawText.trim()),
			comments: parseInt(stats[iComments].rawText.trim()),
			views: parseInt(stats[iViews].rawText.trim())
		},
		image: {
			url: 'https:' + (download.attributes.href || ''),
			width: res[0],
			height: res[1]
		},
		// @ts-ignore
		keywords: stats[iKeywords].childNodes.filter(x => {
			return !!x.tagName;
			// @ts-ignore
		}).map(x => {
			return x.childNodes[0].rawText;
		})
	};
};