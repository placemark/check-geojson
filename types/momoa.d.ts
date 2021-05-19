declare module '@humanwhocodes/momoa' {
  interface AST {}

  type ParseOptions = {
    ranges?: boolean;
    comments?: boolean;
    tokens?: boolean;
  };

  type Loc = {
    line: number;
    column: number;
    offset: number;
  };

  interface BaseNode {
    loc: {
      start: Loc;
      end: Loc;
    };
    range: {
      range: [number, number];
    };
  }

  interface DocumentNode extends BaseNode {
    type: 'Document';
    body: Node;
  }

  interface BooleanNode extends BaseNode {
    type: 'Boolean';
    value: boolean;
  }

  interface NumberNode extends BaseNode {
    type: 'Number';
    value: number;
  }

  interface NullNode extends BaseNode {
    type: 'Null';
    value: null;
  }

  interface StringNode extends BaseNode {
    type: 'String';
    value: string;
  }

  interface ObjectNode extends BaseNode {
    type: 'Object';
    name: StringNode;
    members: MemberNode[];
  }

  interface ArrayNode extends BaseNode {
    type: 'Array';
    elements: Node[];
  }

  interface MemberNode extends BaseNode {
    type: 'Member';
    name: StringNode;
    value: Node;
  }

  type Node =
    | MemberNode
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

  export function parse(jsonStr: string, options?: ParseOptions): AST;
  export function iterator(ast: AST): Generator<IteratorState>;
}
