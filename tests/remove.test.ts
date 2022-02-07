import { login, submissions, removeFromInbox } from "../src/index";
import * as config from "./jest.config";
const { cookieA, cookieB } = config.options.loginOptions;

jest.setTimeout(10000);

test("Remove a submission from inbox", async () => {  
  login(cookieA, cookieB);
  const items = await submissions();
  expect(items.length).toBeGreaterThan(1);
  const firstId = items[0].id;
  const secondId = items[1].id;
  await removeFromInbox([firstId, secondId]);
  const newItems = await submissions();
  expect(newItems[0].id).not.toEqual(firstId)
  expect(newItems[0].id).not.toEqual(secondId);
});
