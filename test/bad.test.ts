import { check, HintError } from '../src';
import * as Path from 'path';
import { readFileSync, readdirSync } from 'fs';

describe('check', () => {
  it('invalid root object', () => {
    expect(() => check(JSON.stringify([]))).toThrow(HintError);
    expect(() => check(JSON.stringify({}))).toThrow(HintError);
    expect(() => check(JSON.stringify({ type: ['foo'] }))).toThrow(HintError);
    expect(() => check(JSON.stringify({ type: 'foo' }))).toThrow(HintError);
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
        code: 'invalid_json',
        line: 3,
      });
    }
  });

  describe('works with fixtures', () => {
    const fixtureNames = readdirSync(Path.join(__dirname, './fixture/bad/'));
    for (let name of fixtureNames) {
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
