declare module '@humanwhocodes/momoa' {
  import { JSONValue } from 'type-fest';

  type ParseOptions = {
    ranges?: boolean;
    comments?: boolean;
    tokens?: boolean;
  };

  export type Loc = {
    line: number;
    column: number;
    offset: number;
  };

  export type LocRange = {
    start: Loc;
    end: Loc;
  };

  export type Range = [number, number];

  interface BaseNode {
    loc: LocRange;
    range: {
      range: Range;
    };
  }

  export interface DocumentNode extends BaseNode {
    type: 'Document';
    body: Node;
  }

  export interface BooleanNode extends BaseNode {
    type: 'Boolean';
    value: boolean;
  }

  export interface NumberNode extends BaseNode {
    type: 'Number';
    value: number;
  }

  export interface NullNode extends BaseNode {
    type: 'Null';
    value: null;
  }

  export interface StringNode extends BaseNode {
    type: 'String';
    value: string;
  }

  export interface ObjectNode extends BaseNode {
    type: 'Object';
    name: StringNode;
    members: MemberNode[];
  }

  export interface ArrayNode extends BaseNode {
    type: 'Array';
    elements: Node[];
  }

  export interface MemberNode extends BaseNode {
    type: 'Member';
    name: StringNode;
    value: Node;
  }

  type Node =
    | MemberNode
    | ObjectNode
    | StringNode
    | NumberNode
    | DocumentNode
    | NullNode
    | ArrayNode;

  type Phase = 'enter' | 'exit';

  interface IteratorState {
    node: Node;
    parent: Node;
    phase: Phase;
  }

  export function parse(jsonStr: string, options?: ParseOptions): DocumentNode;
  export function iterator(ast: Node): Generator<IteratorState>;
  export function evaluate(ast: Node): JSONValue;
}
