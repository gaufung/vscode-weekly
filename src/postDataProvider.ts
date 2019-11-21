import * as vscode from "vscode"
import { PostBlog, GithubClient} from "./weeklyDownloader"

export class WeeklyDataProiver implements vscode.TreeDataProvider<PostBlog>{
    onDidChangeTreeData?: vscode.Event<PostBlog|null|undefined>|undefined;
    data:PostBlog[];
    constructor(){
        this.data = GithubClient.GetPosts()
    }
    getTreeItem(element:PostBlog):vscode.TreeItem|Thenable<vscode.TreeItem>{
        return {
            label:element.label,
            command:element.ViewCommand
        }
    }
    getChildren(element?: PostBlog|undefined):vscode.ProviderResult<PostBlog[]>{
        GithubClient.GetPosts();
        if(element === undefined){
            return this.data;
        }
        return null;
    }
}