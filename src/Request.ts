import { Rating, SearchType, Category, Tag, Species, Gender } from "./Enums";
import Request from "request";
import { default as cloudscraper, Response } from "cloudscraper";
import _ from "lodash";

export const ENDPOINT = "https://www.furaffinity.net";
export const COOKIES = { loggedIn: false, a: "", b: "" };

export function login(cookieA: string, cookieB: string) {
  COOKIES.loggedIn = true;
  COOKIES.a = cookieA;
  COOKIES.b = cookieB;
}

export function setProxy(config?: false | string) {
  cloudscraper.defaults({ proxy: config });
}

export interface SearchOptions {
  page?: number;
  rating?: Rating;
  type?: SearchType;
  prev?: boolean;
}

export interface BrowseOptions {
  page?: number;
  perpage?: number;
  rating?: Rating;
  category?: Category;
  tag?: Tag;
  species?: Species;
  gender?: Gender;
}

export interface SubmissionsOptions {
  startAt?: string;
  sort?: "new" | "old";
  perpage?: 24 | 48 | 72;
}

/**
 * util to request
 * @param options options
 */
function request(options: (Request.UriOptions & Request.CoreOptions) | (Request.UrlOptions & Request.CoreOptions)): Promise<string> {
  return new Promise((resolve, reject) => {
    options = _.merge(
      {
        headers: COOKIES.loggedIn
          ? {
              Cookie: `a=${COOKIES.a}; b=${COOKIES.b}`,
              Connection: "Keep-Alive"
            }
          : {
              Connection: "Keep-Alive"
            },
        agentOptions: {
          keepAlive: true,
          maxSockets: Infinity
        }
      },
      options
    );

    cloudscraper(options, (error: any, response: Response, body: string) => {
      if (error) {
        console.error(error);
        reject();
      }
      if (response.statusCode !== 200) {
        console.error(`${response.statusCode}: `, response.statusMessage);
        reject();
      }

      resolve(body);
    });
  });
}

export async function FetchHome(): Promise<string> {
  return await request({ url: `${ENDPOINT}/me` });
}

export async function FetchSearch(query: string, options?: SearchOptions): Promise<string> {
  const url = `${ENDPOINT}/search`;

  const page = options?.prev ? (options?.page || 1) + 1 : (options?.page || 1) - 1;

  return await request({
    url,
    method: "post",
    formData: {
      "rating-general": (options?.rating || Rating.Any) & Rating.General ? "on" : undefined,
      "rating-mature": (options?.rating || Rating.Any) & Rating.Mature ? "on" : undefined,
      "rating-adult": (options?.rating || Rating.Any) & Rating.Adult ? "on" : undefined,
      "type-art": (options?.type || SearchType.All) & SearchType.Art ? "on" : undefined,
      "type-flash": (options?.type || SearchType.All) & SearchType.Flash ? "on" : undefined,
      "type-photo": (options?.type || SearchType.All) & SearchType.Photos ? "on" : undefined,
      "type-music": (options?.type || SearchType.All) & SearchType.Music ? "on" : undefined,
      "type-story": (options?.type || SearchType.All) & SearchType.Story ? "on" : undefined,
      "type-poetry": (options?.type || SearchType.All) & SearchType.Poetry ? "on" : undefined,
      page,
      prev_page: options?.prev ? "Back" : undefined,
      next_page: options?.prev ? undefined : "Next",
      mode: "extended",
      q: query
    }
  });
}

export async function FetchBrowse(options?: BrowseOptions): Promise<string> {
  const url = `${ENDPOINT}/browse`;
  return await request({
    url,
    method: "post",
    formData: {
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
    }
  });
}

export async function FetchGallery(id: string, page: number = 1, perpage?: number): Promise<string> {
  const url = `${ENDPOINT}/gallery/${id}/${page}?perpage=${perpage}`;
  return await request({ url });
}

export async function FetchScraps(id: string, page: number = 1, perpage?: number): Promise<string> {
  const url = `${ENDPOINT}/scraps/${id}/${page}?perpage=${perpage}`;
  return await request({ url });
}

export async function FetchSubmission(id: string): Promise<string> {
  const url = `${ENDPOINT}/view/${id}`;
  return await request({ url });
}

export async function FetchSubmissions(options?: SubmissionsOptions): Promise<string> {
  const startAt = typeof options?.startAt === "string" ? "~" + options.startAt : "";
  const sort = options?.sort || "new";
  const perpage = options?.perpage || 72;
  const url = `${ENDPOINT}/msg/submissions/${sort}${startAt}@${perpage}`;
  return await request({ url });
}

export async function FaveSubmission(favLink: string): Promise<void> {
  await request({ url: favLink });
}

export async function FetchAuthor(id: string): Promise<string> {
  const url = `${ENDPOINT}/user/${id}`;
  return await request({ url });
}

export async function FetchWatchingList(id: string, page: number = 1): Promise<string> {
  const url = `${ENDPOINT}/watchlist/by/${id}/${page}`;
  return await request({ url });
}

export async function FetchMyWatchingList(page: number = 1): Promise<string> {
  const url = `${ENDPOINT}/controls/buddylist/${page}`;
  return await request({ url });
}
