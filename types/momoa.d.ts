declare module '@humanwhocodes/momoa' {
  interface AST {}

  type ParseOptions = {
    ranges?: boolean;
    comments?: boolean;
    tokens?: boolean;
  };

  type Node = {
    type: string;
  };

  type Phase = 'enter' | 'exit';

  interface IteratorState {
    node: Node;
    parent: Node;
    phase: Phase;
  }

  export function parse(jsonStr: string, options?: ParseOptions): AST;
  export function iterator(ast: AST): Generator<IteratorState>;
}
