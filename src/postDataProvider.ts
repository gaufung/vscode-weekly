import * as vscode from "vscode"
import { SyncRequestClient } from "ts-sync-request" 

export class WeeklyDataProiver implements vscode.TreeDataProvider<PostBlog>{
    onDidChangeTreeData?: vscode.Event<PostBlog|null|undefined>|undefined;
    data:PostBlog[];
    constructor(){
        this.data = this.GetPost()
    }
    getTreeItem(element:PostBlog):vscode.TreeItem|Thenable<vscode.TreeItem>{
        return {
            label:element.label,
            command:element.ViewCommand
        }
    }
    getChildren(element?: PostBlog|undefined):vscode.ProviderResult<PostBlog[]>{
        this.GetPost();
        if(element === undefined){
            return this.data;
        }
        return null;
    }

    private GetPost() : PostBlog[]{
        let userAgent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36"
        let response = new SyncRequestClient().addHeader("User-Agent", userAgent).get<object[]>("https://api.github.com/repos/ruanyf/weekly/contents/docs")
        var posts = new Array<PostBlog>(response.length);
        posts = response.map(a=>{
            let fileName = JSON.parse(JSON.stringify(a))['name']
            return new PostBlog(fileName);
        })
        return posts
    }
}

export class PostBlog extends vscode.TreeItem{
    private fileName :string;

    constructor(fileName:string) {
        var label = PostBlog.extractNumber(fileName);
        super(label, vscode.TreeItemCollapsibleState.None);
        this.fileName = fileName;
    }

    private static extractNumber(fileName: string):string{
        var numberPattern = new RegExp(/\d+/g);
        var result = fileName.match(numberPattern);
        if(result==null || result === undefined){
            return fileName;
        }else{
            return "周刊" + result[0];
        }
    }

    get FileName():string {
        return this.fileName;
    }

    public get ViewCommand(): vscode.Command {
        return {
            title:"View Post",
            command: "Weekly.ViewPost",
            arguments: [this]
        }
    }
}