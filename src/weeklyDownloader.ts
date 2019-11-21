import * as vscode from "vscode"
import request from "sync-request"

export class GithubClient {
    private static userAgent : string = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36";
    private static accept : string = "application/vnd.github.v3.raw+json";
    private static directoryPath : string = "https://api.github.com/repos/ruanyf/weekly/contents/docs";
    private static contentPath : string = "https://api.github.com/repos/ruanyf/weekly/contents/docs/";

    public static GetPosts() : PostBlog[] {
        let options : any = {
            headers : {
                "User-Agent" : GithubClient.userAgent
            }
        }
        let res = request("GET", GithubClient.directoryPath, options);
        let body = res.getBody('utf-8');
        let posts = <any[]> JSON.parse(body);
        let blogs : PostBlog[] = posts.map(a => new PostBlog(a["name"]));
        return blogs.sort((a, b)=>{
            if (a.Index > b.Index) {
                return -1;
            }
            if(a.Index < b.Index) {
                return 1;
            }
            return 0;
        })
    }

    public static GetPostContent(fileName : string) : string {
        let options : any = {
            headers : {
                "User-Agent" : GithubClient.userAgent,
                "Accept" : GithubClient.accept
            }
        }
        let res = request("GET", GithubClient.contentPath + fileName, options);
        var body = res.getBody('utf-8');
        return body;
    }
}


export class PostBlog extends vscode.TreeItem {

    private fileName : string;

    private index : Number;

    private static numberPattern = new RegExp(/\d+/g);

    constructor(fileName : string){
        let index : Number = PostBlog.extractIndex(fileName);
        let label : string;
        if (index == -1) {
            label = PostBlog.extractFileName(fileName)
        }else{
            label = "周刊" + index;
        }
        super(label, vscode.TreeItemCollapsibleState.None);
        this.fileName = fileName;
        this.index = index;
    }

    private static extractIndex(fileName : string) : Number {
        var match = fileName.match(PostBlog.numberPattern);
        if (match == null || match === undefined) {
            return -1;
        }else{
            return Number(match[0]);
        }
    }

    private static extractFileName(fileName : string) : string {
        let index = fileName.lastIndexOf(".");
        return fileName.substring(0, index);
    }

    get FileName() : string {
        return this.fileName;
    }

    get Index() : Number {
        return this.index;
    }

    public get ViewCommand() : vscode.Command {
        return {
            title:"View Post",
            command: "Weekly.ViewPost",
            arguments: [this]
        }
    }
}