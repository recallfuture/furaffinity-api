import { Login, Author, watchAuthor, unwatchAuthor, User } from "../src/index";
import * as config from "./jest.config";
const { cookieA, cookieB } = config.options.loginOptions;

jest.setTimeout(20000);

test("Test watch and unwatch of author", async () => {
  Login(cookieA, cookieB);
  const userId = config.options.watchOptions.shouldContainUserId;
  // check author
  let author = await Author(userId);
  expect(author.id).toBe(userId);

  // unwatch to reset test
  const watchStateBefore = author.stats?.watching;
  if (author.stats?.watching) {
    await author.unwatchAuthor?.();
    author = await Author(userId);
  }

  // test watching
  expect(author.stats?.watching).toBeFalsy();
  console.log('Before watch', author);
  await watchAuthor(userId);
  author = await Author(userId);
  console.log('After watch', author);
  expect(author.stats?.watching).toBeTruthy();
  
  // test unwatching
  expect(author.stats?.watching).toBeTruthy();
  console.log('Before unwatch', author);
  await unwatchAuthor(userId);
  author = await Author(userId);
  console.log('After unwatch', author);
  expect(author.stats?.watching).toBeFalsy();

  // reset watch state
  if (watchStateBefore) await author.watchAuthor?.();

  // test watch self, make sure no effact
  const self = await User()
  expect(self.watchLink).toBeUndefined();
  expect(self.stats?.watching).toBeFalsy();
  expect(self.watchAuthor).toBeUndefined();
  expect(self.unwatchAuthor).toBeUndefined();
  await watchAuthor(self.id)
  await unwatchAuthor(self.id)
  expect(self.watchLink).toBeUndefined();
  expect(self.stats?.watching).toBeFalsy();
  expect(self.watchAuthor).toBeUndefined();
  expect(self.unwatchAuthor).toBeUndefined();
});
