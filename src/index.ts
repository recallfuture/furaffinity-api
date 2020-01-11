import { SearchOptions, GetSearch, GetSubmission, BrowseOptions, GetBrowse, GetAuthor } from "./Request";
import { ParseFigures, Result, ParseSubmission, Submission, Author, ParseAuthor } from './Parser';

export * from "./Enums";

export { Login } from './Request';
export { WatchingList } from './Parser';

export async function Search(query: string, options?: SearchOptions): Promise<Result[]> {
	return ParseFigures(await GetSearch(query, options));
}

export async function Browse(options?: BrowseOptions): Promise<Result[]> {
	return ParseFigures(await GetBrowse(options));
}

export async function Submission(id: string): Promise<Submission> {
	return ParseSubmission(await GetSubmission(id), id);
}

export async function Author(id: string): Promise<Author> {
	return ParseAuthor(await GetAuthor(id));
}
