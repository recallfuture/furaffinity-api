# fa-node

** This Project is forked from [https://gitlab.insrt.uk/insert/furaffinity](https://gitlab.insrt.uk/insert/furaffinity) **

> FurAffinity wrapper for Node.js

## Usage

Login to furaffinity:

```javascript
import { Login } from "furaffinity-api";
// or
let { Login } = require("furaffinity-api");

// to allow all results to be accessible, add your cookies
Login("cookie_a", "cookie_b");
```

Searching for content:

```javascript
import { Search, Type } from 'furaffinity-api';

Search('search query', { /** SearchOptions */ type?, rating?, page? }).then(res => {
  // res is an array of Result(s)
  res[0].getSubmission().then(submission => {
    // submission is a Submission
  });
});
```

Looking up a specific submission:

```javascript
import { Submission } from "furaffinity-api";

Submission("1234567890").then(res => {
  // res is a Submission
});
```

Get information of a user:

```javascript
import { User } from "furaffinity-api";

User("username").then(res => {
  // res is a User
  res.getWatchingList().then(list => {
    // list is a string array, which contains username
  });
});
```
