// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { WeeklyDataProiver } from "./postDataProvider"
import { GithubClient, PostBlog } from "./weeklyDownloader"
import { Marked } from "marked-ts"


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	vscode.window.registerTreeDataProvider('weeklyExplorer', new WeeklyDataProiver());
	vscode.commands.registerCommand("Weekly.ViewPost", (node:PostBlog) => {
		const panel = vscode.window.createWebviewPanel(
			"Weekly",
			"Weekly" + node.FileName,
			vscode.ViewColumn.One,
		);
		panel.webview.html = GetWebViewContent(node.FileName);
	})
}

function GetWebViewContent(filename: string) : string {
	let content = GithubClient.GetPostContent(filename);
	return Marked.parse(content);
}

// this method is called when your extension is deactivated
export function deactivate() {}
