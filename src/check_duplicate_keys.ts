import { HintIssue } from './errors';
import { ObjectNode } from '@humanwhocodes/momoa';

export function checkDuplicateKeys(
  issues: HintIssue[],
  node: ObjectNode
): ObjectNode {
  let keys = new Set<string>();
  for (let {
    name: { value },
    loc,
  } of node.members) {
    if (keys.has(value)) {
      issues.push({
        code: 'invalid_type',
        message: 'Duplicate properties are ambiguous in GeoJSON',
        loc: loc,
      });
    }
    keys.add(value);
  }
  return node;
}
