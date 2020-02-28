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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const Request_1 = require("./Request");
const Parser_1 = require("./Parser");
__export(require("./Enums"));
var Request_2 = require("./Request");
exports.Login = Request_2.Login;
exports.SetProxy = Request_2.SetProxy;
/**
 * Get results from search page
 * @param query search query
 * @param options search options
 */
function Search(query, options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return Parser_1.ParseFigures(yield Request_1.FetchSearch(query, options));
        }
        catch (e) {
            console.error('furaffinity-api: ', e);
            return null;
        }
    });
}
exports.Search = Search;
/**
 * Get results from browse page
 * @param options browse options
 */
function Browse(options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return Parser_1.ParseFigures(yield Request_1.FetchBrowse(options));
        }
        catch (e) {
            console.error('furaffinity-api: ', e);
            return null;
        }
    });
}
exports.Browse = Browse;
/**
 * Get submission's info by pass submission id
 * @param id submission id
 */
function Submission(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return Parser_1.ParseSubmission(yield Request_1.FetchSubmission(id), id);
        }
        catch (e) {
            console.error('furaffinity-api: ', e);
            return null;
        }
    });
}
exports.Submission = Submission;
/**
 * Get the current logged in user
 */
function User() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = yield Request_1.FetchIndex();
            return Parser_1.ParseUser(body);
        }
        catch (e) {
            console.error('furaffinity-api: ', e);
            return null;
        }
    });
}
exports.User = User;
/**
 * Get author's info by pass author id
 * @param id author id
 */
function Author(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return Parser_1.ParseAuthor(yield Request_1.FetchAuthor(id));
        }
        catch (e) {
            console.error('furaffinity-api: ', e);
            return null;
        }
    });
}
exports.Author = Author;
/**
 * Get results of a gallery page
 * @param id author id
 * @param page page number
 */
function Gallery(id, page) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return Parser_1.ParseFigures(yield Request_1.FetchGallery(id, page));
        }
        catch (e) {
            console.error('furaffinity-api: ', e);
            return null;
        }
    });
}
exports.Gallery = Gallery;
/**
 * Get results of a scraps page
 * @param id author id
 * @param page page number
 */
function Scraps(id, page) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return Parser_1.ParseFigures(yield Request_1.FetchScraps(id, page));
        }
        catch (e) {
            console.error('furaffinity-api: ', e);
            return null;
        }
    });
}
exports.Scraps = Scraps;
/**
 * Get an author's watching list
 * result don't has avatar
 * @param id author id
 */
function WatchingList(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = [];
        let page = 1;
        try {
            while (true) {
                const users = Parser_1.ParseWatchingList(yield Request_1.FetchWatchingList(id, page++));
                result = [...result, ...users];
                if (users.length === 0 || users.length < 200) {
                    break;
                }
            }
        }
        catch (e) {
            console.error('furaffinity-api: ', e);
            return null;
        }
        return result;
    });
}
exports.WatchingList = WatchingList;
/**
 * Get current login user's watching list
 * this can only use after login
 * result has avatar
 */
function MyWatchingList() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = [];
        let page = 1;
        try {
            while (true) {
                const users = Parser_1.ParseMyWatchingList(yield Request_1.FetchMyWatchingList(page++));
                result = [...result, ...users];
                if (users.length === 0 || users.length < 64) {
                    break;
                }
            }
        }
        catch (e) {
            console.error('furaffinity-api: ', e);
            return null;
        }
        return result;
    });
}
exports.MyWatchingList = MyWatchingList;
