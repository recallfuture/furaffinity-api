import { Rating, SearchType, Category, Tag, Species, Gender } from './Enums';
export declare const COOKIES: {
    loggedIn: boolean;
    a: string;
    b: string;
};
export declare function Login(cookieA: string, cookieB: string): void;
export declare function SetProxy(config?: false | string): void;
export interface SearchOptions {
    page?: number;
    rating?: Rating;
    type?: SearchType;
}
export interface BrowseOptions {
    page?: number;
    rating?: Rating;
    category?: Category;
    tag?: Tag;
    species?: Species;
    gender?: Gender;
}
export declare function FetchIndex(): Promise<string>;
export declare function FetchSearch(query: string, options?: SearchOptions): Promise<string>;
export declare function FetchBrowse(options?: BrowseOptions): Promise<string>;
export declare function FetchGallery(id: string, page?: number): Promise<string>;
export declare function FetchScraps(id: string, page?: number): Promise<string>;
export declare function FetchSubmission(id: string): Promise<string>;
export declare function FaveSubmission(favLink: string): Promise<void>;
export declare function FetchAuthor(id: string): Promise<string>;
export declare function FetchWatchingList(id: string, page?: number): Promise<string>;
export declare function FetchMyWatchingList(page?: number): Promise<string>;
