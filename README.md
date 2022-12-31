<h1 align="center">
  furaffinity-api
</h1>

<h5 align="center">FurAffinity wrapper for Node.js</h5>

<div align="center">
  <a href="https://www.npmjs.com/package/furaffinity-api">
    <img alt="npm" src="https://img.shields.io/npm/v/furaffinity-api">
  </a>
  <a href="https://www.npmjs.com/package/furaffinity-api">
    <img alt="npm" src="https://img.shields.io/npm/dw/furaffinity-api">
  </a>
  <a href="https://github.com/recallfuture/furaffinity-api">
    <img alt="NPM" src="https://img.shields.io/npm/l/furaffinity-api">
  </a>

  <p align="center">English | <a href="README.zh-CN.md">中文</a></p>
</div>

> **Important:** This project can only be used with Furaffinity's **Modern** style.

## Installation

```bash
npm install furaffinity-api
```

## APIs

> Form version 4.1.0, you can call any API with their lower case name.
> (e.g., `const {login, search} form "furaffinity-api";`)

### Login(a: string, b: string)

Login to furaffinity use cookies

```js
import { Login } from "furaffinity-api";
// or
const { Login } = require("furaffinity-api");

// to allow all results to be accessible, add your cookies
Login("cookie_a", "cookie_b");
```

### Search(query: string, options: SearchOptions)

Searching for content:

```js
import { Search, Type } from 'furaffinity-api';

Search('search query', { /** SearchOptions */ type?, rating?, page? }).then(res => {
  // res is an array of Result(s)
  res[0].getSubmission().then(submission => {
    // submission is a Submission
  });
});
```

### Browse(options?: BrowseOptions)

Get results from Browse page:

```js
import { Browse } from "furaffinity-api";

Browse({
  /** BrowseOptions */
}).then((res) => {
  // res is an array of Result(s)
  res[0].getSubmission().then((submission) => {
    // submission is a Submission
  });
});
```

### Submission(id: string)

Looking up a specific submission:

```js
import { Submission } from "furaffinity-api";

Submission("1234567890").then((res) => {
  // res is a Submission
});
```

### User()

Get information of current logged in user:

```js
import { User } from "furaffinity-api";

User().then((user) => {
  // console.log(user);
});
```

### Author(id: string)

Get information of an author:

```js
import { Author, WatchingList } from "furaffinity-api";

Author("user_id").then((res) => {
  // res is an Author
  // Author has id, name, url and avatar(maybe undefined)
  WatchingList(res.id).then((list) => {
    // list is an Author array
  });
});
```

### Gallery(id: string)

Get results from someone's gallery:

```js
import { Gallery } from "furaffinity-api";

Gallery("author_id").then((res) => {
  // res is an array of Result(s)
  res[0].getSubmission().then((submission) => {
    // submission is a Submission
  });
});
```

### Scraps(id: string)

Get results from someone's scraps:

```js
import { Scraps } from "furaffinity-api";

Scraps("author_id").then((res) => {
  // res is an array of Result(s)
  res[0].getSubmission().then((submission) => {
    // submission is a Submission
  });
});
```

### Submissions()

Get results from submissions timeline:

```js
import { Submissions } from "furaffinity-api";

Submissions().then((res) => {
  // res is an array of Result(s)
  res[0].getSubmission().then((submission) => {
    // submission is a Submission
  });
});
```

### WatchingList(id: string)

Get all watching authors of an author(can't get avatar):

```js
import { WatchingList } from "furaffinity-api";

WatchingList("author_id").then((list) => {
  // list is an Author array
});
```

### MyWatchingList()

**Login first**
Get all watching authors of current login user(can get avatar):

```js
import { MyWatchingList } from "furaffinity-api";

MyWatchingList().then((list) => {
  // list is an Author array
});
```

### removeFromInbox()

**Login first**
Remove submissions from submission inbox, only delete when it exists in inbox.:

```js
import { removeFromInbox } from "furaffinity-api";

removeFromInbox(['viewId', 'viewId']);
```

### watchAuthor()

**Login first**
Watch author if haven't watched, no effact when watch yourself:

```js
import { watchAuthor } from "furaffinity-api";

watchAuthor('userId');
```

### unwatchAuthor()

**Login first**
Unwatch author if already watched, no effact when unwatch yourself:

```js
import { unwatchAuthor } from "furaffinity-api";

unwatchAuthor('userId');
```


### toggleWatch()

**Login first**
Request the watch link, link can be found from IAuthor, toggle watching state:

```js
import { toggleWatch } from "furaffinity-api";

toggleWatch('https://www.furaffinity.net/watch/userid/?key=033d7e8f2860f80850557df7ed99120ac9f926e3');
```

## Test

Please improve the test configuration `/tests/jest.config.ts` before testing.

```js
export const options: ITestConfig = {
  loginOptions: {
    cookieA: "your cookie a", // your cookies
    cookieB: "your cookie b"
  },
  watchOptions: {
    userId: "your userid",
    shouldContainUserId: "userid you are watching"
  },
  authorOptions: {
    userId: "your favorite author's userid"
  }
};
```

Then run:

```bash
npm run test
```

## Special Thanks

- [insert/furaffinity](https://gitlab.insrt.uk/insert/furaffinity): furaffinity-api is based on this project.

## License

ISC
