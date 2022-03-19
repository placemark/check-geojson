import { makeIssue } from './errors';
import { Node, ArrayNode } from '@humanwhocodes/momoa';
import { Ctx } from './types';

export function getArray(ctx: Ctx, node: Node | null): ArrayNode | null {
  if (node?.type === 'Array') return node;
  if (node) {
    ctx.issues.push(makeIssue('This must be an array.', node));
  }
  return null;
}
