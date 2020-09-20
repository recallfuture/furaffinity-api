import { SearchOptions, FetchSearch, FetchSubmission, BrowseOptions, FetchBrowse, FetchAuthor, FetchWatchingList, FetchGallery, FetchScraps, FetchIndex, FetchMyWatchingList } from './Request';
import { ParseFigures, ParseSubmission, ParseAuthor, ParseWatchingList, ParseUser, ParseMyWatchingList } from './Parser';
import { Author, Result, Submission } from './interfaces';

export * from './Enums';
export * from './interfaces';

export { Login, SetProxy } from './Request';

/**
 * Get results from search page
 * @param query search query
 * @param options search options
 */
export async function Search(query: string, options?: SearchOptions): Promise<Result[] | null> {
	try {
		return ParseFigures(await FetchSearch(query, options));
	} catch (e) {
		console.error('furaffinity-api: ', e);
		return null;
	}
}

/**
 * Get results from browse page
 * @param options browse options
 */
export async function Browse(options?: BrowseOptions): Promise<Result[] | null> {
	try {
		return ParseFigures(await FetchBrowse(options));
	} catch (e) {
		console.error('furaffinity-api: ', e);
		return null;
	}
}

/**
 * Get submission's info by pass submission id
 * @param id submission id
 */
export async function Submission(id: string): Promise<Submission | null> {
	try {
		return ParseSubmission(await FetchSubmission(id), id);
	} catch (e) {
		console.error('furaffinity-api: ', e);
		return null;
	}
}

/**
 * Get the current logged in user
 */
export async function User(): Promise<Author | null> {
	try {
		return ParseUser(await FetchIndex());
	} catch (e) {
		console.error('furaffinity-api: ', e);
		return null;
	}
}

/**
 * Get author's info by pass author id
 * @param id author id
 */
export async function Author(id: string): Promise<Author | null> {
	try {
		return ParseAuthor(await FetchAuthor(id));
	} catch (e) {
		console.error('furaffinity-api: ', e);
		return null;
	}
}

/**
 * Get results of a gallery page
 * @param id author id
 * @param page page number
 */
export async function Gallery(id: string, page: number): Promise<Result[] | null> {
	try {
		return ParseFigures(await FetchGallery(id, page));
	} catch (e) {
		console.error('furaffinity-api: ', e);
		return null;
	}
}

/**
 * Get results of a scraps page
 * @param id author id
 * @param page page number
 */
export async function Scraps(id: string, page: number): Promise<Result[] | null> {
	try {
		return ParseFigures(await FetchScraps(id, page));
	} catch (e) {
		console.error('furaffinity-api: ', e);
		return null;
	}
}

/**
 * Get an author's watching list
 * result don't has avatar
 * @param id author id
 */
export async function WatchingList(id: string): Promise<Author[] | null> {
	let result: Author[] = [];
	let page = 1;

	try {
		while (true) {
			const users = ParseWatchingList(await FetchWatchingList(id, page++));
			result = [...result, ...users];
			if (users.length === 0 || users.length < 200) {
				break;
			}
		}
	} catch (e) {
		console.error('furaffinity-api: ', e);
		return null;
	}

	return result;
}

/**
 * Get current login user's watching list
 * this can only use after login
 * result has avatar
 */
export async function MyWatchingList(): Promise<Author[] | null> {
	let result: Author[] = [];
	let page = 1;

	try {
		while (true) {
			const users = ParseMyWatchingList(await FetchMyWatchingList(page++));
			result = [...result, ...users];
			if (users.length === 0 || users.length < 64) {
				break;
			}
		}
	} catch (e) {
		console.error('furaffinity-api: ', e);
		return null;
	}

	return result;
}
