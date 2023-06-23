import * as vscode from 'vscode';
import { createCssClass } from './CreateCssClass';

export function activate(context: vscode.ExtensionContext) {
    console.log(
        'Congratulations, your extension "css-class-creator" is now active!'
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(
            'css-class-creator.create-css-class',
            createCssClass
        )
    );
}

export function deactivate() {}
