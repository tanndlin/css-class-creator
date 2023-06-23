import * as vscode from 'vscode';

export const createCssClass = (): boolean => {
    // Get the document
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return false;
    }

    // Get the selection
    const lineText = editor.document.lineAt(editor.selection.start.line).text;
    const selection = editor.selection;
    const text = editor.document.getText(selection);

    // Use regex to see if this is inside a "className" or "class" attribute
    if (!isClassName(lineText, text)) {
        console.log('nope');
        return false;
    }

    const config = vscode.workspace.getConfiguration('css-class-creator');
    const fileAssociations = config.get('fileAssociations.Target') as string[];
    const exlclude = config.get('excludeFolders') as string[];

    vscode.workspace
        .findFiles(
            `**/{${fileAssociations.join(',')}}`,
            `**/{${exlclude.join(',')}}`
        )
        .then((files) => handleGotFiles(text, files));

    return true;
};

const handleGotFiles = (className: string, files: vscode.Uri[]) => {
    console.log(files);

    // Make user select a file
    const quickpick = vscode.window.createQuickPick();
    quickpick.placeholder = 'Select a file';
    quickpick.items = files.map((file) => ({
        label: getFileName(file),
        detail: file.path,
    }));
    quickpick.onDidChangeSelection((selection) => {
        if (selection.length) {
            createCssClassInFile(
                className,
                vscode.Uri.file(selection[0].detail!)
            );
        }

        quickpick.hide();
    });

    quickpick.show();
};

const createCssClassInFile = (className: string, file: vscode.Uri) => {
    console.log(file);

    // Open the file
    vscode.window.showTextDocument(file).then((editor) => {
        // Write className at the bottom of the file
        const lastLine = editor.document.lineAt(editor.document.lineCount - 1);
        const position = new vscode.Position(
            editor.document.lineCount - 1,
            lastLine.text.length
        );
        editor
            .edit((editBuilder) => {
                editBuilder.insert(position, `\n\n.${className} {\n\n}`);
            })
            .then(() => {
                // Move the cursor inside the brackets
                const newPosition = new vscode.Position(
                    editor.document.lineCount - 2,
                    2
                );
                const newSelection = new vscode.Selection(
                    newPosition,
                    newPosition
                );

                editor.selection = newSelection;
            });
    });
};

const getFileName = (uri: vscode.Uri) => {
    // Remove all the path before the current workspace folder
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0].uri.path;
    if (!workspaceFolder) {
        return uri.path;
    }

    return `.${uri.path.replace(workspaceFolder, '')}`;
};

const isClassName = (lineText: string, text: string) => {
    const tryRegex = (regex: RegExp) => {
        const match = regex.exec(lineText);
        return match && match[1].includes(text);
    };

    const classNameRegex = /className=["'](.*)["']/g;
    const classRegex = /class=["'](.*)["']/g;

    return tryRegex(classNameRegex) || tryRegex(classRegex);
};
