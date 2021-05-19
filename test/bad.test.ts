import { check, HintError } from '../src';
// import { readFileSync, readdirSync } from 'fs';

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

  it('forbidden properties', () => {
    expect(() =>
      check(
        JSON.stringify({ type: 'Point', coordinates: [1, 2], properties: {} })
      )
    ).toThrow(HintError);
  });
});
