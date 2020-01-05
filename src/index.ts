import { GetIndex, SearchOptions, GetSearch, GetSubmission, BrowseOptions, GetBrowse } from "./Request";
import { ParseFigures, Result, ParseSubmission, Submission } from "./Parser";

export * from "./Enums";

export { axios, Login } from './Request';

export async function Search(query: string, options?: SearchOptions): Promise<Result[]> {
	return ParseFigures(await GetSearch(query, options));
}

export async function Browse(options?: BrowseOptions): Promise<Result[]> {
	return ParseFigures(await GetBrowse(options));
}

export async function Submission(id: Number): Promise<Submission> {
	return ParseSubmission(await GetSubmission(id), id);
}