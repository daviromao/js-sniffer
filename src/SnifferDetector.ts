import * as fs from "fs";
import * as path from "path";
import * as parser from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import TestSmell from "./TestSmell";
import { types as t } from "@babel/core";

class SnifferDetector {
  smells: TestSmell[];

  constructor(smells: TestSmell[]) {
    this.smells = smells;
  }

  sniff(): void {
    const testFiles = this.findTestFiles(process.cwd());
    testFiles.forEach((file) => {
      const fileContent = fs.readFileSync(file, "utf-8");
      const ast = parser.parse(fileContent);
      this.detectTestSmells(ast);
    });
  }

  detectTestSmells(ast: t.Node): void {
    traverse(ast, {
      CallExpression: (path: NodePath<t.CallExpression>) => {
        if (
          path.node.callee.type === "Identifier" &&
          (path.node.callee.name === "test" || path.node.callee.name === "it")
        ) {
          console.log(
            "Test: ",
            (path.node.arguments[0] as t.StringLiteral).value
          );
          for (const smell of this.smells) {
            smell.run(path);
          }

          console.log("====================================\n");
        }
      },
    });
  }

  findTestFiles(dir: string): string[] {
    const testFiles: string[] = [];
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      if (file !== "node_modules") {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          testFiles.push(...this.findTestFiles(filePath));
        } else {
          if (file.match(/\.(test|spec)\.(js|ts)/)) {
            testFiles.push(filePath);
          }
        }
      }
    });

    return testFiles;
  }
}

export default SnifferDetector;
