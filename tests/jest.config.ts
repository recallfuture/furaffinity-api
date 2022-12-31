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
    cookieA: "c0620986-f48a-4bd7-971c-2a25566e0a7d", // your cookies
    cookieB: "b53dbcb1-394c-4aac-b973-040c8ea1844c"
  },
  watchOptions: {
    userId: "recallfuture",
    shouldContainUserId: "rudragon"
  },
  authorOptions: {
    userId: "rudragon"
  }
};
