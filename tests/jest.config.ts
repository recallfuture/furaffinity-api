export interface ITestConfig {
  loginOptions: {
    cookieA: string;
    cookieB: string;
  };
  watchOptions: {
    userId: string;
    shouldContainUserId: string;
  };
  authorOptions: {
    userId: string;
  };
}

export const options: ITestConfig = {
  loginOptions: {
    cookieA: "cc08dd90-c453-49c7-8144-2e6ffe1197d7", // your cookies
    cookieB: "b53dbcb1-394c-4aac-b973-040c8ea1844c"
  },
  watchOptions: {
    userId: "meeken",
    shouldContainUserId: "axelferdinan"
  },
  authorOptions: {
    userId: "sunnytheholyfox"
  }
};
