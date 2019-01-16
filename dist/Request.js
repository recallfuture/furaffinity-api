"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ENDPOINT = 'https://www.furaffinity.net/';
const request_1 = __importDefault(require("request"));
const bluebird_1 = __importDefault(require("bluebird"));
const Enums_1 = require("./Enums");
exports.COOKIES = { loggedIn: false, a: '', b: '' };
function Login(cookieA, cookieB) {
    exports.COOKIES.loggedIn = true;
    exports.COOKIES.a = cookieA;
    exports.COOKIES.b = cookieB;
}
exports.Login = Login;
;
;
function GetIndex() {
    return new bluebird_1.default((resolve, reject) => {
        request_1.default({
            url: ENDPOINT,
            headers: exports.COOKIES.loggedIn ? {
                Cookie: `a=${exports.COOKIES.a}; b=${exports.COOKIES.b}`
            } : {}
        }, (err, res, body) => {
            if (err)
                return reject(err);
            if (res.statusCode != 200)
                return reject("Status code not 200; got " + res.statusCode);
            resolve(body.toString());
        });
    });
}
exports.GetIndex = GetIndex;
function GetSearch(query, options) {
    return new bluebird_1.default((resolve, reject) => {
        request_1.default({
            method: 'POST',
            url: ENDPOINT + 'search/?q=' + encodeURIComponent(query),
            headers: exports.COOKIES.loggedIn ? {
                Cookie: `a=${exports.COOKIES.a}; b=${exports.COOKIES.b}`
            } : {},
            form: options ? {
                'rating-general': (options.rating || 0x7) & Enums_1.Rating.General ? 'on' : 'off',
                'rating-mature': (options.rating || 0x7) & Enums_1.Rating.Mature ? 'on' : 'off',
                'rating-adult': (options.rating || 0x7) & Enums_1.Rating.Adult ? 'on' : 'off',
                'type-art': (options.type || 0xF) & Enums_1.Type.Artwork ? 'on' : 'off',
                'type-flash': (options.type || 0xF) & Enums_1.Type.Artwork ? 'on' : 'off',
                'type-photo': (options.type || 0xF) & Enums_1.Type.Any ? 'on' : 'off',
                'type-music': (options.type || 0xF) & Enums_1.Type.Music ? 'on' : 'off',
                'type-story': (options.type || 0xF) & Enums_1.Type.Writing ? 'on' : 'off',
                'type-poetry': (options.type || 0xF) & Enums_1.Type.Writing ? 'on' : 'off',
                perpage: 72
            } : {}
        }, (err, res, body) => {
            if (err)
                return reject(err);
            if (res.statusCode != 200)
                return reject("Status code not 200; got " + res.statusCode);
            resolve(body.toString());
        });
    });
}
exports.GetSearch = GetSearch;
let warn = false;
function GetBrowse(options) {
    return new bluebird_1.default((resolve, reject) => {
        warn || console.log('WARN: Browse currently ignores any options passed.');
        warn = true;
        options = Object.assign({
            category: 1,
            tag: 1,
            species: 1,
            gender: 1
        }, options);
        request_1.default({
            url: ENDPOINT + 'browse',
            headers: exports.COOKIES.loggedIn ? {
                Cookie: `a=${exports.COOKIES.a}; b=${exports.COOKIES.b}`
            } : {},
            form: {
                'rating-general': (options.rating || 0x7) & Enums_1.Rating.General ? 'on' : 'off',
                'rating-mature': (options.rating || 0x7) & Enums_1.Rating.Mature ? 'on' : 'off',
                'rating-adult': (options.rating || 0x7) & Enums_1.Rating.Adult ? 'on' : 'off',
                'cat': options.category,
                'atype': options.tag,
                'species': options.species,
                'gender': options.gender,
                perpage: 72,
                go: 'Update'
            }
        }, (err, res, body) => {
            if (err)
                return reject(err);
            if (res.statusCode != 200)
                return reject("Status code not 200; got " + res.statusCode);
            resolve(body.toString());
        });
    });
}
exports.GetBrowse = GetBrowse;
function GetSubmission(id) {
    return new bluebird_1.default((resolve, reject) => {
        request_1.default({
            url: ENDPOINT + 'full/' + id,
            headers: exports.COOKIES.loggedIn ? {
                Cookie: `a=${exports.COOKIES.a}; b=${exports.COOKIES.b}`
            } : {}
        }, (err, res, body) => {
            if (err)
                return reject(err);
            if (res.statusCode != 200)
                return reject("Status code not 200; got " + res.statusCode);
            resolve(body.toString());
        });
    });
}
exports.GetSubmission = GetSubmission;
