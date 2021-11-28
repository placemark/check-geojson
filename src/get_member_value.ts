import { makeIssue } from './errors';
import { ObjectNode } from '@humanwhocodes/momoa';
import { Ctx } from './types';

export function getMemberValue(ctx: Ctx, node: ObjectNode, name: string) {
  const member = node.members.find((member) => {
    return member.name.value === name;
  });

  if (!member) {
    ctx.issues.push(
      makeIssue(
        `This GeoJSON object requires a ${name} member but it is missing.`,
        node
      )
    );

    return null;
  }

  return member.value;
}
