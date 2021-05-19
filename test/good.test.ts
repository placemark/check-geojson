import { check } from '../src';
// import { readFileSync, readdirSync } from 'fs';

describe('check', () => {
  it('works', () => {
    const obj = {
      type: 'Point',
      coordinates: true,
    };
    expect(check(JSON.stringify(obj))).toEqual(obj);
  });
});
