/// <reference types="cheerio" />
import { Author, Result, Submission } from './interfaces';
/**
 * Parse result from figure element
 * @param figure CheerioElement
 */
export declare function ParseFigure(figure: CheerioElement, author?: Author): Result;
/**
 * Parse all figure's info from HTML
 * @param body HTML document
 */
export declare function ParseFigures(body: string): Result[];
/**
 * Get submission's info
 * @param body HTML document
 * @param id Subumission id
 */
export declare function ParseSubmission(body: string, id: string): Submission;
/**
 * Get author's info
 * @param body HTML document
 */
export declare function ParseAuthor(body: string): Author;
/**
 * Get the current logged in user
 * @param body HTML document
 */
export declare function ParseUser(body: string): Author | null;
/**
 * Get all Author's info from peer page of watching list
 * @param body HTML document
 */
export declare function ParseWatchingList(body: string): Author[];
/**
 * Get all Author's info from peer page of watching list
 * @param body HTML document
 */
export declare function ParseMyWatchingList(body: string): Author[];
