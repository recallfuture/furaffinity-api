# fa-node

** This Project is forked from [https://gitlab.insrt.uk/insert/furaffinity](https://gitlab.insrt.uk/insert/furaffinity) **

> FurAffinity wrapper for Node.js

This project can only be used with Furaffinity's **Modern** style.

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

Get information of an author:

```javascript
import { Author, WatchingList } from "furaffinity-api";

Author("username").then(res => {
  // res is an Author
  // Author has id, name, url and avatar(maybe undefined)
  WatchingList(res.id).then(list => {
    // list is an Author array
  });
});
```
