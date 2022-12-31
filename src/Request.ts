import { Rating, SearchType, OrderBy, OrderDirection, RangeType, MatchMode, Category, Tag, Species, Gender } from "./Enums";
import type { Agents } from "got";
import hooman from "hooman";
import { CookieJar } from "tough-cookie";
import { HttpsProxyAgent } from "hpagent";
import { SocksProxyAgent } from "socks-proxy-agent";
import pickBy from "lodash/pickBy";

const notUndefined = (value: any) => value !== undefined;

let agent: Agents = {};
const cookieJar = new CookieJar();
const got = hooman.extend({
  cookieJar,
  headers: {
    Connection: "keep-alive"
  },
  maxRedirects: 3
});

export const ENDPOINT = "https://www.furaffinity.net";

/**
 * Use cookies to login
 * @param cookieA cookie a from furaffinity.net
 * @param cookieB cookie b from furaffinity.net
 */
export function login(cookieA: string, cookieB: string) {
  cookieJar.setCookieSync(`a=${cookieA};`, ENDPOINT);
  cookieJar.setCookieSync(`b=${cookieB};`, ENDPOINT);
}

/**
 * Remove all cookies to logout
 */
export function logout() {
  cookieJar.removeAllCookiesSync();
}

/**
 * Set proxy for api request
 * @param url proxy url, support http, https and socks
 */
export function setProxy(url?: string) {
  if (!url) {
    agent = {};
    return;
  }

  if (url.startsWith("http")) {
    const proxy = new HttpsProxyAgent({
      proxy: url
    });
    agent = { https: proxy };
  } else if (url.startsWith("socks")) {
    const proxy = new SocksProxyAgent(url);
    agent = { https: proxy };
  }
}

export interface SearchOptions {
  /** start at 1 */
  page?: number;
  /** default 72 */
  perpage?: 24 | 48 | 72;
  /** default Any */
  rating?: Rating;
  /** default Any */
  type?: SearchType;
  /** default 'relevancy' */
  orderBy?: OrderBy;
  /** default 'desc' */
  orderDirection?: OrderDirection;
  /** default 'all' */
  range?: RangeType;
  rangeFrom?: Date;
  rangeTo?: Date;
  /** default extended */
  matchMode?: MatchMode;
}

export interface BrowseOptions {
  /** start at 1 */
  page?: number;
  /** default 72 */
  perpage?: 24 | 48 | 72;
  /** default Any */
  rating?: Rating;
  /** default All */
  category?: Category;
  /** default All */
  tag?: Tag;
  /** default Unspecified / Any */
  species?: Species;
  /** default Any */
  gender?: Gender;
}

export interface SubmissionsOptions {
  /** last page's id */
  startAt?: string;
  sort?: "new" | "old";
  /** default 72 */
  perpage?: 24 | 48 | 72;
}

export async function FetchHome(): Promise<string> {
  const res = await got.get(`${ENDPOINT}/me`, { agent });
  return res.body;
}

export async function FetchSearch(query: string, options?: SearchOptions): Promise<string> {
  const url = `${ENDPOINT}/search`;
  const { page = 1, perpage = 72, rating = Rating.Any, type = SearchType.All, orderBy = "relevancy", orderDirection = "desc", range = "all", rangeFrom, rangeTo, matchMode = "extended" } = options || {};

  const res = await got.post(url, {
    agent,
    form: pickBy({
      "rating-general": rating & Rating.General ? 1 : undefined,
      "rating-mature": rating & Rating.Mature ? 1 : undefined,
      "rating-adult": rating & Rating.Adult ? 1 : undefined,
      "type-art": type & SearchType.Art ? 1 : undefined,
      "type-flash": type & SearchType.Flash ? 1 : undefined,
      "type-photo": type & SearchType.Photos ? 1 : undefined,
      "type-music": type & SearchType.Music ? 1 : undefined,
      "type-story": type & SearchType.Story ? 1 : undefined,
      "type-poetry": type & SearchType.Poetry ? 1 : undefined,
      page,
      perpage,
      mode: matchMode,
      "order-by": orderBy,
      "order-direction": orderDirection,
      range,
      range_from: rangeFrom?.toISOString(),
      range_to: rangeTo?.toISOString(),
      q: query
    }, notUndefined)
  });
  return res.body;
}

export async function FetchBrowse(options?: BrowseOptions): Promise<string> {
  const url = `${ENDPOINT}/browse`;

  const res = await got.post(url, {
    agent,
    form: pickBy({
      rating_general: (options?.rating || 0x7) & Rating.General ? "on" : undefined,
      rating_mature: (options?.rating || 0x7) & Rating.Mature ? "on" : undefined,
      rating_adult: (options?.rating || 0x7) & Rating.Adult ? "on" : undefined,
      cat: options?.category || 1,
      atype: options?.tag || 1,
      species: options?.species || 1,
      gender: options?.gender || 0,
      perpage: options?.perpage || 72,
      go: "Apply",
      page: options?.page || 1
    }, notUndefined)
  });
  return res.body;
}

export async function FetchGallery(id: string, page: number = 1, perpage?: number): Promise<string> {
  const url = `${ENDPOINT}/gallery/${id}/${page}?perpage=${perpage}`;
  const res = await got.get(url, { agent });
  return res.body;
}

export async function FetchScraps(id: string, page: number = 1, perpage?: number): Promise<string> {
  const url = `${ENDPOINT}/scraps/${id}/${page}?perpage=${perpage}`;
  const res = await got.get(url, { agent });
  return res.body;
}

export async function FetchSubmission(id: string): Promise<string> {
  const url = `${ENDPOINT}/view/${id}`;
  const res = await got.get(url, { agent });
  return res.body;
}

export async function FetchSubmissions(options?: SubmissionsOptions): Promise<string> {
  const startAt = typeof options?.startAt === "string" ? "~" + options.startAt : "";
  const sort = options?.sort || "new";
  const perpage = options?.perpage || 72;
  const url = `${ENDPOINT}/msg/submissions/${sort}${startAt}@${perpage}`;
  const res = await got.get(url, { agent });
  return res.body;
}

export async function FaveSubmission(favLink: string): Promise<void> {
  await got.get(favLink, { agent });
}

export async function FetchAuthor(id: string): Promise<string> {
  const url = `${ENDPOINT}/user/${id}`;
  const res = await got.get(url, { agent });
  return res.body;
}

export async function FetchWatchingList(id: string, page: number = 1): Promise<string> {
  const url = `${ENDPOINT}/watchlist/by/${id}/${page}`;
  const res = await got.get(url, { agent });
  return res.body;
}

export async function FetchMyWatchingList(page: number = 1): Promise<string> {
  const url = `${ENDPOINT}/controls/buddylist/${page}`;
  const res = await got.get(url, { agent });
  return res.body;
}

export async function RequestRemoveFromInbox(viewIds: string[]): Promise<void> {
  const url = `${ENDPOINT}/msg/submissions/new`;
  await got.post(url, {
    agent,
    form: [...viewIds.map((id) => ["submissions[]", id]), ["messagecenter-action", "remove_checked"]],
    followRedirect: false
  });
}

/**
 * Request the given url, toggle watching state
 * @param watchLink link for watch or unwatch, can be get from IAuthor
 */
export async function RequestToggleWatch(watchLink: string): Promise<void> {
  await got.get(watchLink, { agent });
}
