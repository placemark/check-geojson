import { makeIssue } from './errors';
import { ArrayNode } from '@humanwhocodes/momoa';
import { arrayIsNumbers } from './array_is_numbers';
import { Ctx } from './types';

export function enforcePosition(ctx: Ctx, node: ArrayNode | null) {
  // This error has already been caught. Allow a no-op for simplicity.
  if (node === null) return;

  if (node.elements.length < 2 || node.elements.length > 3) {
    ctx.issues.push(
      makeIssue(
        `A position should have 2 or 3 elements - found ${node.elements.length}.`,
        node
      )
    );
  }

  arrayIsNumbers(ctx, node.elements, 'position');
}
