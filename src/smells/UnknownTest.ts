import TestSmell from "../TestSmell";
import traverse, { NodePath } from "@babel/traverse";
import { types as t } from "@babel/core";

class UnknownTest extends TestSmell {
  run(ast: NodePath<t.CallExpression>): void {
    const visitor = new this.ClassVisitor();
    if (visitor.visitAST(ast)) console.log("Has UnknownTest smell");
  }

  protected ClassVisitor = class TestVisitor {
    hasSmell: boolean;

    constructor() {
      this.hasSmell = true;
    }

    private visitCallExpression = (path: NodePath<t.CallExpression>) => {
      if (
        path.node.callee.type === "Identifier" &&
        path.node.callee.name === "expect"
      ) {
        this.hasSmell = false;
      }
    };

    visitAST(ast: NodePath<t.CallExpression>) {
      ast.traverse({
        CallExpression: this.visitCallExpression,
      });
      return this.hasSmell;
    }
  };
}

export default UnknownTest;
