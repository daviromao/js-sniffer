import TestSmell from "../TestSmell";
import traverse, { NodePath } from "@babel/traverse";
import { types as t } from "@babel/core";

class MagicNumberTest extends TestSmell {
  run(ast: NodePath<t.CallExpression>): void {
    const visitor = new this.ClassVisitor();
    if (visitor.visitAST(ast)) console.log("Has MagicNumberTest smell");
  }

  protected ClassVisitor = class TestVisitor {
    hasSmell: boolean;

    constructor() {
      this.hasSmell = false;
    }

    private visitNumericLiteral = (path: NodePath<t.Node>) => {
      while (path.parentPath && !path.isVariableDeclarator()) {
        path = path.parentPath;
      }

      if (path && !path.isVariableDeclarator()) {
        this.hasSmell = true;
      }
    };

    visitAST(ast: NodePath<t.CallExpression>) {
      ast.traverse({
        NumericLiteral: this.visitNumericLiteral,
      });

      return this.hasSmell;
    }
  };
}

export default MagicNumberTest;
