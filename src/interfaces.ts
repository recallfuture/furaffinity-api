import { SubmissionType, Species, Category, Gender, Rating } from './Enums';

export interface Author {
	id: string,
	name: string,
	url: string,
	avatar?: string,
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
	getSubmission(): Promise<Submission>
};

export interface Submission {
	id: string,
	url: string,
	title: string,
	posted: number,
	rating: Rating,
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
	keywords: string[]
};