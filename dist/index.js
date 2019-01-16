"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
function Recent(type) {
    return __awaiter(this, void 0, void 0, function* () {
        return Parser_1.ParseIndex(yield Request_1.GetIndex(), type);
    });
}
exports.Recent = Recent;
function Search(query, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return Parser_1.ParseSearch(yield Request_1.GetSearch(query, options), options);
    });
}
exports.Search = Search;
function Browse(options) {
    return __awaiter(this, void 0, void 0, function* () {
        return Parser_1.ParseBrowse(yield Request_1.GetBrowse(options));
    });
}
exports.Browse = Browse;
function Submission(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return Parser_1.ParseSubmission(yield Request_1.GetSubmission(id), id);
    });
}
exports.Submission = Submission;
