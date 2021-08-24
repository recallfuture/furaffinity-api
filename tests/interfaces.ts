interface ITestConfig {
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
