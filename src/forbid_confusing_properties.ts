import { HintIssue } from './errors';
import { ObjectNode, MemberNode } from '@humanwhocodes/momoa';

function forbidProperty(issues: HintIssue[], member: MemberNode, name: string) {
  if (member.name.value === name) {
    issues.push({
      code: 'invalid_type',
      message: 'Geometry objects cannot contain a `',
      loc: member.name.loc,
    });
  }
}

export function forbidConfusingProperties(
  issues: HintIssue[],
  node: ObjectNode
) {
  for (let member of node.members) {
    for (let property of ['properties', 'geometry', 'features']) {
      forbidProperty(issues, member, property);
    }
  }
}
