import { LocRange } from '@humanwhocodes/momoa';

type HintIssueBase = {
  loc: LocRange;
  // code: ZodIssueCode;
  message?: string;
};

interface HintIssueRootType extends HintIssueBase {
  code: 'invalid_root';
}

interface HintIssueType extends HintIssueBase {
  code: 'invalid_type';
}

export type HintIssue = HintIssueRootType | HintIssueType;

export class HintError extends Error {
  issues: HintIssue[] = [];

  constructor(issues: HintIssue[]) {
    super();
    // restore prototype chain
    const actualProto = new.target.prototype;
    Object.setPrototypeOf(this, actualProto);
    this.issues = issues;
  }
}
