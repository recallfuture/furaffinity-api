import { Search, Login, SearchType, Rating } from "../src/index";
import * as config from "./jest.config";
const { cookieA, cookieB } = config.options.loginOptions;

jest.setTimeout(100000);

test("Search and get submissions", async () => {
  Login(cookieA, cookieB);
  // default page is 1
  const firstPage = await Search("eevee", { type: SearchType.All, rating: Rating.General });
  const secondPage = await Search("eevee", { type: SearchType.All, rating: Rating.General, page: 2 });
  const thirdPage = await Search("eevee", { type: SearchType.All, rating: Rating.General, page: 3 });
  expect(firstPage.length).toBeGreaterThan(0);
  expect(secondPage.length).toBeGreaterThan(0);
  expect(thirdPage.length).toBeGreaterThan(0);

  const prevPage = await secondPage.prev();
  const nextPage = await secondPage.next();

  expect(prevPage.length).toBeGreaterThan(0);
  expect(nextPage.length).toBeGreaterThan(0);
  expect(prevPage[0].id).toEqual(firstPage[0].id);
  expect(nextPage[0].id).toEqual(thirdPage[0].id);
});
