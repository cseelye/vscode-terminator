// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	registerCommands(context);
}

// this method is called when your extension is deactivated
export function deactivate() {}

function registerCommands(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand("vscode-terminator.launchTerminal", launchTerminal);
	context.subscriptions.push(disposable);
}

function launchTerminal() {
	const settings = vscode.workspace.getConfiguration("terminator");
	console.log("Launching terminal");
}
