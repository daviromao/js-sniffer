import TestSmell from "../TestSmell";
import traverse, { NodePath } from "@babel/traverse";
import { types as t } from "@babel/core";

class RedundantPrint extends TestSmell {
  public name = "Redundant Print";
  run(ast: NodePath<t.CallExpression>): boolean {
    const visitor = new this.ClassVisitor();
    return visitor.visitAST(ast);
  }

  protected ClassVisitor = class PrintVisitor {
    hasSmell: boolean;

    constructor() {
      this.hasSmell = false;
    }

    private visitPrintMethods = (path: NodePath<t.CallExpression>) => {
      const printMethods = ["log", "error", "warn", "info"]; // Métodos do console
      if (
        path.node.callee.type === "MemberExpression" &&
        path.node.callee.object.type === "Identifier" &&
        path.node.callee.object.name === "console" &&
        printMethods.includes((path.node.callee.property as any).name)
      ) {
        this.hasSmell = true;
      }
    };

    visitAST(ast: NodePath<t.CallExpression>) {
      ast.traverse({
        CallExpression: this.visitPrintMethods,
      });
      return this.hasSmell;
    }
  };
}

export default RedundantPrint;
