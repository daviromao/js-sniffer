import * as fs from "fs";
import * as path from "path";
import * as parser from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import TestSmell from "./TestSmell";
import { types as t } from "@babel/core";

class SnifferDetector {
  smells: TestSmell[];
  statistics: Map<string, number>;
  tests_with_smell: Set<string>;

  constructor(smells: TestSmell[]) {
    this.smells = smells;
    this.statistics = new Map();
    this.tests_with_smell = new Set();
    for (const smell of this.smells) {
      this.statistics.set(smell.name, 0);
    }
  }

  sniff(): void {
    const testFiles = this.findTestFiles(process.cwd());
    testFiles.forEach((file) => {
      const fileContent = fs.readFileSync(file, "utf-8");
      const ast = parser.parse(fileContent, { sourceFilename: file });
      this.detectTestSmells(ast);
    });

    console.log("Statistics:");
    for (const [key, value] of this.statistics) {
      console.log(key, ":", value);
    }

    console.log("\nTests with smells:");
    for (const test of this.tests_with_smell) {
      console.log(test);
    }
  }

  detectTestSmells(ast: t.Node): void {
    traverse(ast, {
      CallExpression: (path: NodePath<t.CallExpression>) => {
        if (
          path.node.callee.type === "Identifier" &&
          (path.node.callee.name === "test" || path.node.callee.name === "it")
        ) {
          const findedTests = [];

          for (const smell of this.smells) {
            if (smell.run(path)) {
              this.statistics.set(
                smell.name,
                (this.statistics.get(smell.name) ?? 0) + 1
              );
              findedTests.push(smell.name);
            }
          }
          if (findedTests.length > 0) {
            this.tests_with_smell.add(
              (path.node.arguments[0] as t.StringLiteral).value
            );
            console.log(
              "Test: ",
              (path.node.arguments[0] as t.StringLiteral).value
            );
            for (const smell of findedTests) {
              console.log("Has ", smell);
            }
            console.log("\n======================================\n");
          }
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
