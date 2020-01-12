import { SearchOptions, FetchSearch, FetchSubmission, BrowseOptions, FetchBrowse, FetchAuthor, FetchWatchingList, FetchGallery, FetchScraps } from "./Request";
import { ParseFigures, ParseSubmission, ParseAuthor, ParseWatchingList } from './Parser';
import { Author, Result, Submission } from './interfaces';

export * from "./Enums";
export * from "./interfaces";

export { Login } from './Request';

/**
 * Get results from search page
 * @param query search query
 * @param options search options
 */
export async function Search(query: string, options?: SearchOptions): Promise<Result[]> {
	return ParseFigures(await FetchSearch(query, options));
}

/**
 * Get results from browse page
 * @param options browse options
 */
export async function Browse(options?: BrowseOptions): Promise<Result[]> {
	return ParseFigures(await FetchBrowse(options));
}

/**
 * Get submission's info by pass submission id
 * @param id submission id
 */
export async function Submission(id: string): Promise<Submission> {
	return ParseSubmission(await FetchSubmission(id), id);
}

/**
 * Get author's info by pass author id
 * @param id author id
 */
export async function Author(id: string): Promise<Author> {
	return ParseAuthor(await FetchAuthor(id));
}

/**
 * Get results of a gallery page
 * @param id author id
 * @param page page number
 */
export async function Gallery(id: string, page: number): Promise<Result[]> {
	return ParseFigures(await FetchGallery(id, page));
}

/**
 * Get results of a scraps page
 * @param id author id
 * @param page page number
 */
export async function Scraps(id: string, page: number): Promise<Result[]> {
	return ParseFigures(await FetchScraps(id, page));
}

/**
 * Get an author's watching list
 * @param id author id
 */
export async function WatchingList(id: string): Promise<Author[]> {
	let result: Author[] = [];
	let page = 1;

	while (true) {
		const users = ParseWatchingList(await FetchWatchingList(id, page++));
		result = [...result, ...users];
		if (users.length === 0 || users.length < 200) {
			break;
		}
	}

	return result;
}