# check-geojson

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
