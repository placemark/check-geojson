import { scavenge } from '../src';

describe('scavenge', () => {
  it('partially correct fc', () => {
    expect(
      scavenge(
        JSON.stringify({
          type: 'FeatureCollection',

          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [0, 0],
              },
              properties: {},
            },
            {
              type: 'bad',
            },
          ],
        })
      )
    ).toEqual({
      result: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [0, 0],
            },
            properties: {},
          },
        ],
      },
      rejected: [
        {
          feature: {
            type: 'bad',
          },
          reasons: [
            {
              from: 123,
              message: 'This type of GeoJSON object is not allowed here.',
              severity: 'error',
              to: 137,
            },
            {
              from: 123,
              message:
                'This GeoJSON object requires a geometry member but it is missing.',
              severity: 'error',
              to: 137,
            },
            {
              from: 123,
              message:
                'This GeoJSON object requires a properties member but it is missing.',
              severity: 'error',
              to: 137,
            },
            {
              from: 123,
              message: 'The properties member is missing.',
              severity: 'error',
              to: 137,
            },
          ],
        },
      ],
    });
  });
});
