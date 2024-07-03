import TestSmell from "../TestSmell";
import traverse, { NodePath } from "@babel/traverse";
import { types as t } from "@babel/core";

class UnknownTest extends TestSmell {
  public name: string = "Unknown Test";
  run(ast: NodePath<t.CallExpression>): boolean {
    const visitor = new this.ClassVisitor();
    return visitor.visitAST(ast);
  }

  protected ClassVisitor = class TestVisitor {
    hasSmell: boolean;

    constructor() {
      this.hasSmell = true;
    }

    private visitCallExpression = (path: NodePath<t.Identifier>) => {
      if (path.node.name === "expect" || path.node.name === "assert") {
        this.hasSmell = false;
      }
    };

    visitAST(ast: NodePath<t.CallExpression>) {
      ast.traverse({
        Identifier: this.visitCallExpression,
      });
      return this.hasSmell;
    }
  };
}

export default UnknownTest;
