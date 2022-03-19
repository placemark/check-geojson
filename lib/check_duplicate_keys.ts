import { makeIssue } from './errors';
import { ObjectNode } from '@humanwhocodes/momoa';
import { Ctx } from './types';

export function checkDuplicateKeys(ctx: Ctx, parent: ObjectNode): ObjectNode {
  const keys = new Set<string>();
  for (const node of parent.members) {
    const {
      name: { value },
    } = node;
    if (keys.has(value)) {
      ctx.issues.push(
        makeIssue('Duplicate properties are ambiguous in GeoJSON', node)
      );
    }
    keys.add(value);
  }
  return parent;
}
