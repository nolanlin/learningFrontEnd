// 需求：把所有异步函数包裹一层try..catch..
// 待debug!!
const pluginName = "AutoTryCatch";
const fs = require("fs");
const path = require("path");
const parse = require("@babel/parser").parse; // 解析AST
const traverse = require("@babel/traverse").default; // 遍历AST
const generator = require("@babel/generator").default; // 生成代码
const template = require("@babel/template").default; // 简化生成代码过程，除非对抽象语法树结构非常熟悉可以不用
const t = require("@babel/types");

class AutoTryCatch {
  constructor(options) {
    this.options = options || { dir: ["src"], pattern: [".js"] };
    this.pattern = this.options.pattern;
  }
  // plugin必备apply方法
  apply(compiler) {
    // 考虑，哪个阶段做？同步还是异步？编译之前还是编译之后？
    compiler.hooks.done.tap(pluginName, () => {
      // 遍历目录，读相应类型的文件
      this.options.dir.forEach((item) => {
        // fs读取都是绝对路径
        const path1 = path.resolve(item);
        fs.readdir(path1, (err, files) => {
          if (!err) {
            // 假设都是文件，非目录
            files.forEach((filename) => {
              const absPath = path.resolve(item, filename); // 取文件路径
              const extname = path.extname(filename); // 取后缀
              if (this.pattern.includes(extname)) {
                // 把文件的代码提取出抽象语法树
                const ast = this.getAst(absPath);
                // webpack提供的遍历抽象语法树的方法
                this.handleTraverse(ast, absPath);
              }
            });
          }
        });
      });
    });
  }
  getAst(filename) {
    const content = fs.readFileSync(filename, "utf-8");
    try {
      // babel提供的parse模块，基于字符串解析出抽象语法树
      return parse(content, {
        sourceType: "module",
      });
    } catch (e) {
      console.error(e);
      return null;
    }
  }
  handleTraverse(ast, filepath) {
    // 处理目标是异步函数
    let isChanged = false; // 命中改为true
    const shouldHandleAst = (path) => {
      const types = path.node.body.body.map(({ type }) => type);
      isChanged =
        (path.node.body.body.length > 1 && types.includes("TryStatement")) ||
        (path.node.body.body.length && !types.includes("TryStatement")); // 作为命中依据，持续完善
    };
    traverse(ast, {
      // 函数声明
      FunctionDeclaration: shouldHandleAst,
      // 函数表达式
      FunctionExpression: shouldHandleAst,
      // 箭头函数
      ArrowFunctionExpression: shouldHandleAst,
    });
    if (isChanged) {
      // 处理AST
      this.handleAst(ast, filepath);
    }
  }

  handleAst(ast, filepath) {
    const _this = this;
    traverse(ast, {
      BlockStatement(path) {
        if (
          [
            "FunctionDeclaration",
            "FunctionExpression",
            "ArrowFunctionExpression",
          ].includes(path.parentPath.type) &&
          path.node.body[0].type !== "TryStatement" &&
          path.parentPath.async
        ) {
          // 生成代码
          const tryStatement = _this.generateTryStatement(path.node);
          // 替换
          const blockStatement = t.blockStatement([tryStatement]);
          path.replaceWith(blockStatement);
        }
      },
      // 退出时写到文件里
      Program: {
        exit() {
          _this.writeFileSync(ast, filePath);
        },
      },
    });
  }
  generateTryStatement({ body = [] }) {
    const nodeBody = t.blockStatement(body);
    // 用generator把ast生成代码，再把代码放到template模板直接生成新的代码
    return template.ast(`try
    ${generator(nodeBody)}
    catch(err){
      console.log(err);
    }
    `);
  }
  writeFileSync(ast, filePath) {
    const output = generator(ast, {
      quote: "single",
      concise: false, //  缩进空格等
      compact: false,
      retainLines: false,
    });

    fs.writeFileSync(filePath, output.code);
  }
}

module.exports = AutoTryCatch;
