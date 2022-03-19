import { Node } from '@humanwhocodes/momoa';
import { HintIssue } from './types';

export function makeIssue(message: string, node: Node): HintIssue {
  return {
    message,
    severity: 'error',
    // node,
    from: node.loc.start.offset,
    to: node.loc.end.offset,
  };
}

export class HintError extends Error {
  issues: HintIssue[] = [];

  constructor(issues: HintIssue[]) {
    super();
    // restore prototype chain
    const actualProto = new.target.prototype;
    Object.setPrototypeOf(this, actualProto);
    this.issues = issues;
  }

  get message() {
    return JSON.stringify(this.issues, null, 2);
  }
}
