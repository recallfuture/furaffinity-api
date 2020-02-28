"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = __importDefault(require("cheerio"));
const Enums_1 = require("./Enums");
const _1 = require(".");
const Request_1 = require("./Request");
/**
 * Convert author name to author id
 * @param name author name
 */
function convertNameToId(name) {
    return name.trim().split('_').join('').toLowerCase();
}
/**
 * Get class names from element
 * @param element CheerioElement
 */
function classNames(element) {
    return element.attribs.class.split(' ');
}
function checkSystemMessage($) {
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
function ParseFigure(figure, author) {
    var _a, _b, _c, _d;
    const id = (_a = figure.attribs.id.split('-').pop()) !== null && _a !== void 0 ? _a : '';
    const thumb = 'http:' + figure.childNodes[0].childNodes[0].childNodes[0].childNodes[0].attribs.src;
    return {
        type: Enums_1.SubmissionType[classNames(figure)[1].split('-').pop()],
        id,
        title: (_c = (_b = figure.childNodes[1].childNodes[0].childNodes[0].childNodes[0]) === null || _b === void 0 ? void 0 : _b.nodeValue) !== null && _c !== void 0 ? _c : '',
        url: `https://www.furaffinity.net/view/${id}`,
        rating: Enums_1.Rating[(_d = classNames(figure)[0].split('-').pop()) === null || _d === void 0 ? void 0 : _d.replace(/^[a-z]/, ($1) => $1.toUpperCase())],
        thumb: {
            icon: thumb.replace(/@\d+?-/g, '@75-'),
            tiny: thumb.replace(/@\d+?-/g, '@150-'),
            small: thumb.replace(/@\d+?-/g, '@300-'),
            medium: thumb.replace(/@\d+?-/g, '@800-'),
            large: thumb.replace(/@\d+?-/g, '@1600-')
        },
        author: author !== null && author !== void 0 ? author : {
            id: classNames(figure)[2].slice(2),
            url: `https://www.furaffinity.net/user/${classNames(figure)[2].slice(2)}`,
            name: figure.childNodes[1].childNodes[1].childNodes[2].childNodes[0].nodeValue.trim()
        },
        getSubmission: () => __awaiter(this, void 0, void 0, function* () {
            return yield _1.Submission(id);
        })
    };
}
exports.ParseFigure = ParseFigure;
;
/**
 * Parse all figure's info from HTML
 * @param body HTML document
 */
function ParseFigures(body) {
    const $ = cheerio_1.default.load(body);
    let author;
    try {
        author = ParseAuthor(body);
    }
    catch (e) {
    }
    const results = [];
    $('figure').each((index, figure) => {
        results.push(ParseFigure(figure, author));
    });
    return results;
}
exports.ParseFigures = ParseFigures;
;
/**
 * Get submission's info
 * @param body HTML document
 * @param id Subumission id
 */
function ParseSubmission(body, id) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    const $ = cheerio_1.default.load(body);
    checkSystemMessage($);
    // Get main nodes
    const main = $('#columnpage');
    const sidebar = main.find('.submission-sidebar');
    const content = main.find('.submission-content');
    const stats = sidebar.find('.stats-container');
    const info = sidebar.find('.info');
    const tags = sidebar.find('.tags-row .tags a');
    // buttons
    let downloadUrl = `http:${sidebar.find('.buttons .download a')[0].attribs.href}`;
    const favLink = `http://furaffinity.net${sidebar.find('.buttons .fav a')[0].attribs.href}`;
    console.log(downloadUrl);
    // header
    const title = (_b = (_a = content.find('.submission-id-sub-container .submission-title p')[0].childNodes[0].data) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : '';
    const authorName = (_d = (_c = content.find('.submission-id-sub-container a strong')[0].childNodes[0].data) === null || _c === void 0 ? void 0 : _c.trim()) !== null && _d !== void 0 ? _d : '';
    const authorId = convertNameToId(authorName);
    const posted = content.find('.submission-id-sub-container strong span')[0].attribs.title;
    const authorAvatar = `http:${content.find('.submission-id-avatar img')[0].attribs.src}`;
    const authorShinies = (!!$('.shinies-promo'));
    // stats
    const rating = Enums_1.Rating[(_e = stats.find('.rating span')[0].childNodes[0].data) === null || _e === void 0 ? void 0 : _e.trim()];
    const favorites = Number.parseInt((_g = (_f = stats.find('.favorites span')[0].childNodes[0].data) === null || _f === void 0 ? void 0 : _f.trim()) !== null && _g !== void 0 ? _g : '');
    const comments = Number.parseInt((_j = (_h = stats.find('.comments span')[0].childNodes[0].data) === null || _h === void 0 ? void 0 : _h.trim()) !== null && _j !== void 0 ? _j : '');
    const views = Number.parseInt((_l = (_k = stats.find('.views span')[0].childNodes[0].data) === null || _k === void 0 ? void 0 : _k.trim()) !== null && _l !== void 0 ? _l : '');
    // info
    const category = Enums_1.Category[(_m = info.find('.category-name')[0].childNodes[0].data) === null || _m === void 0 ? void 0 : _m.trim()];
    const species = Enums_1.Species[(_o = info[0].childNodes[3].childNodes[2].childNodes[0].data) === null || _o === void 0 ? void 0 : _o.trim()];
    const gender = Enums_1.Gender[(_p = info[0].childNodes[5].childNodes[2].childNodes[0].data) === null || _p === void 0 ? void 0 : _p.trim()];
    // fix url when category is story or poetry
    if (category === Enums_1.Category.Story || category === Enums_1.Category.Poetry) {
        downloadUrl = downloadUrl.replace('d.facdn.net/download/', 'd.facdn.net/');
    }
    const previewUrl = (content.find('.submission-area img').length > 0)
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
            gender
        },
        stats: {
            favorites,
            comments,
            views
        },
        downloadUrl,
        previewUrl,
        keywords: tags.map((index, tag) => {
            var _a, _b;
            return (_b = (_a = tag.childNodes[0].data) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : '';
        }).get(),
        fave: () => __awaiter(this, void 0, void 0, function* () {
            yield Request_1.FaveSubmission(favLink);
        })
    };
}
exports.ParseSubmission = ParseSubmission;
;
/**
 * Get author's info
 * @param body HTML document
 */
function ParseAuthor(body) {
    var _a, _b;
    const $ = cheerio_1.default.load(body);
    checkSystemMessage($);
    const name = (_b = (_a = $('.userpage-flex-item.username span')[0].childNodes[0].data) === null || _a === void 0 ? void 0 : _a.trim().slice(1)) !== null && _b !== void 0 ? _b : '';
    const id = convertNameToId(name);
    const url = `http://www.furaffinity.net/user/${id}`;
    const shinies = (!!$('.userpage-layout-left-col-content > a:nth-child(4)'));
    const avatar = `http:${$('.user-nav-avatar')[0].attribs.src}`;
    return {
        id,
        name,
        url,
        avatar,
        shinies,
    };
}
exports.ParseAuthor = ParseAuthor;
/**
 * Get the current logged in user
 * @param body HTML document
 */
function ParseUser(body) {
    var _a, _b;
    const $ = cheerio_1.default.load(body);
    checkSystemMessage($);
    if ($('#my-username').length === 0) {
        return null;
    }
    const name = (_b = (_a = $('#my-username')[1].childNodes[0].data) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : '';
    const id = convertNameToId(name);
    const url = `http://www.furaffinity.net/user/${id}`;
    const shinies = ($('.userpage-layout-left-col-content > a:nth-child(4)').length > 0);
    const avatar = `http:${$('.loggedin_user_avatar')[0].attribs.src}`;
    return {
        id,
        name,
        url,
        shinies,
        avatar
    };
}
exports.ParseUser = ParseUser;
/**
 * Get all Author's info from peer page of watching list
 * @param body HTML document
 */
function ParseWatchingList(body) {
    const $ = cheerio_1.default.load(body);
    checkSystemMessage($);
    return $('.watch-list-items a').map((index, a) => {
        var _a, _b;
        const name = (_b = (_a = a.childNodes[0].data) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : '';
        const id = convertNameToId(name);
        const url = `http://www.furaffinity.net/user/${id}`;
        return {
            id,
            name,
            url
        };
    }).get();
}
exports.ParseWatchingList = ParseWatchingList;
/**
 * Get all Author's info from peer page of watching list
 * @param body HTML document
 */
function ParseMyWatchingList(body) {
    const $ = cheerio_1.default.load(body);
    checkSystemMessage($);
    return $('.flex-item-watchlist').map((index, div) => {
        var _a, _b;
        const avatar = `http:${$(div).find('img.avatar')[0].attribs.src}`;
        const name = (_b = (_a = $(div).find('.flex-item-watchlist-controls a strong')[0].childNodes[0].data) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : '';
        const id = convertNameToId(name);
        const url = `http://www.furaffinity.net/user/${id}`;
        return {
            id,
            name,
            url,
            avatar
        };
    }).get();
}
exports.ParseMyWatchingList = ParseMyWatchingList;
