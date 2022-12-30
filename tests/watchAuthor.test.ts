import { Login, Author } from "../src/index";
import * as config from "./jest.config";
const { cookieA, cookieB } = config.options.loginOptions;

test("Test watch and unwatch of author", async () => {
  // jest.setTimeout(10000);
  Login(cookieA, cookieB);
  // FIXME: test config wrongly understood, might need differetn value. But worked to test.
  const userId = config.options.watchOptions.shouldContainUserId;
  // check author
  let author = await Author(userId);
  expect(author.id).toBe(userId);
  
  // unwatch to reset test
  const watchStateBefore = author.stats?.watching;
  if (author.stats?.watching) {
    await author.unwatchAuthor();
    author = await Author(userId);
  }

  // test watching
  expect(author.stats?.watching).toBeFalsy();
  console.log('Before watch', author);
  await author.watchAuthor();
  author = await Author(userId);
  console.log('After watch', author);
  expect(author.stats?.watching).toBeTruthy();
  
  // test unwatching
  expect(author.stats?.watching).toBeTruthy();
  console.log('Before unwatch', author);
  await author.unwatchAuthor();
  author = await Author(userId);
  console.log('After unwatch', author);
  expect(author.stats?.watching).toBeFalsy();

  // reset watch state
  if (watchStateBefore) await author.watchAuthor();
});
