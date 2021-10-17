import { Search, Login, SearchType, Rating, SubmissionType } from "../src/index";
import * as config from "./jest.config";
const { cookieA, cookieB } = config.options.loginOptions;

test("Search and get submissions", async () => {
  Login(cookieA, cookieB);
  const results = await Search("eevee", { type: SearchType.Photos, rating: Rating.Mature });
  const excetpContainKeys = ["author", "id", "rating", "thumb", "title", "type", "url", "getSubmission"].sort();
  expect(results instanceof Array).toBe(true);
  expect(results.length).not.toBe(-1);
  expect(Object.keys(results[0]).sort()).toEqual(excetpContainKeys);
  expect(results[0].rating).toEqual(Rating.Mature);
  expect(results[0].type).toEqual(SubmissionType.image);
  // submissions
  const submissions = await results[0].getSubmission();
  expect(!!submissions.author).not.toBeFalsy();
});
