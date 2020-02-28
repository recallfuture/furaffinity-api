const ENDPOINT = 'http://www.furaffinity.net';
import { Rating, SearchType, Category, Tag, Species, Gender } from './Enums';

import { default as cloudscraper, Response } from 'cloudscraper';

export const COOKIES = { loggedIn: false, a: '', b: '' };

export function Login(cookieA: string, cookieB: string) {
	COOKIES.loggedIn = true;
	COOKIES.a = cookieA;
	COOKIES.b = cookieB;
}

export function SetProxy(config?: false | string) {
	cloudscraper.defaults({ proxy: config });
}

export interface SearchOptions {
	page?: number,
	rating?: Rating,
	type?: SearchType
};

export interface BrowseOptions {
	page?: number,
	rating?: Rating,
	category?: Category,
	tag?: Tag,
	species?: Species,
	gender?: Gender
};

export async function FetchIndex(): Promise<string> {
	return await new Promise((resolve, reject) => {
		cloudscraper({
			url: ENDPOINT,
			headers: COOKIES.loggedIn ? {
				Cookie: `a=${COOKIES.a}; b=${COOKIES.b}`
			} : {}
		}, (error: any, response: Response, body: string) => {
			if (error) {
				console.error(error);
				reject();
			}
			if(response.statusCode !== 200) {
				console.error(`${response.statusCode}: `, response.statusMessage);
				reject();
			}
	
			resolve(body);
		});
	});
}

export async function FetchSearch(query: string, options?: SearchOptions): Promise<string> {
	const url = `${ENDPOINT}/search/?q=${encodeURIComponent(query)}`;
	return await new Promise((resolve, reject) => {
		cloudscraper({
			url,
			headers: COOKIES.loggedIn ? {
				Cookie: `a=${COOKIES.a}; b=${COOKIES.b}`
			} : {},
			formData: options ? {
				'rating-general': (options.rating || Rating.Any) & Rating.General ? 'on' : 'off',
				'rating-mature': (options.rating || Rating.Any) & Rating.Mature ? 'on' : 'off',
				'rating-adult': (options.rating || Rating.Any) & Rating.Adult ? 'on' : 'off',
				'type-art': (options.type || SearchType.All) & SearchType.Art ? 'on' : 'off',
				'type-flash': (options.type || SearchType.All) & SearchType.Flash ? 'on' : 'off',
				'type-photo': (options.type || SearchType.All) & SearchType.Photos ? 'on' : 'off',
				'type-music': (options.type || SearchType.All) & SearchType.Music ? 'on' : 'off',
				'type-story': (options.type || SearchType.All) & SearchType.Story ? 'on' : 'off',
				'type-poetry': (options.type || SearchType.All) & SearchType.Poetry ? 'on' : 'off',
				perpage: 72,
				page: options.page || 1,
			} : {}
		}, (error: any, response: Response, body: string) => {
			if (error) {
				console.error(error);
				reject();
			}
			if(response.statusCode !== 200) {
				console.error(`${response.statusCode}: `, response.statusMessage);
				reject();
			}
	
			resolve(body);
		});
	});
}

let warn = false;
export async function FetchBrowse(options?: BrowseOptions): Promise<string> {
	warn || console.log('WARN: Browse currently ignores any options passed.');
	warn = true;
	const newOptions: BrowseOptions = Object.assign({
		category: 1,
		tag: 1,
		species: 1,
		gender: 1
	}, options);
	const url = `${ENDPOINT}/browse`;
	return await new Promise((resolve, reject) => {
		cloudscraper({
			url,
			headers: COOKIES.loggedIn ? {
				Cookie: `a=${COOKIES.a}; b=${COOKIES.b}`
			} : {},
			formData: {
				'rating-general': (newOptions.rating || 0x7) & Rating.General ? 'on' : 'off',
				'rating-mature': (newOptions.rating || 0x7) & Rating.Mature ? 'on' : 'off',
				'rating-adult': (newOptions.rating || 0x7) & Rating.Adult ? 'on' : 'off',
				'cat': newOptions.category,
				'atype': newOptions.tag,
				'species': newOptions.species,
				'gender': newOptions.gender,
				perpage: 72,
				go: 'Update',
				page: newOptions.page || 1,
			}
		}, (error: any, response: Response, body: string) => {
			if (error) {
				console.error(error);
				reject();
			}
			if(response.statusCode !== 200) {
				console.error(`${response.statusCode}: `, response.statusMessage);
				reject();
			}
	
			resolve(body);
		});
	});
}

export async function FetchGallery(id: string, page: number = 1): Promise<string> {
	const url = `${ENDPOINT}/gallery/${id}/${page}`;
	return await new Promise((resolve, reject) => {
		cloudscraper({
			url,
			headers: COOKIES.loggedIn ? {
				Cookie: `a=${COOKIES.a}; b=${COOKIES.b}`
			} : {}
		}, (error: any, response: Response, body: string) => {
			if (error) {
				console.error(error);
				reject();
			}
			if(response.statusCode !== 200) {
				console.error(`${response.statusCode}: `, response.statusMessage);
				reject();
			}
	
			resolve(body);
		});
	});
}

export async function FetchScraps(id: string, page: number = 1): Promise<string> {
	const url = `${ENDPOINT}/scraps/${id}/${page}`;
	return await new Promise((resolve, reject) => {
		cloudscraper({
			url,
			headers: COOKIES.loggedIn ? {
				Cookie: `a=${COOKIES.a}; b=${COOKIES.b}`
			} : {}
		}, (error: any, response: Response, body: string) => {
			if (error) {
				console.error(error);
				reject();
			}
			if(response.statusCode !== 200) {
				console.error(`${response.statusCode}: `, response.statusMessage);
				reject();
			}
	
			resolve(body);
		});
	});
}

export async function FetchSubmission(id: string): Promise<string> {
	const url = `${ENDPOINT}/view/${id}`;
	return await new Promise((resolve, reject) => {
		cloudscraper({
			url,
			headers: COOKIES.loggedIn ? {
				Cookie: `a=${COOKIES.a}; b=${COOKIES.b}`
			} : {}
		}, (error: any, response: Response, body: string) => {
			if (error) {
				console.error(error);
				reject();
			}
			if(response.statusCode !== 200) {
				console.error(`${response.statusCode}: `, response.statusMessage);
				reject();
			}
	
			resolve(body);
		});
	});
}

export async function FetchAuthor(id: string): Promise<string> {
	const url = `${ENDPOINT}/user/${id}`;
	return await new Promise((resolve, reject) => {
		cloudscraper({
			url,
			headers: COOKIES.loggedIn ? {
				Cookie: `a=${COOKIES.a}; b=${COOKIES.b}`
			} : {}
		}, (error: any, response: Response, body: string) => {
			if (error) {
				console.error(error);
				reject();
			}
			if(response.statusCode !== 200) {
				console.error(`${response.statusCode}: `, response.statusMessage);
				reject();
			}
	
			resolve(body);
		});
	})
}

export async function FetchWatchingList(id: string, page: number = 1): Promise<string> {
	const url = `${ENDPOINT}/watchlist/by/${id}/${page}`;
	return await new Promise((resolve, reject) => {
		cloudscraper({
			url,
			headers: COOKIES.loggedIn ? {
				Cookie: `a=${COOKIES.a}; b=${COOKIES.b}`
			} : {}
		}, (error: any, response: Response, body: string) => {
			if (error) {
				console.error(error);
				reject();
			}
			if(response.statusCode !== 200) {
				console.error(`${response.statusCode}: `, response.statusMessage);
				reject();
			}
	
			resolve(body);
		});
	});
}

export async function FetchMyWatchingList(page: number = 1): Promise<string> {
	const url = `${ENDPOINT}/controls/buddylist/${page}`;
	return await new Promise((resolve, reject) => {
		cloudscraper({
			url,
			headers: COOKIES.loggedIn ? {
				Cookie: `a=${COOKIES.a}; b=${COOKIES.b}`
			} : {}
		}, (error: any, response: Response, body: string) => {
			if (error) {
				console.error(error);
				reject();
			}
			if(response.statusCode !== 200) {
				console.error(`${response.statusCode}: `, response.statusMessage);
				reject();
			}
	
			resolve(body);
		});
	});
}
