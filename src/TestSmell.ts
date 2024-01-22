import { types as t } from "@babel/core";
import type { Scope, NodePath } from "@babel/traverse";

interface TestVisitor {
  hasSmell: boolean;
  visitAST(ast: NodePath<t.CallExpression>): Boolean;
}

abstract class TestSmell {
  abstract run(ast: NodePath<t.CallExpression>): void;
  protected abstract ClassVisitor: new () => TestVisitor;
}

export default TestSmell;
