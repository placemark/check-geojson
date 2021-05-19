import { parse, iterator } from '@humanwhocodes/momoa';

export const check = (jsonStr: string) => {
  const ast = parse(jsonStr, {
    ranges: true,
  });

  for (const { node, phase } of iterator(ast)) {
    console.log(node.type);
    console.log(phase);
  }

  return [];
};
