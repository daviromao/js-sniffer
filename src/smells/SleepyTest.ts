import TestSmell from "../TestSmell";
import traverse, { NodePath } from "@babel/traverse";
import { types as t } from "@babel/core";

class SleepyTest extends TestSmell {
  public name: string = "Sleepy Test";
  run(ast: NodePath<t.CallExpression>): boolean {
    const visitor = new this.ClassVisitor();
    return visitor.visitAST(ast);
  }

  protected ClassVisitor = class SleepyTestVisitor {
    hasSmell: boolean;

    constructor() {
      this.hasSmell = false;
    }

    private visitSleepMethod = (path: NodePath<t.AwaitExpression>) => {
      const sleepyMethods = ["setTimeout", "setInterval"];

      if (
        path.node.argument.type === "CallExpression" &&
        path.node.argument.callee.type === "Identifier" &&
        sleepyMethods.includes(path.node.argument.callee.name)
      ) {
        this.hasSmell = true;
      }
    };

    visitAST(ast: NodePath<t.CallExpression>) {
      ast.traverse({
        AwaitExpression: this.visitSleepMethod,
      });
      return this.hasSmell;
    }
  };
}

export default SleepyTest;
