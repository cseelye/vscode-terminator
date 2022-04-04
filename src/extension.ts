import * as vscode from 'vscode';
import * as ts from "typescript";

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


interface TerminalConfig {
	name: string;
	icon: string;
	color: string;
	message: string;
	workDir: string;
	env: { [key: string]: string };
	shellPath: string;
	shellArgs: [string];
}

function getDefinedTerminalNames() {
	const settings = vscode.workspace.getConfiguration("terminator");
	const terminalSettings = settings.get<Array<TerminalConfig>>("terminals");
	if (terminalSettings === undefined) {
		return [];
	}
	let names:Array<string> = [];
	for (let config of terminalSettings){
		names.push(config.name);
	}
	return names;
}

function getTerminalConfig(terminalName: string) {
	const settings = vscode.workspace.getConfiguration("terminator");
	const terminalSettings = settings.get<Array<TerminalConfig>>("terminals");
	if (terminalSettings === undefined) {
		return undefined;
	}
	for (let config of terminalSettings) {
		if (config.name === terminalName) {
			return config;
		}
	}
}

async function askUserForTerminal() {
	let names = getDefinedTerminalNames();
	if (names.length <= 0) {
		vscode.window.showWarningMessage("Please define a terminal in settings", "Open Settings").then(
			item => {
				vscode.commands.executeCommand('workbench.action.openSettings', '@ext:cseelye.vscode-terminator');
			}
		);
		return undefined;
	}
	let name = await vscode.window.showQuickPick(getDefinedTerminalNames(), {"placeHolder": "Select the terminal to launch"} );
	return name;
}

async function launchTerminal() {
	// Prompt the user to select a terminal
	let termName = await askUserForTerminal();
	if (termName === undefined) {
		return;
	}
	launchTerminalByName(termName);
}

function substituteVariable(source:string, vars: { [key: string]: string }) : string {
	if (source === undefined) {
		return source;
	}
	let replaced = source;
	for (let key in vars) {
		const re = new RegExp(`\\\${${key}}`);
		replaced = replaced.replace(re, vars[key]);
	}
	return replaced;
}

function launchTerminalByName(terminalName: string) {
	// Get the glocal settings
	const settings = vscode.workspace.getConfiguration("terminator");
	const envSettingsGlobal: { [key: string]: string } = settings.get("env", {});

	// Get the config for the selected terminal
	let config = getTerminalConfig(terminalName);
	if (config === undefined) {
		return vscode.window.showErrorMessage("Could not find terminal configuration for " + terminalName);
	}	
	let termColor = config.color ? new vscode.ThemeColor ( config.color ) : undefined;
	let termIcon = config.icon ? new vscode.ThemeIcon(config.icon) : undefined;

	// Combine global and local env variable settings and replace any ENV variables
	let consoleEnv:{ [key: string]: string } = {};
	Object.assign(consoleEnv, envSettingsGlobal);
	for (let key in config.env) {
		consoleEnv[key] = config.env[key];
	}

	// Substitute any ENV variables in the terminal command/args
	let shellPath = substituteVariable(config.shellPath, consoleEnv);
	let shellArgs = config.shellArgs;
	for (let idx=0; idx < shellArgs.length; idx++) {
		shellArgs[idx] = substituteVariable(shellArgs[idx], consoleEnv);
	}

	// Launch the terminal
	let term = vscode.window.createTerminal({
		color: termColor,
		cwd: config.workDir,
		env: consoleEnv,
		iconPath: termIcon,
		name: config.name,
		message: config.message,
		shellPath: shellPath,
		shellArgs: shellArgs
	});
	term.show(false); // false means focus on the terminal
}
