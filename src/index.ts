import { SearchOptions, FetchSearch, FetchSubmission, BrowseOptions, FetchBrowse, FetchAuthor, FetchWatchingList, FetchGallery, FetchScraps, FetchHome, FetchMyWatchingList, SubmissionsOptions, FetchSubmissions, RequestRemoveFromInbox, RequestToggleWatch } from "./Request";
import { ParseFigures, ParseSubmission, ParseAuthor, ParseWatchingList, ParseMyWatchingList, ParseScrapsPaging, ParseGalleryPaging, ParseSubmissionsPaging, ParseBrowsePaging, ParseSearchPaging } from "./Parser";
import { IAuthor, IPagingResults, IResult, ISubmission } from "./interfaces";

export * from "./Enums";
export * from "./interfaces";
export { FASystemError } from "./Parser";

export { login, logout, setProxy } from "./Request";

/**
 * Get results from search page
 * @param query search query
 * @param options search options
 */
export async function search(query: string, options?: SearchOptions): Promise<IPagingResults> {
  const body = await FetchSearch(query, options);
  const results = ParseFigures(body);
  return ParseSearchPaging(body, results, query, options);
}

/**
 * Get results from browse page
 * @param options browse options
 */
export async function browse(options?: BrowseOptions): Promise<IPagingResults> {
  const body = await FetchBrowse(options);
  const results = ParseFigures(body);
  return ParseBrowsePaging(body, results, options);
}

/**
 * Get results from submissions timeline page
 * @param options submissions options
 */
export async function submissions(options?: SubmissionsOptions): Promise<IPagingResults> {
  const body = await FetchSubmissions(options);
  const results = ParseFigures(body);
  return ParseSubmissionsPaging(body, results);
}

/**
 * Get submission's info by pass submission id
 * @param id submission id
 */
export async function submission(id: string): Promise<ISubmission> {
  return ParseSubmission(await FetchSubmission(id), id);
}

/**
 * Get the current logged in user
 */
export async function user(): Promise<IAuthor> {
  return ParseAuthor(await FetchHome());
}

/**
 * Get author's info by pass author id
 * @param id author id
 */
export async function author(id: string): Promise<IAuthor> {
  return ParseAuthor(await FetchAuthor(id));
}

/**
 * Get results of a gallery page
 * @param id author id
 * @param page page number
 */
export async function gallery(id: string, page: number, perpage: number = 72): Promise<IPagingResults> {
  const body = await FetchGallery(id, page, perpage);
  const results = ParseFigures(body);
  return ParseGalleryPaging(body, results, perpage);
}

/**
 * Get results of a scraps page
 * @param id author id
 * @param page page number
 */
export async function scraps(id: string, page: number, perpage: number = 72): Promise<IPagingResults> {
  const body = await FetchScraps(id, page, perpage);
  const results = ParseFigures(body);
  return ParseScrapsPaging(body, results, perpage);
}

/**
 * Get an author's watching list
 * result don't has avatar
 * @param id author id
 */
export async function watchingList(id: string): Promise<IAuthor[]> {
  let result: IAuthor[] = [];
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

/**
 * Get current login user's watching list
 * this can only use after login
 * result has avatar
 */
export async function myWatchingList(): Promise<IAuthor[]> {
  let result: IAuthor[] = [];
  let page = 1;

  while (true) {
    const users = ParseMyWatchingList(await FetchMyWatchingList(page++));
    result = [...result, ...users];
    if (users.length === 0 || users.length < 64) {
      break;
    }
  }

  return result;
}

/**
 * Remove submissions from submission inbox, only delete when it exists in inbox.
 * @param viewIds submission id list
 */
export async function removeFromInbox(viewIds: string[]): Promise<void> {
  await RequestRemoveFromInbox(viewIds);
}

/**
 * Watch author if haven't watched, no effact when watch yourself
 * @param id author id
 */
export async function watchAuthor(id: string): Promise<void> {
  const author = await Author(id);
  await author.watchAuthor?.()
}

/**
 * Unwatch author if already watched, no effact when unwatch yourself
 * @param id author id
 */
export async function unwatchAuthor(id: string): Promise<void> {
  const author = await Author(id);
  await author.unwatchAuthor?.()
}

/**
 * Request the given url, toggle watching state
 * @param watchLink link for watch or unwatch, can be get from IAuthor
 */
export const toggleWatch = RequestToggleWatch;

// 兼容原来的命名
export { login as Login, setProxy as SetProxy } from "./Request";
export const Search = search;
export const Browse = browse;
export const Submissions = submissions;
export const Submission = submission;
export const User = user;
export const Author = author;
export const Gallery = gallery;
export const Scraps = scraps;
export const WatchingList = watchingList;
export const MyWatchingList = myWatchingList;
