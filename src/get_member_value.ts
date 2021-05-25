import { HintIssue } from './errors';
import { Node, ObjectNode } from '@humanwhocodes/momoa';

type MemberValueOptions = {
  optional: boolean;
  allowedTypes: Set<Node['type']> | null;
};

export function getMemberValue(
  issues: HintIssue[],
  node: ObjectNode,
  name: string,
  options: MemberValueOptions = {
    optional: false,
    allowedTypes: null,
  }
) {
  const member = node.members.find(member => {
    return member.name.value === name;
  });

  if (!member) {
    if (!options.optional) {
      issues.push({
        code: 'invalid_type',
        message: `This GeoJSON object requires a ${name} member but it is missing.`,
        loc: node.loc,
      });
    }

    return null;
  }

  if (
    options.allowedTypes !== null &&
    !options.allowedTypes.has(member.value.type)
  ) {
    issues.push({
      code: 'invalid_type',
      message: `This should be one of the types ${Array.from(
        options.allowedTypes
      ).join(', ')}`,
      loc: node.loc,
    });
  }

  return member.value;
}
