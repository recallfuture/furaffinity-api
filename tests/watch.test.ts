import { Login, MyWatchingList, WatchingList } from "../src/index";
import * as config from "./jest.config";
const { cookieA, cookieB } = config.options.loginOptions;

jest.setTimeout(10000)

test("Waching list", async () => {
  Login(cookieA, cookieB)
  // Please add your cookies to file .env first.
  const wachingList = await WatchingList("recallfuture");
  expect(
    wachingList.findIndex(item => item.id === "rudragon")
  ).not.toBe(-1);

  const list = await MyWatchingList();
  expect(
    list.findIndex(item => item.id === "rudragon")
  ).not.toBe(-1);
});
