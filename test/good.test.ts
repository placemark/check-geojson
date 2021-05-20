import { check } from '../src';
import * as Path from 'path';
import { readFileSync, readdirSync } from 'fs';

const examplePoint = {
  type: 'Point',
  coordinates: [0, 1],
};
const exampleFeature = {
  type: 'Feature',
  properties: {
    test: true,
  },
  geometry: examplePoint,
};
const exampleFeatureCollection = {
  type: 'FeatureCollection',
  features: [exampleFeature],
};
describe('check', () => {
  it('works with fixed examples', () => {
    const examples = [
      examplePoint,
      exampleFeature,
      exampleFeatureCollection,
      {
        type: 'Polygon',
        coordinates: [
          [
            [100.0, 0.0],
            [101.0, 0.0],
            [101.0, 1.0],
            [100.0, 1.0],
            [100.0, 0.0],
          ],
          [
            [100.8, 0.8],
            [100.8, 0.2],
            [100.2, 0.2],
            [100.2, 0.8],
            [100.8, 0.8],
          ],
        ],
      },
      {
        type: 'MultiPoint',
        coordinates: [
          [100.0, 0.0],
          [101.0, 1.0],
        ],
      },
      {
        type: 'MultiLineString',
        coordinates: [
          [
            [100.0, 0.0],
            [101.0, 1.0],
          ],
          [
            [102.0, 2.0],
            [103.0, 3.0],
          ],
        ],
      },
      {
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [102.0, 2.0],
              [103.0, 2.0],
              [103.0, 3.0],
              [102.0, 3.0],
              [102.0, 2.0],
            ],
          ],
          [
            [
              [100.0, 0.0],
              [101.0, 0.0],
              [101.0, 1.0],
              [100.0, 1.0],
              [100.0, 0.0],
            ],
            [
              [100.2, 0.2],
              [100.2, 0.8],
              [100.8, 0.8],
              [100.8, 0.2],
              [100.2, 0.2],
            ],
          ],
        ],
      },
      {
        type: 'GeometryCollection',
        geometries: [
          {
            type: 'Point',
            coordinates: [100.0, 0.0],
          },
          {
            type: 'LineString',
            coordinates: [
              [101.0, 0.0],
              [102.0, 1.0],
            ],
          },
        ],
      },
    ];
    for (let obj of examples) {
      check(JSON.stringify(obj));
      expect(check(JSON.stringify(obj))).toEqual(obj);
    }
  });
  describe('works with fixtures', () => {
    const fixtureNames = readdirSync(Path.join(__dirname, './fixture/good/'));
    for (let name of fixtureNames) {
      it(`fixture: ${name}`, () => {
        const input = readFileSync(
          Path.join(__dirname, './fixture/good/', name),
          'utf8'
        );
        expect(check(input)).toEqual(JSON.parse(input));
      });
    }
  });
});
