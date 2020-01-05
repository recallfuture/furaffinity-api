const ENDPOINT = 'http://www.furaffinity.net/';
import axios from 'axios';
import { Rating, SearchType, Category, Tag, Species, Gender } from './Enums';

export const COOKIES = { loggedIn: false, a: '', b: '' };

export function Login(cookieA: string, cookieB: string) {
	COOKIES.loggedIn = true;
	COOKIES.a = cookieA;
	COOKIES.b = cookieB;
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

export async function GetIndex(): Promise<string> {
	const res = await axios.get(ENDPOINT, {
		headers: COOKIES.loggedIn ? {
			Cookie: `a=${COOKIES.a}; b=${COOKIES.b}`
		} : {}
	});
	if (res.status != 200) throw new Error("Status code not 200; got " + res.status);
	return res.data as string;
}

export async function GetSearch(query: string, options?: SearchOptions): Promise<string> {
	const res = await axios.post(ENDPOINT + 'search/?q=' + encodeURIComponent(query), {
		headers: COOKIES.loggedIn ? {
			Cookie: `a=${COOKIES.a}; b=${COOKIES.b}`
		} : {},
		form: options ? {
			'rating-general': (options.rating || 0x7) & Rating.General ? 'on' : 'off',
			'rating-mature': (options.rating || 0x7) & Rating.Mature ? 'on' : 'off',
			'rating-adult': (options.rating || 0x7) & Rating.Adult ? 'on' : 'off',
			'type-art': (options.type || SearchType.All) & SearchType.Art ? 'on' : 'off',
			'type-flash': (options.type || SearchType.All) & SearchType.Flash ? 'on' : 'off',
			'type-photo': (options.type || SearchType.All) & SearchType.Photos ? 'on' : 'off',
			'type-music': (options.type || SearchType.All) & SearchType.Music ? 'on' : 'off',
			'type-story': (options.type || SearchType.All) & SearchType.Story ? 'on' : 'off',
			'type-poetry': (options.type || SearchType.All) & SearchType.Poetry ? 'on' : 'off',
			perpage: 72,
			page: options.page || 1,
		} : {}
	});
	if (res.status != 200) throw new Error("Status code not 200; got " + res.status);
	return res.data as string;
}

let warn = false;
export async function GetBrowse(options?: BrowseOptions): Promise<string> {
	warn || console.log('WARN: Browse currently ignores any options passed.');
	warn = true;
	options = Object.assign({
		category: 1,
		tag: 1,
		species: 1,
		gender: 1
	}, options);
	const res = await axios.post(ENDPOINT + 'browse', {
		headers: COOKIES.loggedIn ? {
			Cookie: `a=${COOKIES.a}; b=${COOKIES.b}`
		} : {},
		form: {
			'rating-general': (options.rating || 0x7) & Rating.General ? 'on' : 'off',
			'rating-mature': (options.rating || 0x7) & Rating.Mature ? 'on' : 'off',
			'rating-adult': (options.rating || 0x7) & Rating.Adult ? 'on' : 'off',
			'cat': options.category,
			'atype': options.tag,
			'species': options.species,
			'gender': options.gender,
			perpage: 72,
			go: 'Update',
			page: options.page || 1,
		}
	});
	if (res.status != 200) throw new Error("Status code not 200; got " + res.status);
	return res.data as string;
}

export async function GetSubmission(id: Number): Promise<string> {
	const res = await axios.get(ENDPOINT + 'full/' + id, {
		headers: COOKIES.loggedIn ? {
			Cookie: `a=${COOKIES.a}; b=${COOKIES.b}`
		} : {}
	});
	if (res.status != 200) throw new Error("Status code not 200; got " + res.status);
	return res.data as string;
}