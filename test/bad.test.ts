import { check, getIssues, HintError } from '../lib';
import * as Path from 'path';
import { readFileSync, readdirSync } from 'fs';

describe('check', () => {
  it('invalid root object', () => {
    expect(() => check(JSON.stringify([]))).toThrow(HintError);
    expect(() => check(JSON.stringify({}))).toThrow(HintError);
    expect(() => check(JSON.stringify({ type: ['foo'] }))).toThrow(HintError);
    expect(() => check(JSON.stringify({ type: 'foo' }))).toThrow(HintError);
    expect(getIssues(JSON.stringify({}))).toEqual([
      {
        from: 0,
        message: 'This GeoJSON object is missing its type member.',
        severity: 'error',
        to: 2,
      },
    ]);
    expect(getIssues(JSON.stringify({ type: 'test' }))).toEqual([
      {
        from: 0,
        message: 'This type of GeoJSON object is not allowed here.',
        severity: 'error',
        to: 15,
      },
    ]);
  });

  it('invalid coordinates', () => {
    expect(() => check(JSON.stringify({ type: 'Point' }))).toThrow(HintError);
    expect(() =>
      check(JSON.stringify({ type: 'Point', coordinates: null }))
    ).toThrow(HintError);
  });

  it('bad points', () => {
    expect(() =>
      check(JSON.stringify({ type: 'Point', coordinates: [1] }))
    ).toThrow(HintError);
    expect(() =>
      check(JSON.stringify({ type: 'Point', coordinates: [1, 2, 3, 4] }))
    ).toThrow(HintError);
  });

  it('bad multipoints', () => {
    expect(() =>
      check(JSON.stringify({ type: 'MultiPoint', coordinates: [[true]] }))
    ).toThrow(HintError);
  });

  it('geometry collection with null', () => {
    expect(() =>
      check(JSON.stringify({ type: 'GeometryCollection', geometries: [null] }))
    ).toThrow(HintError);
  });

  it('forbidden properties', () => {
    expect(() =>
      check(
        JSON.stringify({ type: 'Point', coordinates: [1, 2], properties: {} })
      )
    ).toThrow(HintError);
  });

  it('bad json', () => {
    try {
      check(
        `{
    "type": "MultiPoint"
    "coordinates": [["foo", "bar"]]
}`
      );
    } catch (e) {
      expect(e.issues[0]).toEqual({
        message:
          'Invalid JSON: Unexpected token String("coordinates") found. (3:5)',
        from: 0,
        to: 0,
        severity: 'error',
      });
    }
  });

  describe('works with fixtures', () => {
    const fixtureNames = readdirSync(Path.join(__dirname, './fixture/bad/'));
    for (const name of fixtureNames) {
      it(`fixture: ${name}`, () => {
        const input = readFileSync(
          Path.join(__dirname, './fixture/bad/', name),
          'utf8'
        );
        expect(() => check(input)).toThrow(HintError);
      });
    }
  });
});
