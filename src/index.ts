import {
  SearchOptions,
  FetchSearch,
  FetchSubmission,
  BrowseOptions,
  FetchBrowse,
  FetchAuthor,
  FetchWatchingList,
  FetchGallery,
  FetchScraps,
  FetchHome,
  FetchMyWatchingList,
  SubmissionsOptions,
  FetchSubmissions,
} from "./Request"
import {
  ParseFigures,
  ParseSubmission,
  ParseAuthor,
  ParseWatchingList,
  ParseMyWatchingList,
  ParseScrapsPaging,
  ParseGalleryPaging,
  ParseSubmissionsPaging,
  ParseBrowsePaging,
  ParseSearchPaging,
} from "./Parser"
import { IAuthor, IPagingResults, IResult, ISubmission } from "./interfaces"

export * from "./Enums"
export * from "./interfaces"

export { Login, SetProxy } from "./Request"

/**
 * Get results from search page
 * @param query search query
 * @param options search options
 */
export async function Search(
  query: string,
  options?: SearchOptions
): Promise<IPagingResults> {
  const body = await FetchSearch(query, options)
  const results = ParseFigures(body)
  return ParseSearchPaging(body, results, query, options)
}

/**
 * Get results from browse page
 * @param options browse options
 */
export async function Browse(options?: BrowseOptions): Promise<IPagingResults> {
  const body = await FetchBrowse(options)
  const results = ParseFigures(body)
  return ParseBrowsePaging(body, results, options)
}

/**
 * Get results from submissions timeline page
 * @param options submissions options
 */
export async function Submissions(
  options?: SubmissionsOptions
): Promise<IPagingResults> {
  const body = await FetchSubmissions(options)
  const results = ParseFigures(body)
  return ParseSubmissionsPaging(body, results)
}

/**
 * Get submission's info by pass submission id
 * @param id submission id
 */
export async function Submission(id: string): Promise<ISubmission> {
  return ParseSubmission(await FetchSubmission(id), id)
}

/**
 * Get the current logged in user
 */
export async function User(): Promise<IAuthor> {
  return ParseAuthor(await FetchHome())
}

/**
 * Get author's info by pass author id
 * @param id author id
 */
export async function Author(id: string): Promise<IAuthor> {
  return ParseAuthor(await FetchAuthor(id))
}

/**
 * Get results of a gallery page
 * @param id author id
 * @param page page number
 */
export async function Gallery(
  id: string,
  page: number,
  perpage: number = 72
): Promise<IPagingResults> {
  const body = await FetchGallery(id, page, perpage)
  const results = ParseFigures(body)
  return ParseGalleryPaging(body, results, perpage)
}

/**
 * Get results of a scraps page
 * @param id author id
 * @param page page number
 */
export async function Scraps(
  id: string,
  page: number,
  perpage: number = 72
): Promise<IPagingResults> {
  const body = await FetchScraps(id, page, perpage)
  const results = ParseFigures(body)
  return ParseScrapsPaging(body, results, perpage)
}

/**
 * Get an author's watching list
 * result don't has avatar
 * @param id author id
 */
export async function WatchingList(id: string): Promise<IAuthor[]> {
  let result: IAuthor[] = []
  let page = 1

  while (true) {
    const users = ParseWatchingList(await FetchWatchingList(id, page++))
    result = [...result, ...users]
    if (users.length === 0 || users.length < 200) {
      break
    }
  }

  return result
}

/**
 * Get current login user's watching list
 * this can only use after login
 * result has avatar
 */
export async function MyWatchingList(): Promise<IAuthor[]> {
  let result: IAuthor[] = []
  let page = 1

  while (true) {
    const users = ParseMyWatchingList(await FetchMyWatchingList(page++))
    result = [...result, ...users]
    if (users.length === 0 || users.length < 64) {
      break
    }
  }

  return result
}
