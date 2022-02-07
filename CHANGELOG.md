## CHANGELOG

### 4.3.0

### Change

- Add function removeFromInbox [#8](https://github.com/recallfuture/furaffinity-api/issues/8)

### 4.2.0

### Change

- Type Submission add description [#7](https://github.com/recallfuture/furaffinity-api/issues/7)

### 4.1.0

### Fixes

- SearchOption, SearchType doesn't work
- Gallery and Submission crash when guest mode

### Change

- rename all api to lower-case
- rename all interface with prefix "I"

close [#5](https://github.com/recallfuture/furaffinity-api/issues/5), close [#6](https://github.com/recallfuture/furaffinity-api/issues/6);

### 4.0.1

- Fix Submissions parse error

### 4.0.0

- Use PagingResults instead of Result[]
- No more null are returned, you can use try catch by yourself
- Can fetch more author info such "stats"
- Browser, Gallery, Scraps now support option "perpage"
- new "Submissions" function

### 3.5.1

- Use "Connection: Keep-Alive" to improve speed.
- Fix SearchOptions and BrowserOptions doesn't work. close [#3](https://github.com/recallfuture/furaffinity-api/issues/3)

### v3.5.0

- use cloudscraper to solves Cloudflare's challenge.
