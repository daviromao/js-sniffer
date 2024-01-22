import TestSmell from "../TestSmell";
import traverse, { NodePath } from "@babel/traverse";
import { types as t } from "@babel/core";

class ConditionalTestLogic extends TestSmell {
  public run(ast: NodePath<t.CallExpression>) {
    const visitor = new this.ClassVisitor();
    if (visitor.visitAST(ast)) console.log("Has ConditionalTestLogic smell");
  }

  protected ClassVisitor = class TestVisitor {
    hasSmell: boolean;

    constructor() {
      this.hasSmell = false;
    }

    private visitIfStatement = (_path: NodePath<t.IfStatement>) => {
      this.hasSmell = true;
    };

    private visitConditional = (_path: NodePath<t.Conditional>) => {
      this.hasSmell = true;
    };

    private visitSwitchStatement = (_path: NodePath<t.SwitchStatement>) => {
      this.hasSmell = true;
    };

    private visitConditionalExpression = (
      _path: NodePath<t.ConditionalExpression>
    ) => {
      this.hasSmell = true;
    };

    private visitForInStatement = (_path: NodePath<t.ForInStatement>) => {
      this.hasSmell = true;
    };

    private visitForOfStatement = (_path: NodePath<t.ForOfStatement>) => {
      this.hasSmell = true;
    };

    private visitWhileStatement = (_path: NodePath<t.WhileStatement>) => {
      this.hasSmell = true;
    };

    private visitDoWhileStatement = (_path: NodePath<t.DoWhileStatement>) => {
      this.hasSmell = true;
    };

    visitAST(ast: NodePath<t.CallExpression>) {
      ast.traverse({
        IfStatement: this.visitIfStatement,
        Conditional: this.visitConditional,
        SwitchStatement: this.visitSwitchStatement,
        ConditionalExpression: this.visitConditionalExpression,
        ForInStatement: this.visitForInStatement,
        ForOfStatement: this.visitForOfStatement,
        WhileStatement: this.visitWhileStatement,
        DoWhileStatement: this.visitDoWhileStatement,
      });
      return this.hasSmell;
    }
  };
}

export default ConditionalTestLogic;
