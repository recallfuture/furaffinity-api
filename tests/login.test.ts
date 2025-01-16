import { Login, User } from "../src/index";
import * as config from "./jest.config";
const { cookieA, cookieB } = config.options.loginOptions;

jest.setTimeout(20000);

test("Login ans get userinfo", async () => {
  // Please add your cookies to file .env first.
  Login(cookieA, cookieB);
  const user = await User();
  const exceptContainKeys = ["id", "name", "url", "avatar", "shinies", "watchLink", "stats", "watchAuthor", "unwatchAuthor"];
  expect(Object.keys(user)).toEqual(exceptContainKeys);
  expect(["", "guest"]).not.toContain(user["id"]);
});
