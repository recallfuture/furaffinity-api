## CHANGELOG


### 4.5.1

- Fix checkSystemMessage

### 4.5.0

- Watch and unwatch artists (#17)

### 4.4.3

### Fix

- FA Website redesign (#16)

### 4.4.2

### Fix

- Function Author not parsing correctly(#15)

### 4.4.1

### Fix

- Rating in SearchOption doesn't work (#14)

### Change

- add `perpage` to SearchOptions

### 4.4.0

### Fix

- Rename SearchOption `range_from` `range_to` to `rangeFrom` `rangeTo` 
- Fix date format to ISO string
- Replae cloudscraper with hooman ([#12](https://github.com/recallfuture/furaffinity-api/pull/12))

Cloudscraper is NO LONGER SUPPORTED AND IS DEPRECATED, so we need a new library, like hooman.

Now, furaffinity-api use hooman(got) to make request, and use local instance, not modify global default config.

### API change:

- `setProxy(config?: false | string)` to `setProxy(url?: string)`
- New logout api

### 4.3.3

### Fix

- Fix Search [#10](https://github.com/recallfuture/furaffinity-api/issues/10)

### Change

- Remove option "prev" from SearchOptions
- Add full SearchOptions

```js
export interface SearchOptions {
  /** start at 1 */
  page?: number;
  rating?: Rating;
  type?: SearchType;

  // new options
  /** default 'relevancy' */
  orderBy?: OrderBy;
  /** default 'desc' */
  orderDirection?: OrderDirection;
  /** default 'all' */
  range?: RangeType;
  range_from?: Date;
  range_to?: Date;
  /** default extended */
  matchMode?: MatchMode;
}
```

### 4.3.1

### Fix

- Fix dependency [#9](https://github.com/recallfuture/furaffinity-api/issues/9)

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
