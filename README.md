# check-geojson

A spiritual successor to [geojsonhint](https://github.com/mapbox/geojsonhint), which is no longer maintained.

check-geojson is a parser and validator for GeoJSON strings. It is tailored to the use cases of validating user-generated GeoJSON content, or troubleshooting GeoJSON that you've received.

_Note: the API is not yet stable._

## [📕 API Documentation](http://check-geojson.docs.placemark.io/)

### Main differences from geojsonhint

- Actively maintained
- Written in TypeScript and includes types
- Uses [momoa](https://github.com/humanwhocodes/momoa) to parse JSON instead of a homemade
  parser. This is probably the biggest one. jsonlint-lines was a hack, which I created
  because I could not find a single parser that actually parsed JSON and gave line numbers
  for values. momoa is much better than that hack, and using it makes line-level errors
  much cleaner.

Unlike geojsonhint, this checker _only_ produces errors, not warnings. So things
that geojsonhint would warn about, like:

- excessive coordinate precision
- right-hand rule compliance

This does not check for. Additionally, the `crs` member is ignored by this tool: as of
the latest GeoJSON specification, this is [not used](https://datatracker.ietf.org/doc/html/rfc7946#appendix-B.1).

We're using the same test fixtures as geojsonhint as a starter.

### Install

```shell
pnpm add @placemarkio/check-geojson
yarn add @placemarkio/check-geojson
```

### Usage

```ts
import { check } from "@placemarkio/check-geojson"

let geojsonObject;
try {
  geojsonObject = check('… geojson string …')
} catch (e) {
  /// e.issues
}
```

If your GeoJSON is already an object, you will need to convert it to a string first. geojson-check will re-parse it. You should consider the performance penalty of this.

```ts
const issues = getIssues(JSON.stringify(geojsonObject));
if (issues.length > 0) {
  // ...
}
```

---

[![Maintainability](https://api.codeclimate.com/v1/badges/0a1d1c0755b9e67406f1/maintainability)](https://codeclimate.com/repos/60a64f6aa449b13bc40002bd/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/0a1d1c0755b9e67406f1/test_coverage)](https://codeclimate.com/repos/60a64f6aa449b13bc40002bd/test_coverage)
