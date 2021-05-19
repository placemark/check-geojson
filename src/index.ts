import { parse, iterator, evaluate } from '@humanwhocodes/momoa';
import { GeoJSON } from 'geojson';

export const check = (jsonStr: string): GeoJSON => {
  const ast = parse(jsonStr, {
    ranges: true,
  });

  for (const { node, phase, parent } of iterator(ast)) {
    console.log(node);
    console.log(phase);
    console.log(parent);
  }

  return evaluate(ast);
};
