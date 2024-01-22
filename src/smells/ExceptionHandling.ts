import TestSmell from "../TestSmell";
import traverse, { NodePath } from "@babel/traverse";
import { types as t } from "@babel/core";

class ExceptionHandling extends TestSmell {
  public run(ast: NodePath<t.CallExpression>) {
    const visitor = new this.ClassVisitor();
    if (visitor.visitAST(ast)) console.log("Has ExceptionHandling smell");
  }

  protected ClassVisitor = class TestVisitor {
    hasSmell: boolean;

    constructor() {
      this.hasSmell = false;
    }

    private visitTryStatement = (_path: NodePath<t.TryStatement>) => {
      this.hasSmell = true;
    };

    private visitCatchClause = (_path: NodePath<t.CatchClause>) => {
      this.hasSmell = true;
    };

    private visitIdentifierCatch = (path: NodePath<t.Identifier>) => {
      if (path.node.name === "catch" || path.node.name === "then") {
        this.hasSmell = true;
      }
    };

    visitAST(ast: NodePath<t.CallExpression>) {
      ast.traverse({
        TryStatement: this.visitTryStatement,
        CatchClause: this.visitCatchClause,
        Identifier: this.visitIdentifierCatch,
      });

      return this.hasSmell;
    }
  };
}

export default ExceptionHandling;
