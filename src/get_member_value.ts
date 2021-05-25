import { HintIssue } from './errors';
import { ObjectNode } from '@humanwhocodes/momoa';

export function getMemberValue(
  issues: HintIssue[],
  node: ObjectNode,
  name: string
) {
  const member = node.members.find(member => {
    return member.name.value === name;
  });

  if (!member) {
    issues.push({
      code: 'invalid_type',
      message: `This GeoJSON object requires a ${name} member but it is missing.`,
      loc: node.loc,
    });

    return null;
  }

  return member.value;
}
