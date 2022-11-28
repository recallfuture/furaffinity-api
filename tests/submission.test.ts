import { Login, Submission, Submissions } from "../src/index";
import * as config from "./jest.config";
const { cookieA, cookieB } = config.options.loginOptions;

jest.setTimeout(10000)

test("Waching list", async () => {
  Login(cookieA, cookieB)
  // Please add your cookies to file .env first.
  const submissions = await Submissions();
  expect(submissions.length).not.toBe(0);
  console.log(submissions[2])

  const submission = await Submission(submissions[2].id);
  expect(submission.id).toBe(submissions[2].id);
  console.log(submission)
});
