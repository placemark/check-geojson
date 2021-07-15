# check-geojson

_check-geojson development is supported by 🌎 [placemark.io](https://placemark.io/)_

geojsonhint for 2021.

I started working on geojsonhint in 2014. It's a pretty useful project.
But it has been stagnant for a long time now, and has some annoying long-term
issues.

check-geojson is intended to be a full successor for geojsonhint. Like geojsonhint,
it is tailored to a particular usecase: writing GeoJSON by hand, or quickly sussing
out issues in GeoJSON that you've received.

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

### Usage

_Not finalized yet_

```ts
import { check } from "check-geojson"

try {
  const parseValue = check('… geojson string …')
} catch (e) {
  /// e.issues
}
```

---

[![Maintainability](https://api.codeclimate.com/v1/badges/0a1d1c0755b9e67406f1/maintainability)](https://codeclimate.com/repos/60a64f6aa449b13bc40002bd/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/0a1d1c0755b9e67406f1/test_coverage)](https://codeclimate.com/repos/60a64f6aa449b13bc40002bd/test_coverage)
