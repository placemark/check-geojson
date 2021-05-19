import { parse, iterator } from '@humanwhocodes/momoa';

export const check = (jsonStr: string) => {
  const ast = parse(jsonStr, {
    ranges: true,
  });

  for (const { node, phase, parent } of iterator(ast)) {
    console.log(node);
    console.log(phase);
    console.log(parent);
  }

  return [];
};
