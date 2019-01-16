const ENDPOINT = 'https://www.furaffinity.net/';
import request from 'request';
import Promise from 'bluebird';
import { Rating, Type, Category, Tag, Species, Gender } from './Enums';

export const COOKIES = { loggedIn: false, a: '', b: '' };

export function Login(cookieA: string, cookieB: string) {
	COOKIES.loggedIn = true;
	COOKIES.a = cookieA;
	COOKIES.b = cookieB;
}

export interface SearchOptions {
	rating?: Rating,
	type?: Type
};

export interface BrowseOptions {
	rating?: Rating,
	category?: Category,
	tag?: Tag,
	species?: Species,
	gender?: Gender
};

export function GetIndex(): Promise<string> {
	return new Promise((resolve, reject) => {
		request({
			url: ENDPOINT,
			headers: COOKIES.loggedIn ? {
				Cookie: `a=${COOKIES.a}; b=${COOKIES.b}`
			} : {}
		}, (err, res, body) => {
			if (err) return reject(err);
			if (res.statusCode != 200) return reject("Status code not 200; got " + res.statusCode);
			resolve(body.toString());
		});
	});
}

export function GetSearch(query: string, options?: SearchOptions): Promise<string> {
	return new Promise((resolve, reject) => {
		request({
			method: 'POST',
			url: ENDPOINT + 'search/?q=' + encodeURIComponent(query),
			headers: COOKIES.loggedIn ? {
				Cookie: `a=${COOKIES.a}; b=${COOKIES.b}`
			} : {},
			form: options ? {
				'rating-general': (options.rating || 0x7) & Rating.General ? 'on' : 'off',
				'rating-mature': (options.rating || 0x7) & Rating.Mature ? 'on' : 'off',
				'rating-adult': (options.rating || 0x7) & Rating.Adult ? 'on' : 'off',
				'type-art': (options.type || 0xF) & Type.Artwork ? 'on' : 'off',
				'type-flash': (options.type || 0xF) & Type.Artwork ? 'on' : 'off',
				'type-photo': (options.type || 0xF) & Type.Any ? 'on' : 'off',
				'type-music': (options.type || 0xF) & Type.Music ? 'on' : 'off',
				'type-story': (options.type || 0xF) & Type.Writing ? 'on' : 'off',
				'type-poetry': (options.type || 0xF) & Type.Writing ? 'on' : 'off',
				perpage: 72
			} : {}
		}, (err, res, body) => {
			if (err) return reject(err);
			if (res.statusCode != 200) return reject("Status code not 200; got " + res.statusCode);
			resolve(body.toString());
		});
	});
}

let warn = false;
export function GetBrowse(options?: BrowseOptions): Promise<string> {
	return new Promise((resolve, reject) => {
		warn || console.log('WARN: Browse currently ignores any options passed.');
		warn = true;
		options = Object.assign({
			category: 1,
			tag: 1,
			species: 1,
			gender: 1
		}, options);
		request({
			url: ENDPOINT + 'browse',
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
				go: 'Update'
			}
		}, (err, res, body) => {
			if (err) return reject(err);
			if (res.statusCode != 200) return reject("Status code not 200; got " + res.statusCode);
			resolve(body.toString());
		});
	});
}

export function GetSubmission(id: Number): Promise<string> {
	return new Promise((resolve, reject) => {
		request({
			url: ENDPOINT + 'full/' + id,
			headers: COOKIES.loggedIn ? {
				Cookie: `a=${COOKIES.a}; b=${COOKIES.b}`
			} : {}
		}, (err, res, body) => {
			if (err) return reject(err);
			if (res.statusCode != 200) return reject("Status code not 200; got " + res.statusCode);
			resolve(body.toString());
		});
	});
}