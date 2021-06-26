import { LocRange } from '@humanwhocodes/momoa';

type HintIssueBase = {
  loc: LocRange;
  // code: ZodIssueCode;
  message?: string;
};

interface HintIssueType extends HintIssueBase {
  code: 'invalid_type';
}

interface HintJSONIssue {
  code: 'invalid_json';
  line: number;
}

export type HintIssue = HintIssueType | HintJSONIssue;

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
