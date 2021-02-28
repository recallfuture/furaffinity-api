import cheerio from 'cheerio';
import cloneDeep from 'lodash/cloneDeep'
import { SubmissionType, Species, Category, Gender, Rating } from './Enums';
import { Author, PagingResults, Result, Submission } from './interfaces';
import { Browse, Gallery, Scraps, Search, Submission as GetSubmission, Submissions } from '.';
import { BrowseOptions, ENDPOINT, FaveSubmission, SearchOptions, SubmissionsOptions } from './Request';

/**
 * Convert author name to author id
 * @param name author name
 */
function convertNameToId(name: string): string {
  return name.trim().replace('_', '').toLowerCase();
}

/**
 * Get class names from element
 * @param element CheerioElement
 */
function classNames(element: CheerioElement): string[] {
  return element.attribs.class.split(' ');
}

function checkSystemMessage($: CheerioStatic) {
  // Check system message
  const noticeMessage = $('section.notice-message');
  if (noticeMessage.length !== 0) {
    const systemMessage = noticeMessage[0].childNodes[1].childNodes[3].childNodes[0].nodeValue;
    throw new Error(systemMessage);
  }
}

/**
 * Parse result from figure element
 * @param figure CheerioElement
 */
export function ParseFigure(figure: CheerioElement, author?: Author): Result {
  const id: string = figure.attribs.id.split('-').pop() ?? '';
  const thumb: string =
    'http:' + figure.childNodes[0].childNodes[0].childNodes[0].childNodes[0].attribs.src;
  const authorName = figure.childNodes[1].childNodes[1].childNodes[2].childNodes[0].nodeValue.trim();
  const authorId = convertNameToId(authorName);

  return {
    type: SubmissionType[classNames(figure)[1].split('-').pop() as keyof typeof SubmissionType],
    id,
    title: figure.childNodes[1].childNodes[0].childNodes[0].childNodes[0]?.nodeValue ?? '',
    url: `https://www.furaffinity.net/view/${id}`,
    rating:
      Rating[
        classNames(figure)[0]
          .split('-')
          .pop()
          ?.replace(/^[a-z]/, ($1: string) => $1.toUpperCase()) as keyof typeof Rating
      ],
    thumb: {
      icon: thumb.replace(/@\d+?-/g, '@75-'),
      tiny: thumb.replace(/@\d+?-/g, '@150-'),
      small: thumb.replace(/@\d+?-/g, '@300-'),
      medium: thumb.replace(/@\d+?-/g, '@800-'),
      large: thumb.replace(/@\d+?-/g, '@1600-'),
    },
    author: author ?? {
      id: authorId,
      url: `https://www.furaffinity.net/user/${authorId}`,
      name: authorName,
    },
    getSubmission: async () => {
      return await GetSubmission(id);
    },
  };
}

/**
 * Parse all figure's info from HTML
 * @param body HTML document
 */
export function ParseFigures(body: string): PagingResults {
  const $ = cheerio.load(body);

  let author: Author | undefined;
  try {
    author = ParseAuthor(body);
  } catch (e) {}

  const results: PagingResults = [];
  $('figure').each((index, figure) => {
    results.push(ParseFigure(figure, author));
  });
  return results;
}

export function ParseGalleryPaging(
  body: string,
  results: PagingResults,
  perpage?: number
): PagingResults {
  const $ = cheerio.load(body);

  const links = $('.submission-list .aligncenter:nth-child(1) div');

  if ($(links[0]).find('form').length > 0) {
    results.prevLink = ENDPOINT + $(links[0]).find('form').attr()['action'];

    const matchs = results.prevLink.match(/\/gallery\/(.+?)\/(\d+?)\/$/);
    if (matchs) {
      const id = matchs[1];
      const page = Number.parseInt(matchs[2]);

      results.prev = () => Gallery(id, page, perpage);
    }
  }

  if ($(links[2]).find('form').length > 0) {
    results.nextLink = ENDPOINT + $(links[2]).find('form').attr()['action'];

    const matchs = results.nextLink.match(/\/gallery\/(.+?)\/(\d+?)\/$/);
    if (matchs) {
      const id = matchs[1];
      const page = Number.parseInt(matchs[2]);

      results.next = () => Gallery(id, page, perpage);
    }
  }

  return results;
}

export function ParseScrapsPaging(
  body: string,
  results: PagingResults,
  perpage?: number
): PagingResults {
  const $ = cheerio.load(body);

  const links = $('.submission-list .aligncenter:nth-child(1) div');

  if ($(links[0]).find('form').length > 0) {
    results.prevLink = ENDPOINT + $(links[0]).find('form').attr()['action'];

    const matchs = results.prevLink.match(/\/scraps\/(.+?)\/(\d+?)\/$/);
    if (matchs) {
      const id = matchs[1];
      const page = Number.parseInt(matchs[2]);

      results.prev = () => Scraps(id, page, perpage);
    }
  }

  if ($(links[2]).find('form').length > 0) {
    results.nextLink = ENDPOINT + $(links[2]).find('form').attr()['action'];

    const matchs = results.nextLink.match(/\/scraps\/(.+?)\/(\d+?)\/$/);
    if (matchs) {
      const id = matchs[1];
      const page = Number.parseInt(matchs[2]);

      results.next = () => Scraps(id, page, perpage);
    }
  }

  return results;
}

export function ParseSearchPaging(
  body: string,
  results: PagingResults,
	query: string,
  options?: SearchOptions
): PagingResults {
  const $ = cheerio.load(body);
  const links = $('#search-results .pagination button');

	if (!classNames(links[0]).includes('disabled')) {
		const newOptions = cloneDeep(options || {});
		newOptions.page = newOptions.page ? newOptions.page - 1 : 1;
		newOptions.prev = true;
		results.prev = () => Search(query, newOptions);
	}

	if (!classNames(links[1]).includes('disabled')) {
		const newOptions = cloneDeep(options || {});
		newOptions.page = newOptions.page ? newOptions.page + 1 : 2;
		newOptions.prev = false;
		results.next = () => Search(query, newOptions);
	}

  return results;
}

export function ParseBrowsePaging(
  body: string,
  results: PagingResults,
  options?: BrowseOptions
): PagingResults {
  const $ = cheerio.load(body);

  const links = $('.section-body .navigation:nth-child(1) div');

  if ($(links[0]).find('form').length > 0) {
    results.prevLink = ENDPOINT + $(links[0]).find('form').attr()['action'];

    const matchs = results.prevLink.match(/\/browse\/(\d+?)$/);
    if (matchs) {
      const page = Number.parseInt(matchs[1]);

      options = options ?? {};
      options.page = page;
      results.prev = () => Browse(options);
    }
  }

  if ($(links[2]).find('form').length > 0) {
    results.nextLink = ENDPOINT + $(links[2]).find('form').attr()['action'];

    const matchs = results.nextLink.match(/\/browse\/(\d+?)$/);
    if (matchs) {
      const page = Number.parseInt(matchs[1]);

      options = options ?? {};
      options.page = page;
      results.next = () => Browse(options);
    }
  }

  return results;
}

export function ParseSubmissionsPaging(body: string, results: PagingResults): PagingResults {
  const $ = cheerio.load(body);

  const links = $('.section-body .aligncenter:nth-child(1)');

  if ($(links).find('a.more-half').length === 2) {
    results.prevLink = ENDPOINT + $(links).find('a.more-half').first().attr()['href'];
    results.nextLink = ENDPOINT + $(links).find('a.more-half').last().attr()['href'];
  } else if ($(links).find('a.more.prev').length === 1) {
    results.prevLink = ENDPOINT + $(links).find('a.more.prev').first().attr()['href'];
  } else if ($(links).find('a.more').length === 1) {
    results.nextLink = ENDPOINT + $(links).find('a.more').first().attr()['href'];
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
        perpage: perpage as any,
      };
      results.prev = () => Submissions(options);
    }
  }

  if (results.nextLink) {
    results.nextLink = ENDPOINT + $(links[2]).find('form').attr()['action'];

    const matchs = results.nextLink.match(/\/browse\/(\d+?)$/);
    if (matchs) {
      const sort = matchs[1];
      const startAt = matchs[2];
      const perpage = matchs[3];

      const options: SubmissionsOptions = {
        sort: sort as any,
        startAt: startAt as any,
        perpage: perpage as any,
      };
      results.next = () => Submissions(options);
    }
  }

  return results;
}

/**
 * Get submission's info
 * @param body HTML document
 * @param id Subumission id
 */
export function ParseSubmission(body: string, id: string): Submission {
  const $ = cheerio.load(body);

  checkSystemMessage($);

  // Get main nodes
  const main = $('#columnpage');
  const sidebar = main.find('.submission-sidebar');
  const content = main.find('.submission-content');

  const stats = sidebar.find('.stats-container');
  const info = sidebar.find('.info');
  const tags = sidebar.find('.tags-row .tags a');

  // buttons
  let downloadUrl: string = `http:${sidebar.find('.buttons .download a')[0].attribs.href}`;
  const favLink: string = `http://furaffinity.net${
    sidebar.find('.buttons .fav a')[0].attribs.href
  }`;

  // header
  const title: string =
    content
      .find('.submission-id-sub-container .submission-title p')[0]
      .childNodes[0].data?.trim() ?? '';
  const authorName: string =
    content.find('.submission-id-sub-container a strong')[0].childNodes[0].data?.trim() ?? '';
  const authorId: string = convertNameToId(authorName);
  const posted: string = content.find('.submission-id-sub-container strong span')[0].attribs.title;
  const authorAvatar: string = `http:${content.find('.submission-id-avatar img')[0].attribs.src}`;
  const authorShinies: boolean = !!$('.shinies-promo');

  // stats
  const rating: Rating =
    Rating[stats.find('.rating span')[0].childNodes[0].data?.trim() as keyof typeof Rating];
  const favorites: number = Number.parseInt(
    stats.find('.favorites span')[0].childNodes[0].data?.trim() ?? ''
  );
  const comments: number = Number.parseInt(
    stats.find('.comments span')[0].childNodes[0].data?.trim() ?? ''
  );
  const views: number = Number.parseInt(
    stats.find('.views span')[0].childNodes[0].data?.trim() ?? ''
  );

  // info
  const category: Category =
    Category[info.find('.category-name')[0].childNodes[0].data?.trim() as keyof typeof Category];
  const species: Species =
    Species[info[0].childNodes[3].childNodes[2].childNodes[0].data?.trim() as keyof typeof Species];
  const gender: Gender =
    Gender[info[0].childNodes[5].childNodes[2].childNodes[0].data?.trim() as keyof typeof Gender];

  // fix url when category is story or poetry
  if (category === Category.Story || category === Category.Poetry) {
    downloadUrl = downloadUrl.replace('d.facdn.net/download/', 'd.facdn.net/');
  }

  const previewUrl: string | undefined =
    content.find('.submission-area img').length > 0
      ? `http:${content.find('.submission-area img')[0].attribs['data-preview-src']}`
      : undefined;

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
      shinies: authorShinies,
    },
    content: {
      category,
      species,
      gender,
    },
    stats: {
      favorites,
      comments,
      views,
    },
    downloadUrl,
    previewUrl,
    keywords: tags
      .map((index, tag) => {
        return tag.childNodes[0].data?.trim() ?? '';
      })
      .get(),
    fave: async () => {
      await FaveSubmission(favLink);
    },
  };
}

/**
 * Get author's info
 * @param body HTML document
 */
export function ParseAuthor(body: string): Author {
  const $ = cheerio.load(body);

  checkSystemMessage($);

  const name: string =
    $('.userpage-flex-item.username span')[0].childNodes[0].data?.trim().slice(1) ?? '';
  const id: string = convertNameToId(name);
  const url: string = `http://www.furaffinity.net/user/${id}`;
  const shinies: boolean = !!$('.userpage-layout-left-col-content > a:nth-child(4)');
  const avatar: string = `https:${$('.user-nav-avatar')[0].attribs.src}`;

  const statsCells = $('.userpage-section-right .cell');
  const views: string = statsCells[0].childNodes[2].data?.trim() ?? '0';
  const submissions: string = statsCells[0].childNodes[6].data?.trim() ?? '0';
  const favs: string = statsCells[0].childNodes[10].data?.trim() ?? '0';
  const commentsEarned: string = statsCells[1].childNodes[2].data?.trim() ?? '0';
  const commentsMade: string = statsCells[1].childNodes[6].data?.trim() ?? '0';
  const journals: string = statsCells[1].childNodes[10].data?.trim() ?? '0';

  return {
    id,
    name,
    url,
    avatar,
    shinies,
    stat: {
      views: Number.parseInt(views),
      submissions: Number.parseInt(submissions),
      favs: Number.parseInt(favs),

      commentsEarned: Number.parseInt(commentsEarned),
      commentsMade: Number.parseInt(commentsMade),
      journals: Number.parseInt(journals),
    },
  };
}

/**
 * Get all Author's info from peer page of watching list
 * @param body HTML document
 */
export function ParseWatchingList(body: string): Author[] {
  const $ = cheerio.load(body);

  checkSystemMessage($);

  return $('.watch-list-items a')
    .map((index, a) => {
      const name = a.childNodes[0].data?.trim() ?? '';
      const id = convertNameToId(name);
      const url = `https://www.furaffinity.net/user/${id}`;

      return {
        id,
        name,
        url,
      };
    })
    .get();
}

/**
 * Get all Author's info from peer page of watching list
 * @param body HTML document
 */
export function ParseMyWatchingList(body: string): Author[] {
  const $ = cheerio.load(body);

  checkSystemMessage($);

  return $('.flex-item-watchlist')
    .map((index, div) => {
      const avatar = `https:${$(div).find('img.avatar')[0].attribs.src}`;
      const name =
        $(div).find('.flex-item-watchlist-controls a strong')[0].childNodes[0].data?.trim() ?? '';
      const id = convertNameToId(name);
      const url = `https://www.furaffinity.net/user/${id}`;

      return {
        id,
        name,
        url,
        avatar,
      };
    })
    .get();
}
