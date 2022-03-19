import { Node } from '@humanwhocodes/momoa';
import { makeIssue } from './errors';
import { Ctx } from './types';

export function arrayIsNumbers(ctx: Ctx, elements: Node[], name: string) {
  for (const element of elements) {
    if (element.type !== 'Number') {
      ctx.issues.push(
        makeIssue(`Each element in a ${name} must be a number.`, element)
      );
      return;
    }
  }
}
