import cheerio from "cheerio";
import cloneDeep from "lodash/cloneDeep";
import { SubmissionType, Species, Category, Gender, Rating } from "./Enums";
import { IAuthor, IPagingResults, IResult, ISubmission } from "./interfaces";
import { browse, gallery, scraps, search, submission, submissions } from ".";
import { BrowseOptions, ENDPOINT, FaveSubmission, SearchOptions, SubmissionsOptions, RequestToggleWatch } from "./Request";

export class FASystemError extends Error {
  constructor(message: string) {
    super(message)
  }
}

/**
 * Convert author name to author id
 * @param name author name
 */
function convertNameToId(name: string): string {
  return name.trim().replace("_", "").toLowerCase();
}

/**
 * Get class names from element
 * @param element CheerioElement
 */
function classNames(element: CheerioElement): string[] {
  return element.attribs.class.split(" ");
}

function checkSystemMessage($: CheerioStatic) {
  // Check system message
  const noticeMessage = $("section.notice-message");
  if (noticeMessage.length !== 0) {
    const systemMessage = noticeMessage[0].childNodes[1].childNodes[3].childNodes[0].nodeValue;
    throw new FASystemError(systemMessage);
  }

  // Check system error
  const title = $("head title");
  if (title[0].firstChild.data === "System Error") {
    const sectionBody = $("section .section-body")
    throw new FASystemError(sectionBody[0].firstChild.data?.trim() || "Unknown error.");
  }
}

/**
 * Parse result from figure element
 * @param figure CheerioElement
 */
export function ParseFigure(figure: CheerioElement, selector: Cheerio): IResult {
  const id: string = figure.attribs.id.split("-").pop() ?? "";
  const thumb: string = "http:" + figure.childNodes[0].childNodes[0].childNodes[0].childNodes[0].attribs.src;
  const authorName = selector.find("figcaption p:last-child a").first().attr().title;
  const authorId = convertNameToId(authorName);

  return {
    type: SubmissionType[classNames(figure)[1].split("-").pop() as keyof typeof SubmissionType],
    id,
    title: figure.childNodes[1].childNodes[0].childNodes[0].childNodes[0]?.nodeValue ?? "",
    url: `${ENDPOINT}/view/${id}`,
    rating:
      Rating[
        classNames(figure)[0]
          .split("-")
          .pop()
          ?.replace(/^[a-z]/, ($1: string) => $1.toUpperCase()) as keyof typeof Rating
      ],
    thumb: {
      icon: thumb.replace(/@\d+?-/g, "@75-"),
      tiny: thumb.replace(/@\d+?-/g, "@150-"),
      small: thumb.replace(/@\d+?-/g, "@300-"),
      medium: thumb.replace(/@\d+?-/g, "@800-"),
      large: thumb.replace(/@\d+?-/g, "@1600-")
    },
    author: {
      id: authorId,
      url: `${ENDPOINT}/user/${authorId}`,
      name: authorName
    },
    getSubmission: async () => {
      return await submission(id);
    }
  };
}

/**
 * Parse all figure's info from HTML
 * @param body HTML document
 */
export function ParseFigures(body: string): IPagingResults {
  const $ = cheerio.load(body);

  const results: IPagingResults = [];
  $("figure").each((index, figure) => {
    results.push(ParseFigure(figure, $(figure)));
  });
  return results;
}

export function ParseGalleryPaging(body: string, results: IPagingResults, perpage?: number): IPagingResults {
  const $ = cheerio.load(body);

  const links = $(".submission-list .aligncenter:nth-child(1) div");

  if ($(links[0]).find("form").length > 0) {
    results.prevLink = ENDPOINT + $(links[0]).find("form").attr()["action"];

    const matchs = results.prevLink.match(/\/gallery\/(.+?)\/(\d+?)\/$/);
    if (matchs) {
      const id = matchs[1];
      const page = Number.parseInt(matchs[2]);

      results.prev = () => gallery(id, page, perpage);
    }
  }

  if ($(links[2]).find("form").length > 0) {
    results.nextLink = ENDPOINT + $(links[2]).find("form").attr()["action"];

    const matchs = results.nextLink.match(/\/gallery\/(.+?)\/(\d+?)\/$/);
    if (matchs) {
      const id = matchs[1];
      const page = Number.parseInt(matchs[2]);

      results.next = () => gallery(id, page, perpage);
    }
  }

  return results;
}

export function ParseScrapsPaging(body: string, results: IPagingResults, perpage?: number): IPagingResults {
  const $ = cheerio.load(body);

  const links = $(".submission-list .aligncenter:nth-child(1) div");

  if ($(links[0]).find("form").length > 0) {
    results.prevLink = ENDPOINT + $(links[0]).find("form").attr()["action"];

    const matchs = results.prevLink.match(/\/scraps\/(.+?)\/(\d+?)\/$/);
    if (matchs) {
      const id = matchs[1];
      const page = Number.parseInt(matchs[2]);

      results.prev = () => scraps(id, page, perpage);
    }
  }

  if ($(links[2]).find("form").length > 0) {
    results.nextLink = ENDPOINT + $(links[2]).find("form").attr()["action"];

    const matchs = results.nextLink.match(/\/scraps\/(.+?)\/(\d+?)\/$/);
    if (matchs) {
      const id = matchs[1];
      const page = Number.parseInt(matchs[2]);

      results.next = () => scraps(id, page, perpage);
    }
  }

  return results;
}

export function ParseSearchPaging(body: string, results: IPagingResults, query: string, options?: SearchOptions): IPagingResults {
  const $ = cheerio.load(body);
  const links = $("#search-results .pagination button");

  if (!classNames(links[0]).includes("disabled")) {
    const newOptions = cloneDeep(options || {});
    newOptions.page = newOptions.page ? newOptions.page - 1 : 1;
    results.prev = () => search(query, newOptions);
  }

  if (!classNames(links[1]).includes("disabled")) {
    const newOptions = cloneDeep(options || {});
    newOptions.page = newOptions.page ? newOptions.page + 1 : 2;
    results.next = () => search(query, newOptions);
  }

  return results;
}

export function ParseBrowsePaging(body: string, results: IPagingResults, options?: BrowseOptions): IPagingResults {
  const $ = cheerio.load(body);

  const links = $(".section-body .navigation:nth-child(1) div");

  if ($(links[0]).find("form").length > 0) {
    results.prevLink = ENDPOINT + $(links[0]).find("form").attr()["action"];

    const matchs = results.prevLink.match(/\/browse\/(\d+?)$/);
    if (matchs) {
      const page = Number.parseInt(matchs[1]);

      options = options ?? {};
      options.page = page;
      results.prev = () => browse(options);
    }
  }

  if ($(links[2]).find("form").length > 0) {
    results.nextLink = ENDPOINT + $(links[2]).find("form").attr()["action"];

    const matchs = results.nextLink.match(/\/browse\/(\d+?)$/);
    if (matchs) {
      const page = Number.parseInt(matchs[1]);

      options = options ?? {};
      options.page = page;
      results.next = () => browse(options);
    }
  }

  return results;
}

export function ParseSubmissionsPaging(body: string, results: IPagingResults): IPagingResults {
  const $ = cheerio.load(body);

  const links = $(".section-body .aligncenter:nth-child(1)");

  if ($(links).find("a.more-half").length === 2) {
    results.prevLink = ENDPOINT + $(links).find("a.more-half").first().attr()["href"];
    results.nextLink = ENDPOINT + $(links).find("a.more-half").last().attr()["href"];
  } else if ($(links).find("a.more.prev").length === 1) {
    results.prevLink = ENDPOINT + $(links).find("a.more.prev").first().attr()["href"];
  } else if ($(links).find("a.more").length === 1) {
    results.nextLink = ENDPOINT + $(links).find("a.more").first().attr()["href"];
  }

  if (results.prevLink) {
    const matchs = results.prevLink.match(/\/submissions\/(.+?)~(.+?)@(\d+)\/$/);
    if (matchs) {
      const sort = matchs[1];
      const startAt = matchs[2];
      const perpage = matchs[3];

      const options: SubmissionsOptions = {
        sort: sort as any,
        startAt: startAt as any,
        perpage: perpage as any
      };
      results.prev = () => submissions(options);
    }
  }

  if (results.nextLink) {
    const matchs = results.nextLink.match(/\/submissions\/(.+?)~(.+?)@(\d+)\/$/);
    if (matchs) {
      const sort = matchs[1];
      const startAt = matchs[2];
      const perpage = matchs[3];

      const options: SubmissionsOptions = {
        sort: sort as any,
        startAt: startAt as any,
        perpage: perpage as any
      };
      results.next = () => submissions(options);
    }
  }

  return results;
}

/**
 * Get submission's info
 * @param body HTML document
 * @param id Subumission id
 */
export function ParseSubmission(body: string, id: string): ISubmission {
  const $ = cheerio.load(body);

  checkSystemMessage($);

  // Get main nodes
  const main = $("#columnpage");
  const sidebar = main.find(".submission-sidebar");
  const content = main.find(".submission-content");

  const stats = sidebar.find(".stats-container");
  const info = sidebar.find(".info");
  const tags = sidebar.find(".tags-row .tags a");

  // buttons
  let downloadUrl: string = `http:${sidebar.find(".buttons .download a")[0].attribs.href}`;
  const favLinkNode = sidebar.find(".buttons .fav a")[0];
  const favLink = favLinkNode ? `http://furaffinity.net${favLinkNode.attribs.href}` : undefined;

  // header
  const title: string = content.find(".submission-id-sub-container .submission-title p")[0].childNodes[0].data?.trim() ?? "";
  const authorName: string = content.find(".submission-id-sub-container a strong")[0].childNodes[0].data?.trim() ?? "";
  const authorId: string = convertNameToId(authorName);
  const posted: string = content.find(".submission-id-sub-container strong span")[0].attribs.title;
  const authorAvatar: string = `http:${content.find(".submission-id-avatar img")[0].attribs.src}`;
  const authorShinies: boolean = !!$(".shinies-promo");
  const description: string = content.find(".submission-description").html()?.trim() ?? "";

  // stats
  const rating: Rating = Rating[stats.find(".rating span")[0].childNodes[0].data?.trim() as keyof typeof Rating];
  const favorites: number = Number.parseInt(stats.find(".favorites span")[0].childNodes[0].data?.trim() ?? "");
  const comments: number = Number.parseInt(stats.find(".comments span")[0].childNodes[0].data?.trim() ?? "");
  const views: number = Number.parseInt(stats.find(".views span")[0].childNodes[0].data?.trim() ?? "");

  // info
  const category: Category = Category[info.find(".category-name")[0].childNodes[0].data?.trim() as keyof typeof Category];
  const species: Species = Species[info[0].childNodes[3].childNodes[2].childNodes[0].data?.trim() as keyof typeof Species];
  const gender: Gender = Gender[info[0].childNodes[5].childNodes[2].childNodes[0].data?.trim() as keyof typeof Gender];

  // fix url when category is story or poetry
  if (category === Category.Story || category === Category.Poetry) {
    downloadUrl = downloadUrl.replace("d.facdn.net/download/", "d.facdn.net/");
  }

  const previewUrl: string | undefined = content.find(".submission-area img").length > 0 ? `http:${content.find(".submission-area img")[0].attribs["data-preview-src"]}` : undefined;

  return {
    id,
    url: `http://www.furaffinity.net/view/${id}`,
    title: title,
    posted: Date.parse(posted),
    favLink,
    rating: rating,
    author: {
      id: authorId,
      name: authorName,
      url: `http://www.furaffinity.net/user/${authorId}`,
      avatar: authorAvatar,
      shinies: authorShinies
    },
    description,
    content: {
      category,
      species,
      gender
    },
    stats: {
      favorites,
      comments,
      views
    },
    downloadUrl,
    previewUrl,
    keywords: tags
      .map((index, tag) => {
        return tag.childNodes[0].data?.trim() ?? "";
      })
      .get(),
    fave: favLink
      ? async () => {
          await FaveSubmission(favLink);
        }
      : undefined
  };
}

/**
 * Get author's info
 * @param body HTML document
 */
export function ParseAuthor(body: string): IAuthor {
  const $ = cheerio.load(body);

  checkSystemMessage($);

  const name: string = $("userpage-nav-user-details username")[0].childNodes[0].data?.trim().slice(1) ?? "";
  const id: string = convertNameToId(name);
  const url: string = `https://www.furaffinity.net/user/${id}`;
  const shinies: boolean = !!$(".userpage-layout-left-col-content > a:nth-child(4)");
  const avatar: string = `https:${$("userpage-nav-avatar img")[0].attribs.src}`;
  
  const statsCells = $(".userpage-section-right .cell");
  const views: string = statsCells[0].childNodes[2].data?.trim() ?? "0";
  const submissions: string = statsCells[0].childNodes[6].data?.trim() ?? "0";
  const favs: string = statsCells[0].childNodes[10].data?.trim() ?? "0";
  const commentsEarned: string = statsCells[1].childNodes[2].data?.trim() ?? "0";
  const commentsMade: string = statsCells[1].childNodes[6].data?.trim() ?? "0";
  const journals: string = statsCells[1].childNodes[10].data?.trim() ?? "0";
  
  // TODO: add exception if author is user, if not already done
  const watchButton = $("userpage-nav-interface-buttons a")[0];
  const watchLink = watchButton ? `${ENDPOINT}${watchButton.attribs.href}` : undefined;
  const watching = watchButton ? watchButton.attribs.class.includes('stop') : false;

  return {
    id,
    name,
    url,
    avatar,
    shinies,
    watchLink,
    stats: {
      views: Number.parseInt(views),
      submissions: Number.parseInt(submissions),
      favs: Number.parseInt(favs),

      commentsEarned: Number.parseInt(commentsEarned),
      commentsMade: Number.parseInt(commentsMade),
      journals: Number.parseInt(journals),

      watching
    },
    watchAuthor: !watching && watchLink
      ? async () => await RequestToggleWatch(watchLink) : undefined,
    unwatchAuthor: watching && watchLink
    ? async () => await RequestToggleWatch(watchLink) : undefined
  };
}

/**
 * Get all Author's info from peer page of watching list
 * @param body HTML document
 */
export function ParseWatchingList(body: string): IAuthor[] {
  const $ = cheerio.load(body);

  checkSystemMessage($);

  return $(".watch-list-items a")
    .map((index, a) => {
      const name = a.childNodes[0].data?.trim() ?? "";
      const id = convertNameToId(name);
      const url = `${ENDPOINT}/user/${id}`;

      return {
        id,
        name,
        url
      };
    })
    .get();
}

/**
 * Get all Author's info from peer page of watching list
 * @param body HTML document
 */
export function ParseMyWatchingList(body: string): IAuthor[] {
  const $ = cheerio.load(body);

  checkSystemMessage($);

  return $(".flex-item-watchlist")
    .map((index, div) => {
      const avatar = `https:${$(div).find("img.avatar")[0].attribs.src}`;
      const name = $(div).find(".flex-item-watchlist-controls a strong")[0].childNodes[0].data?.trim() ?? "";
      const id = convertNameToId(name);
      const url = `${ENDPOINT}/user/${id}`;

      return {
        id,
        name,
        url,
        avatar
      };
    })
    .get();
}
