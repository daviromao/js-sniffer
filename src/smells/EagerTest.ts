import TestSmell from "../TestSmell";
import traverse, { NodePath } from "@babel/traverse";
import { types as t } from "@babel/core";

class EagerTest extends TestSmell {
  public name = "Eager Test";
  run(ast: NodePath<t.CallExpression>) {
    const visitor = new this.ClassVisitor();
    return visitor.visitAST(ast);
  }

  protected ClassVisitor = class EagerTestVisitor {
    hasSmell: boolean;

    private productionMethods: Map<string, number>;

    constructor() {
      this.hasSmell = false;
      this.productionMethods = new Map();
    }

    private visitProductionMethods = (path: NodePath<t.CallExpression>) => {
      if (
        path.node.callee.type === "MemberExpression" &&
        path.node.callee.property.type === "Identifier" &&
        path.node.callee.object.type === "Identifier"
      ) {
        const methodName = path.node.callee.object.name;
        this.productionMethods.set(
          methodName,
          (this.productionMethods.get(methodName) ?? 0) + 1
        );
      }
    };

    visitAST(ast: NodePath<t.CallExpression>) {
      ast.traverse({
        CallExpression: this.visitProductionMethods,
      });

      const methods = Array.from(this.productionMethods.values());
      const max = Math.max(...methods);
      if (max > 1 || methods.length > 1) this.hasSmell = true;

      return this.hasSmell;
    }
  };
}

export default EagerTest;
