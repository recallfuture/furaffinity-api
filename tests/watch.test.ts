import { WatchingList } from "../src/index"
require("dotenv").config()
import * as config from "./jest.config"
const { userId, shouldContainUserId } = config.options.watchOptions

test("Waching list", async () => {
  // Please add your cookies to file .env first.
  const wachingList = await WatchingList(userId)
  expect(
    wachingList.findIndex((item) => item.id === shouldContainUserId)
  ).not.toBe(-1)
})
