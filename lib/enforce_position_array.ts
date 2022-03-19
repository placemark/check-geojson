import { makeIssue } from './errors';
import { enforcePosition } from './enforce_position';
import { enforceSamePosition } from './enforce_same_position';
import { Node, ArrayNode } from '@humanwhocodes/momoa';
import { Ctx } from './types';

function getArray(ctx: Ctx, node: Node): ArrayNode | null {
  if (node.type !== 'Array') {
    ctx.issues.push(
      makeIssue('Expected to find an array of positions here.', node)
    );
    return null;
  }
  return node;
}

type PositionKind = 'Polygon' | 'LineString';

export function enforcePositionArray(
  ctx: Ctx,
  node: Node | null,
  kind?: PositionKind
) {
  // This error has already been caught. Allow a no-op for simplicity.
  if (node === null) return;

  node = getArray(ctx, node);
  if (!node) return;

  for (const element of node.elements) {
    if (element.type !== 'Array') {
      ctx.issues.push(
        makeIssue(
          'Expected to find a position here, found another type.',
          element
        )
      );
      return;
    } else {
      enforcePosition(ctx, element);
    }
  }

  switch (kind) {
    case 'LineString': {
      if (node.elements.length < 2) {
        ctx.issues.push(
          makeIssue('Expected to find two or more positions here.', node)
        );
      }
      break;
    }
    case 'Polygon':
      if (node.elements.length < 4) {
        ctx.issues.push(
          makeIssue('Expected to find four or more positions here.', node)
        );
      }
      enforceSamePosition(ctx, node);
      break;
  }
}

export function enforcePositionArray2(
  ctx: Ctx,
  node: Node | null,
  kind?: PositionKind
) {
  // This error has already been caught. Allow a no-op for simplicity.
  if (node === null) return;

  node = getArray(ctx, node);
  if (!node) return;

  for (const element of node.elements) {
    enforcePositionArray(ctx, element, kind);
  }
}

export function enforcePositionArray3(
  ctx: Ctx,
  node: ArrayNode | null,
  kind?: PositionKind
) {
  // This error has already been caught. Allow a no-op for simplicity.
  if (node === null) return;

  node = getArray(ctx, node);
  if (!node) return;

  for (const element of node.elements) {
    enforcePositionArray2(ctx, element, kind);
  }
}
