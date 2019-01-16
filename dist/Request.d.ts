import Promise from 'bluebird';
import { Rating, Type, Category, Tag, Species, Gender } from './Enums';
export declare const COOKIES: {
    loggedIn: boolean;
    a: string;
    b: string;
};
export declare function Login(cookieA: string, cookieB: string): void;
export interface SearchOptions {
    rating?: Rating;
    type?: Type;
}
export interface BrowseOptions {
    rating?: Rating;
    category?: Category;
    tag?: Tag;
    species?: Species;
    gender?: Gender;
}
export declare function GetIndex(): Promise<string>;
export declare function GetSearch(query: string, options?: SearchOptions): Promise<string>;
export declare function GetBrowse(options?: BrowseOptions): Promise<string>;
export declare function GetSubmission(id: Number): Promise<string>;
