import { Browse, Login, Rating } from "../src/index";
import * as config from "./jest.config";
const { cookieA, cookieB } = config.options.loginOptions;

test("Browse and get submissions", async () => {
  Login(cookieA, cookieB);
  const results = await Browse({ rating: Rating.General });
  const excetpContainKeys = [
    "author",
    "id",
    "rating",
    "thumb",
    "title",
    "type",
    "url",
    "getSubmission"
  ].sort();
  expect(results instanceof Array).toBe(true);
  expect(results.length).not.toBe(-1);
  expect(Object.keys(results[0]).sort()).toEqual(excetpContainKeys);
  // submissions
  const submissions = await results[0].getSubmission();
  console.log(results[0]);
  expect(!!submissions.author).not.toBeFalsy();
});
