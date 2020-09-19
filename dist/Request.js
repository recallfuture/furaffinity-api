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
const ENDPOINT = 'http://www.furaffinity.net';
const Enums_1 = require("./Enums");
const cloudscraper_1 = __importDefault(require("cloudscraper"));
exports.COOKIES = { loggedIn: false, a: '', b: '' };
function Login(cookieA, cookieB) {
    exports.COOKIES.loggedIn = true;
    exports.COOKIES.a = cookieA;
    exports.COOKIES.b = cookieB;
}
exports.Login = Login;
function SetProxy(config) {
    cloudscraper_1.default.defaults({ proxy: config });
}
exports.SetProxy = SetProxy;
;
;
function FetchIndex() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield new Promise((resolve, reject) => {
            cloudscraper_1.default({
                url: ENDPOINT,
                headers: exports.COOKIES.loggedIn ? {
                    Cookie: `a=${exports.COOKIES.a}; b=${exports.COOKIES.b}`
                } : {}
            }, (error, response, body) => {
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
    });
}
exports.FetchIndex = FetchIndex;
function FetchSearch(query, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${ENDPOINT}/search/?q=${encodeURIComponent(query)}`;
        return yield new Promise((resolve, reject) => {
            cloudscraper_1.default({
                url,
                headers: exports.COOKIES.loggedIn ? {
                    Cookie: `a=${exports.COOKIES.a}; b=${exports.COOKIES.b}`
                } : {},
                formData: options ? {
                    'rating-general': (options.rating || Enums_1.Rating.Any) & Enums_1.Rating.General ? 'on' : 'off',
                    'rating-mature': (options.rating || Enums_1.Rating.Any) & Enums_1.Rating.Mature ? 'on' : 'off',
                    'rating-adult': (options.rating || Enums_1.Rating.Any) & Enums_1.Rating.Adult ? 'on' : 'off',
                    'type-art': (options.type || Enums_1.SearchType.All) & Enums_1.SearchType.Art ? 'on' : 'off',
                    'type-flash': (options.type || Enums_1.SearchType.All) & Enums_1.SearchType.Flash ? 'on' : 'off',
                    'type-photo': (options.type || Enums_1.SearchType.All) & Enums_1.SearchType.Photos ? 'on' : 'off',
                    'type-music': (options.type || Enums_1.SearchType.All) & Enums_1.SearchType.Music ? 'on' : 'off',
                    'type-story': (options.type || Enums_1.SearchType.All) & Enums_1.SearchType.Story ? 'on' : 'off',
                    'type-poetry': (options.type || Enums_1.SearchType.All) & Enums_1.SearchType.Poetry ? 'on' : 'off',
                    perpage: 72,
                    page: options.page || 1,
                } : {}
            }, (error, response, body) => {
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
    });
}
exports.FetchSearch = FetchSearch;
let warn = false;
function FetchBrowse(options) {
    return __awaiter(this, void 0, void 0, function* () {
        warn || console.log('WARN: Browse currently ignores any options passed.');
        warn = true;
        const newOptions = Object.assign({
            category: 1,
            tag: 1,
            species: 1,
            gender: 1
        }, options);
        const url = `${ENDPOINT}/browse`;
        return yield new Promise((resolve, reject) => {
            cloudscraper_1.default({
                url,
                headers: exports.COOKIES.loggedIn ? {
                    Cookie: `a=${exports.COOKIES.a}; b=${exports.COOKIES.b}`
                } : {},
                formData: {
                    'rating-general': (newOptions.rating || 0x7) & Enums_1.Rating.General ? 'on' : 'off',
                    'rating-mature': (newOptions.rating || 0x7) & Enums_1.Rating.Mature ? 'on' : 'off',
                    'rating-adult': (newOptions.rating || 0x7) & Enums_1.Rating.Adult ? 'on' : 'off',
                    'cat': newOptions.category,
                    'atype': newOptions.tag,
                    'species': newOptions.species,
                    'gender': newOptions.gender,
                    perpage: 72,
                    go: 'Update',
                    page: newOptions.page || 1,
                }
            }, (error, response, body) => {
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
    });
}
exports.FetchBrowse = FetchBrowse;
function FetchGallery(id, page = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${ENDPOINT}/gallery/${id}/${page}`;
        return yield new Promise((resolve, reject) => {
            cloudscraper_1.default({
                url,
                headers: exports.COOKIES.loggedIn ? {
                    Cookie: `a=${exports.COOKIES.a}; b=${exports.COOKIES.b}`
                } : {}
            }, (error, response, body) => {
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
    });
}
exports.FetchGallery = FetchGallery;
function FetchScraps(id, page = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${ENDPOINT}/scraps/${id}/${page}`;
        return yield new Promise((resolve, reject) => {
            cloudscraper_1.default({
                url,
                headers: exports.COOKIES.loggedIn ? {
                    Cookie: `a=${exports.COOKIES.a}; b=${exports.COOKIES.b}`
                } : {}
            }, (error, response, body) => {
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
    });
}
exports.FetchScraps = FetchScraps;
function FetchSubmission(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${ENDPOINT}/view/${id}`;
        return yield new Promise((resolve, reject) => {
            cloudscraper_1.default({
                url,
                headers: exports.COOKIES.loggedIn ? {
                    Cookie: `a=${exports.COOKIES.a}; b=${exports.COOKIES.b}`
                } : {}
            }, (error, response, body) => {
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
    });
}
exports.FetchSubmission = FetchSubmission;
function FaveSubmission(favLink) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield new Promise((resolve, reject) => {
            cloudscraper_1.default({
                url: favLink,
                headers: exports.COOKIES.loggedIn ? {
                    Cookie: `a=${exports.COOKIES.a}; b=${exports.COOKIES.b}`
                } : {}
            }, (error, response, body) => {
                if (error) {
                    console.error(error);
                    reject();
                }
                if (response.statusCode !== 200) {
                    console.error(`${response.statusCode}: `, response.statusMessage);
                    reject();
                }
                resolve();
            });
        });
    });
}
exports.FaveSubmission = FaveSubmission;
function FetchAuthor(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${ENDPOINT}/user/${id}`;
        return yield new Promise((resolve, reject) => {
            cloudscraper_1.default({
                url,
                headers: exports.COOKIES.loggedIn ? {
                    Cookie: `a=${exports.COOKIES.a}; b=${exports.COOKIES.b}`
                } : {}
            }, (error, response, body) => {
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
    });
}
exports.FetchAuthor = FetchAuthor;
function FetchWatchingList(id, page = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${ENDPOINT}/watchlist/by/${id}/${page}`;
        return yield new Promise((resolve, reject) => {
            cloudscraper_1.default({
                url,
                headers: exports.COOKIES.loggedIn ? {
                    Cookie: `a=${exports.COOKIES.a}; b=${exports.COOKIES.b}`
                } : {}
            }, (error, response, body) => {
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
    });
}
exports.FetchWatchingList = FetchWatchingList;
function FetchMyWatchingList(page = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${ENDPOINT}/controls/buddylist/${page}`;
        return yield new Promise((resolve, reject) => {
            cloudscraper_1.default({
                url,
                headers: exports.COOKIES.loggedIn ? {
                    Cookie: `a=${exports.COOKIES.a}; b=${exports.COOKIES.b}`
                } : {}
            }, (error, response, body) => {
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
    });
}
exports.FetchMyWatchingList = FetchMyWatchingList;
