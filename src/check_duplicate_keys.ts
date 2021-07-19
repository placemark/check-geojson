import { HintIssue, makeIssue } from './errors';
import { ObjectNode } from '@humanwhocodes/momoa';

export function checkDuplicateKeys(
  issues: HintIssue[],
  parent: ObjectNode
): ObjectNode {
  let keys = new Set<string>();
  for (let node of parent.members) {
    const {
      name: { value },
    } = node;
    if (keys.has(value)) {
      issues.push(
        makeIssue('Duplicate properties are ambiguous in GeoJSON', node)
      );
    }
    keys.add(value);
  }
  return parent;
}
