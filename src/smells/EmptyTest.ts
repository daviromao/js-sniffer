import TestSmell from "../TestSmell";
import traverse, { NodePath } from "@babel/traverse";
import { types as t } from "@babel/core";
import * as parser from "@babel/parser";

class EmptyTest extends TestSmell {
  run(ast: NodePath<t.CallExpression>): void {
    const visitor = new this.ClassVisitor();
    if (visitor.visitAST(ast)) console.log("Has EmptyTest smell");
  }

  protected ClassVisitor = class TestVisitor {
    hasSmell: boolean;

    constructor() {
      this.hasSmell = true;
    }

    private visitBlockStatement = (path: NodePath<t.BlockStatement>) => {
      if (path.node.body.length > 0) {
        this.hasSmell = false;
      }
    };

    visitAST(ast: NodePath<t.CallExpression>) {
      ast.traverse({
        BlockStatement: this.visitBlockStatement,
      });

      return this.hasSmell;
    }
  };
}

export default EmptyTest;
