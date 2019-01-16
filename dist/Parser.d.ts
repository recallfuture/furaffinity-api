import { Type, Species, Category, Gender, Rating } from './Enums';
import { SearchOptions } from './Request';
export interface Result {
    type: Type;
    id: Number;
    title: string;
    url: string;
    thumb: {
        icon: string;
        tiny: string;
        small: string;
        medium: string;
        large: string;
    };
    author: {
        url: string;
        name: string;
    };
    getSubmission(): Promise<Submission>;
}
export declare function ParseFigure(figure: any, type: Type): Result;
export declare function ParseIndex(body: string, type?: Type): Result[];
export declare function ParseSearch(body: string, options?: SearchOptions): Result[];
export declare function ParseBrowse(body: string): Result[];
export interface Submission {
    id: Number;
    url: string;
    title: string;
    posted: string;
    rating: Rating;
    author: {
        url: String;
        name: string;
    };
    content: {
        category: Category;
        species: Species;
        gender: Gender;
    };
    stats: {
        favorites: Number;
        comments: Number;
        views: Number;
    };
    image: {
        url: string;
        width: Number;
        height: Number;
    };
    keywords: string[];
}
export declare function ParseSubmission(body: string, id: Number): Submission;
