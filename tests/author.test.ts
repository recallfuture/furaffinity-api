import { Login, Author, Gallery, user, User } from "../src/index";
import * as config from "./jest.config";
const { cookieA, cookieB } = config.options.loginOptions;

test("Test author, gallery and scraps", async () => {
  Login(cookieA, cookieB);
  const userId = "recallfuture";
  // author
  const author = await Author(userId)
  expect(author.id).toBe(userId)

  const user = await User()
  expect(user.id).toBe(userId)

  // gallery
  const gallery = await Gallery(userId, 1);
  expect(gallery instanceof Array).toBeTruthy();
  expect(gallery.length).not.toBe(0);
  expect(!!gallery[0].author).not.toBeFalsy();
});
