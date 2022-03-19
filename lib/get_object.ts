import { makeIssue } from './errors';
import { Node, ObjectNode } from '@humanwhocodes/momoa';
import { Ctx } from './types';

export function getObject(ctx: Ctx, node: Node | null): ObjectNode | null {
  if (node?.type === 'Object') return node;
  if (node) {
    ctx.issues.push(makeIssue('This must be an object.', node));
  }
  return null;
}
