import { Login, Gallery } from "../src/index";
import * as config from "./jest.config";
const { userId } = config.options.authorOptions;
const { cookieA, cookieB } = config.options.loginOptions;

test("Test author, gallery and scraps", async () => {
  Login(cookieA, cookieB);
  //   // author
  //   const results = await Author(userId)
  //   expect(!!results.id).not.toBeFalsy()
  // gallery
  const gallery = await Gallery(userId, 1);
  expect(gallery instanceof Array).toBeTruthy();
  expect(gallery.length).not.toBe(0);
  expect(!!gallery[0].author).not.toBeFalsy();
});
