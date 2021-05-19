import { check } from '../src';
// import { readFileSync, readdirSync } from 'fs';

describe('check', () => {
  it('works', () => {
    expect(
      check(
        JSON.stringify({
          type: 'Point',
          coordinates: true,
        })
      )
    ).toEqual([]);
  });
});
