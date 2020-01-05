import { GetIndex, SearchOptions, GetSearch, GetSubmission, BrowseOptions, GetBrowse } from "./Request";
import { ParseSearch, Result, ParseSubmission, Submission, ParseBrowse } from "./Parser";
import { SearchType } from "./Enums";

export * from "./Enums";

export { Login } from './Request';

export async function Search(query: string, options?: SearchOptions): Promise<Result[]> {
	return ParseSearch(await GetSearch(query, options), options);
}

export async function Browse(options?: BrowseOptions): Promise<Result[]> {
	return ParseBrowse(await GetBrowse(options));
}

export async function Submission(id: Number): Promise<Submission> {
	return ParseSubmission(await GetSubmission(id), id);
}