import cheerio from 'cheerio';
import { SubmissionType, Species, Category, Gender, Rating } from './Enums';
import { Author, Result, Submission } from './interfaces';
import { Submission as GetSubmission } from '.';

/**
 * Convert author name to author id
 * @param name author name
 */
function convertNameToId(name: string): string {
	return name.trim().split('_').join('').toLowerCase();
}

/**
 * Get class names from element
 * @param element CheerioElement
 */
function classNames(element: CheerioElement): string[] {
	return element.attribs.class.split(' ');
}

function checkSystemMessage($: CheerioStatic) {
	// Check system message
	const noticeMessage = $('section.notice-message');
	if (noticeMessage.length !== 0) {
		const systemMessage = noticeMessage[0].childNodes[1].childNodes[3].childNodes[0].nodeValue;
		throw new Error(systemMessage);
	}
}

/**
 * Parse result from figure element
 * @param figure CheerioElement
 */
export function ParseFigure(figure: CheerioElement, author?: Author): Result {
	const id: string = figure.attribs.id.split('-').pop() ?? '';
	const thumb: string = 'http:' + figure.childNodes[0].childNodes[0].childNodes[0].childNodes[0].attribs.src;

	return {
		type: SubmissionType[classNames(figure)[1].split('-').pop() as keyof typeof SubmissionType],
		id,
		title: figure.childNodes[1].childNodes[0].childNodes[0].childNodes[0]?.nodeValue ?? '',
		url: `https://www.furaffinity.net/view/${id}`,
		rating: Rating[classNames(figure)[0].split('-').pop()?.replace(/^[a-z]/, ($1: string) => $1.toUpperCase()) as keyof typeof Rating],
		thumb: {
			icon: thumb.replace(/@\d+?-/g, '@75-'),
			tiny: thumb.replace(/@\d+?-/g, '@150-'),
			small: thumb.replace(/@\d+?-/g, '@300-'),
			medium: thumb.replace(/@\d+?-/g, '@800-'),
			large: thumb.replace(/@\d+?-/g, '@1600-')
		},
		author: author ?? {
			id: classNames(figure)[2].slice(2),
			url: `https://www.furaffinity.net/user/${classNames(figure)[2].slice(2)}`,
			name: figure.childNodes[1].childNodes[1].childNodes[2].childNodes[0].nodeValue.trim()
		},
		getSubmission: async () => {
			return await GetSubmission(id);
		}
	};
};

/**
 * Parse all figure's info from HTML
 * @param body HTML document
 */
export function ParseFigures(body: string): Result[] {
	const $ = cheerio.load(body);

	let author: Author | undefined;
	try {
		author = ParseAuthor(body);
	} catch (e) {
	}

	const results: Result[] = [];
	$('figure').each((index, figure) => {
		results.push(ParseFigure(figure, author));
	});
	return results;
};

/**
 * Get submission's info
 * @param body HTML document
 * @param id Subumission id
 */
export function ParseSubmission(body: string, id: string): Submission {
	const $ = cheerio.load(body);

	checkSystemMessage($);

	// Get main nodes
	const main = $('#columnpage');
	const sidebar = main.find('.submission-sidebar');
	const content = main.find('.submission-content');

	const stats = sidebar.find('.stats-container');
	const info = sidebar.find('.info');
	const tags = sidebar.find('.tags-row .tags a');

	// buttons
	let downloadUrl: string = `http:${sidebar.find('.buttons .download a')[0].attribs.href}`;
	const favLink: string = `$http://furaffinity.net/${sidebar.find('.buttons .fav a')[0].attribs.href}`;
	console.log(downloadUrl);

	// header
	const title: string = content.find('.submission-id-sub-container .submission-title p')[0].childNodes[0].data?.trim() ?? '';
	const authorName: string = content.find('.submission-id-sub-container a strong')[0].childNodes[0].data?.trim() ?? '';
	const authorId: string = convertNameToId(authorName);
	const posted: string = content.find('.submission-id-sub-container strong span')[0].attribs.title;
	const authorAvatar: string = `http:${content.find('.submission-id-avatar img')[0].attribs.src}`;
	const authorShinies: boolean = (!!$('.shinies-promo'));

	// stats
	const rating: Rating = Rating[stats.find('.rating span')[0].childNodes[0].data?.trim() as keyof typeof Rating];
	const favorites: number = Number.parseInt(stats.find('.favorites span')[0].childNodes[0].data?.trim() ?? '');
	const comments: number = Number.parseInt(stats.find('.comments span')[0].childNodes[0].data?.trim() ?? '');
	const views: number = Number.parseInt(stats.find('.views span')[0].childNodes[0].data?.trim() ?? '');

	// info
	const category: Category = Category[info.find('.category-name')[0].childNodes[0].data?.trim() as keyof typeof Category];
	const species: Species = Species[info[0].childNodes[3].childNodes[2].childNodes[0].data?.trim() as keyof typeof Species];
	const gender: Gender = Gender[info[0].childNodes[5].childNodes[2].childNodes[0].data?.trim() as keyof typeof Gender];

	// fix url when category is story or poetry
	if (category === Category.Story || category === Category.Poetry) {
		downloadUrl = downloadUrl.replace('d.facdn.net/download/', 'd.facdn.net/');
	}

	const previewUrl: string | undefined = 
		(content.find('.submission-area img').length > 0) 
		? `http:${content.find('.submission-area img')[0].attribs['data-preview-src']}` 
		: undefined;

	return {
		id,
		url: `http://www.furaffinity.net/view/${id}`,
		title: title,
		posted: Date.parse(posted),
		favLink,
		rating: rating,
		author: {
			id: authorId,
			name: authorName,
			url: `http://www.furaffinity.net/user/${authorId}`,
			avatar: authorAvatar,
			shinies: authorShinies,
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
		downloadUrl,
		previewUrl,
		keywords: tags.map((index, tag) => {
			return tag.childNodes[0].data?.trim() ?? '';
		}).get()
	};
};

/**
 * Get author's info
 * @param body HTML document
 */
export function ParseAuthor(body: string): Author {
	const $ = cheerio.load(body);

	checkSystemMessage($);

	const name: string = $('.userpage-flex-item.username span')[0].childNodes[0].data?.trim().slice(1) ?? '';
	const id: string = convertNameToId(name);
	const url: string = `http://www.furaffinity.net/user/${id}`;
	const shinies: boolean = (!!$('.userpage-layout-left-col-content > a:nth-child(4)'));
	const avatar: string = `http:${$('.user-nav-avatar')[0].attribs.src}`;

	return {
		id,
		name,
		url,
		avatar,
		shinies,
	};
}

/**
 * Get the current logged in user
 * @param body HTML document
 */
export function ParseUser(body: string): Author | null {
	const $ = cheerio.load(body);

	checkSystemMessage($);

	if ($('#my-username').length === 0) {
		return null;
	}

	const name: string = $('#my-username')[1].childNodes[0].data?.trim() ?? '';
	const id: string = convertNameToId(name);
	const url: string = `http://www.furaffinity.net/user/${id}`;
	const shinies: boolean = ($('.userpage-layout-left-col-content > a:nth-child(4)').length > 0);
	const avatar: string = `http:${$('.loggedin_user_avatar')[0].attribs.src}`;

	return {
		id,
		name,
		url,
		shinies,
		avatar
	}
}

/**
 * Get all Author's info from peer page of watching list
 * @param body HTML document
 */
export function ParseWatchingList(body: string): Author[] {
	const $ = cheerio.load(body);

	checkSystemMessage($);

	return $('.watch-list-items a').map((index, a) => {
		const name = a.childNodes[0].data?.trim() ?? '';
		const id = convertNameToId(name);
		const url = `http://www.furaffinity.net/user/${id}`;
		return {
			id,
			name,
			url
		};
	}).get();
}

/**
 * Get all Author's info from peer page of watching list
 * @param body HTML document
 */
export function ParseMyWatchingList(body: string): Author[] {
	const $ = cheerio.load(body);

	checkSystemMessage($);

	return $('.flex-item-watchlist').map((index, div) => {
		const avatar = `http:${$(div).find('img.avatar')[0].attribs.src}`;
		const name = $(div).find('.flex-item-watchlist-controls a strong')[0].childNodes[0].data?.trim() ?? '';
		const id = convertNameToId(name);
		const url = `http://www.furaffinity.net/user/${id}`;
		return {
			id,
			name,
			url,
			avatar
		};
	}).get();
}