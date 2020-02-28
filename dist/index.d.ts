import { SearchOptions, BrowseOptions } from './Request';
import { Author, Result, Submission } from './interfaces';
export * from './Enums';
export * from './interfaces';
export { Login, SetProxy } from './Request';
/**
 * Get results from search page
 * @param query search query
 * @param options search options
 */
export declare function Search(query: string, options?: SearchOptions): Promise<Result[] | null>;
/**
 * Get results from browse page
 * @param options browse options
 */
export declare function Browse(options?: BrowseOptions): Promise<Result[] | null>;
/**
 * Get submission's info by pass submission id
 * @param id submission id
 */
export declare function Submission(id: string): Promise<Submission | null>;
/**
 * Get the current logged in user
 */
export declare function User(): Promise<Author | null>;
/**
 * Get author's info by pass author id
 * @param id author id
 */
export declare function Author(id: string): Promise<Author | null>;
/**
 * Get results of a gallery page
 * @param id author id
 * @param page page number
 */
export declare function Gallery(id: string, page: number): Promise<Result[] | null>;
/**
 * Get results of a scraps page
 * @param id author id
 * @param page page number
 */
export declare function Scraps(id: string, page: number): Promise<Result[] | null>;
/**
 * Get an author's watching list
 * result don't has avatar
 * @param id author id
 */
export declare function WatchingList(id: string): Promise<Author[] | null>;
/**
 * Get current login user's watching list
 * this can only use after login
 * result has avatar
 */
export declare function MyWatchingList(): Promise<Author[] | null>;
