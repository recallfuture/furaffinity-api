import HTMLParser from 'fast-html-parser';
import { SubmissionType, Species, Category, Gender, Rating } from './Enums';
import { Submission } from '.';
import { GetWatchingList } from './Request';

function ConvertNameToId(name: string): string {
	return name.trim().replace('_', '').toLowerCase();
}

export interface Result {
	type: SubmissionType,
	id: string,
	title: string,
	url: string,
	rating: Rating,
	thumb: {
		icon: string,
		tiny: string,
		small: string,
		medium: string,
		large: string
	},
	author: Author,
	getSubmission(): Promise<Submission>
};

export function ParseFigure(figure: any): Result {
	let id = figure.id.split('-').pop();
	let thumb = 'http:' + figure.childNodes[0].childNodes[0].childNodes[0].childNodes[0].attributes.src;
	return {
		type: SubmissionType[figure.classNames[1].split('-').pop() as keyof typeof SubmissionType],
		id,
		title: figure.childNodes[1].childNodes[0].childNodes[0].childNodes[0].rawText,
		url: 'https://www.furaffinity.net/view/' + id,
		rating: Rating[figure.classNames[0].split('-').pop().replace(/^[a-z]/, ($1: string) => $1.toUpperCase()) as keyof typeof Rating],
		thumb: {
			icon: thumb.replace(/@\d+?-/g, '@75-'),
			tiny: thumb.replace(/@\d+?-/g, '@150-'),
			small: thumb.replace(/@\d+?-/g, '@300-'),
			medium: thumb.replace(/@\d+?-/g, '@800-'),
			large: thumb.replace(/@\d+?-/g, '@1600-')
		},
		author: {
			id: figure.classNames[2].slice(2),
			url: 'https://www.furaffinity.net/user/' + figure.classNames[2].slice(2),
			name: figure.childNodes[1].childNodes[1].childNodes[2].childNodes[0].rawText
		},
		getSubmission: async () => {
			return await Submission(id);
		}
	};
};

export function ParseFigures(body: string): Result[] {
	let root = HTMLParser.parse(body);
	let figures = root.querySelectorAll('figure');
	let results: Result[] = [];
	// @ts-ignore
	figures.forEach(figure => {
		if (figure.classNames) {
			results.push(ParseFigure(figure));
		}
	});
	return results;
};

export interface Submission {
	id: string,
	url: string,
	title: string,
	posted: number,
	rating: Rating,
	author: Author,
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
	downloadUrl: string,
	keywords: string[]
};

export function ParseSubmission(body: string, id: string): Submission {
	let root = HTMLParser.parse(body);

	// Check system message
	let noticeMessage = root.querySelector('section.notice-message');
	if (noticeMessage) {
		let systemMessage = noticeMessage.childNodes[1].childNodes[3].childNodes[0].rawText;
		throw new Error(systemMessage);
	}

	// Get main nodes
	let main = root.querySelector('#columnpage');
	let sidebar = main.querySelector('.submission-sidebar');
	let content = main.querySelector('.submission-content');

	let stats = sidebar.querySelector('.stats-container');
	let info = sidebar.querySelector('.info');
	let tags = sidebar.querySelectorAll('.tags-row .tags a');

	// buttons
	let downloadUrl: string = 'http:' + sidebar.querySelector('.buttons .download a').attributes.href;

	// header
	let title: string = content.querySelector('.submission-id-sub-container .submission-title p').rawText;
	let authorName: string = content.querySelector('.submission-id-sub-container a strong').rawText.trim();
	let authorId: string = ConvertNameToId(authorName);
	let posted: string = content.querySelector('.submission-id-sub-container strong span').attributes.title;

	// stats
	let rating: Rating = Rating[stats.querySelector('.rating span').rawText.trim() as keyof typeof Rating];
	let favorites: number = Number.parseInt(stats.querySelector('.favorites span').rawText);
	let comments: number = Number.parseInt(stats.querySelector('.comments span').rawText);
	let views: number = Number.parseInt(stats.querySelector('.views span').rawText);

	// info
	let category: Category = Category[info.querySelector('.category-name').rawText as keyof typeof Category];
	let species: Species = Species[info.childNodes[3].childNodes[2].rawText as keyof typeof Species];
	let gender: Gender = Gender[info.childNodes[5].childNodes[2].rawText as keyof typeof Gender];

	return {
		id,
		url: 'http://www.furaffinity.net/view/' + id,
		title: title,
		posted: Date.parse(posted),
		// @ts-ignore
		rating: rating,
		author: {
			id: authorId,
			name: authorName,
			url: 'http://www.furaffinity.net/user/' + authorId
		},
		content: {
			category,
			species,
			gender
		},
		stats: {
			favorites,
			comments,
			views
		},
		// fix url when category is story or poetry
		downloadUrl: category === Category.Story || category === Category.Poetry ? downloadUrl.replace('d.facdn.net/download/', 'd.facdn.net/') : downloadUrl,
		// @ts-ignore
		keywords: tags.map(tag => {
			return tag.rawText.trim();
		})
	};
};

export interface Author {
	id: string,
	name: string,
	url: string,
	avatar?: string,
}

export function ParseAuthor(body: string): Author {
	let root = HTMLParser.parse(body);

	let name = root.querySelector('.userpage-flex-item.username span').rawText.trim().slice(1);
	let id = ConvertNameToId(name);
	let url = 'http://www.furaffinity.net/user/' + id;
	let avatar = 'http:' + root.querySelector('.user-nav-avatar').attributes.src;

	return {
		id,
		name,
		url,
		avatar,
	};
}

export async function WatchingList(id: string): Promise<Author[]> {
	let result: Author[] = [];
	let page = 1;

	while (true) {
		const users = ParseWatchingList(await GetWatchingList(id, page++));
		result = [...result, ...users];
		if (users.length === 0 || users.length < 200) {
			break;
		}
	}

	return result;
}

export function ParseWatchingList(body: string): Author[] {
	let root = HTMLParser.parse(body);
	return root.querySelectorAll('.watch-list-items a').map(a => {
		let name = a.rawText.trim();
		let id = ConvertNameToId(name);
		let url = 'http://www.furaffinity.net/user/' + id;
		return {
			id,
			name,
			url
		};
	})
}
