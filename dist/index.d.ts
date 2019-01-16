import { SearchOptions, BrowseOptions } from "./Request";
import { Result, Submission } from "./Parser";
import { Type } from "./Enums";
export * from "./Enums";
export { Login } from './Request';
export declare function Recent(type?: Type): Promise<Result[]>;
export declare function Search(query: string, options?: SearchOptions): Promise<Result[]>;
export declare function Browse(options?: BrowseOptions): Promise<Result[]>;
export declare function Submission(id: Number): Promise<Submission>;
