import TestSmell from "../TestSmell";
import traverse, { NodePath } from "@babel/traverse";
import { types as t } from "@babel/core";

class EmptyTest extends TestSmell {
  public name: string = "EmptyTest";

  run(ast: NodePath<t.CallExpression>) {
    const visitor = new this.ClassVisitor();
    return visitor.visitAST(ast);
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
