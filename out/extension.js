"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const CreateCssClass_1 = require("./CreateCssClass");
function activate(context) {
    console.log('Congratulations, your extension "css-class-creator" is now active!');
    context.subscriptions.push(vscode.commands.registerCommand('css-class-creator.create-css-class', CreateCssClass_1.createCssClass));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map