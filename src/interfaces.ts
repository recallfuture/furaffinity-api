import { SubmissionType, Species, Category, Gender, Rating } from './Enums';

export interface Author {
	id: string,
	name: string,
	url: string,
	avatar?: string,
	shinies?: boolean,
	stat?: {
		views: number,
		submissions: number,
		favs: number,

		commentsEarned: number,
		commentsMade: number,
		journals: number,
	}
}

export interface Result {
	type: SubmissionType,
	id: string,
	title: string,
	url: string,
	rating: Rating,
	thumb: {
		icon: string,
		tiny: string,
		small: string,
		medium: string,
		large: string
	},
	author: Author,
	getSubmission(): Promise<Submission | null>
};

export interface PagingResults extends Array<Result> {
	prevLink?: string,
	nextLink?: string,
	prev?: () => Promise<PagingResults>,
	next?: () => Promise<PagingResults>
}

export interface Submission {
	id: string,
	url: string,
	title: string,
	posted: number,
	rating: Rating,
	favLink: string,
	author: Author,
	content: {
		category: Category,
		species: Species,
		gender: Gender
	},
	stats: {
		favorites: Number,
		comments: Number,
		views: Number
	},
	downloadUrl: string,
	previewUrl?: string,
	keywords: string[],
	fave(): Promise<void>
};
